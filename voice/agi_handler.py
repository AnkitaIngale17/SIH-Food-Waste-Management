#!/opt/voice-env/bin/python3
"""
AGI handler — records the caller, transcribes with faster-whisper,
sends the transcript to the backend's extractor, confirms parsed details,
and creates the listing once confirmed.
"""

import sys
import os
import time
import logging
import requests
from datetime import datetime, timedelta
from faster_whisper import WhisperModel

# ---- config -------------------------------------------------------
BACKEND_URL = "https://annsetu-food-management-system.onrender.com"
RECORDING_DIR = "/tmp"
LOG_PATH = "/tmp/agi_handler.log"
MAX_TURNS = 5
DEFAULT_PICKUP_HOURS = 2

logging.basicConfig(
    filename=LOG_PATH,
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
log = logging.getLogger("agi_handler")

log.info("Loading whisper model...")
model = WhisperModel("base", device="cpu", compute_type="int8")
log.info("Model loaded.")


def agi_read_env():
    env = {}
    while True:
        line = sys.stdin.readline().strip()
        if line == "":
            break
        key, _, value = line.partition(":")
        env[key.strip()] = value.strip()
    return env


def agi_command(cmd):
    sys.stdout.write(cmd + "\n")
    sys.stdout.flush()
    response = sys.stdin.readline().strip()
    log.info(f"AGI CMD: {cmd!r} -> {response!r}")
    return response


def agi_stream_file(filename):
    agi_command(f'STREAM FILE "{filename}" ""')


def agi_record(path_no_ext):
    agi_command(f'RECORD FILE "{path_no_ext}" wav "#" 8000 0 BEEP s=3')


def transcribe(path_no_ext):
    wav_path = path_no_ext + ".wav"
    if not os.path.exists(wav_path):
        log.warning(f"No recording found at {wav_path}")
        return ""
    try:
        segments, _ = model.transcribe(wav_path, language="en")
        text = " ".join(seg.text.strip() for seg in segments).strip()
        log.info(f"Transcribed: {text!r}")
        return text
    except Exception:
        log.exception("Transcription failed")
        return ""


def get_caller_phone(env):
    raw = env.get("agi_callerid", "")
    if not raw or raw.lower() == "unknown":
        log.warning("No caller ID present on this call.")
        return None
    return raw


def main():
    env = agi_read_env()
    caller_phone = get_caller_phone(env)

    agi_stream_file("beep")  # Initial beep: start speaking

    combined_transcript = ""
    parsed = {}

    for turn in range(MAX_TURNS):
        rec_path = f"{RECORDING_DIR}/voice_turn_{int(time.time())}_{turn}"
        agi_record(rec_path)

        text = transcribe(rec_path)
        if text:
            combined_transcript = (combined_transcript + " " + text).strip()

        try:
            resp = requests.post(
                f"{BACKEND_URL}/channels/voice/turn",
                json={"transcript": combined_transcript},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            log.info(f"/channels/voice/turn -> {data}")
        except requests.RequestException:
            log.exception("Call to /channels/voice/turn failed")
            agi_stream_file("beep")
            agi_command("HANGUP")
            return

        parsed = data.get("parsed_so_far", {})
        missing_slot = data.get("missing_slot")

        # If all details are extracted, proceed immediately to creation
        if not missing_slot:
            break

        # If something is missing, beep and prompt for next turn
        agi_stream_file("beep")
    else:
        log.warning("Ran out of turns without completing extraction.")
        agi_stream_file("beep")
        agi_command("HANGUP")
        return

    pickup_by = parsed.get("pickupBy") or (
        datetime.utcnow() + timedelta(hours=DEFAULT_PICKUP_HOURS)
    ).isoformat()

    payload = {
        "callerPhone": caller_phone or "demo-phone",
        "foodItem": parsed.get("foodItem") or "Unspecified",
        "quantity": parsed.get("quantity") or 0,
        "unit": parsed.get("unit") or "packets",
        "pickupBy": pickup_by,
    }
    log.info(f"Creating listing: {payload}")

    try:
        resp = requests.post(
            f"{BACKEND_URL}/channels/voice/create-listing",
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        log.info(f"Listing created successfully: {resp.json()}")
        agi_stream_file("beep")  # Success confirmation beep
    except requests.RequestException:
        log.exception("Call to /channels/voice/create-listing failed")
        agi_stream_file("beep")

    agi_command("HANGUP")

if __name__ == "__main__":
    try:
        main()
    except Exception:
        log.exception("Unhandled exception in main()")
        try:
            agi_command("HANGUP")
        except Exception:
            pass
