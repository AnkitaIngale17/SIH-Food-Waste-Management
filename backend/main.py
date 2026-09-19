from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Food Waste Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://annsetu-food-management-system.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/channels/voice/turn")
def voice_turn(payload: dict):
    transcript = payload.get("transcript", "")
    return {
        "transcript": transcript,
        "missing_slot": "quantity",
        "next_prompt": "ask_quantity.wav",
        "parsed_so_far": {},
    }