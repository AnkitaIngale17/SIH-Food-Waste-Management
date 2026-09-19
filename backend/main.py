# backend/main.py
from fastapi import FastAPI

app = FastAPI(title="Food Waste Platform API")


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/channels/voice/turn")
def voice_turn(payload: dict):
    """
    Stub endpoint for the Asterisk AGI script to POST transcripts to.
    Real extraction logic comes later — for now, always asks for quantity
    so you can test the AGI turn-loop plumbing end to end.
    """
    transcript = payload.get("transcript", "")
    return {
        "transcript": transcript,
        "missing_slot": "quantity",
        "next_prompt": "ask_quantity.wav",
        "parsed_so_far": {},
    }