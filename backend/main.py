# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import User, Organisation
from auth import hash_password, verify_password, create_access_token

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


class SignupRequest(BaseModel):
    fullName: str
    organisationName: str | None = None
    email: str
    phone: str | None = None
    password: str
    role: str


class LoginRequest(BaseModel):
    email: str
    password: str
    role: str


@app.post("/auth/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    org = None
    if payload.organisationName:
        org = Organisation(type=payload.role, name=payload.organisationName)
        db.add(org)
        db.flush()  # gets org.id before commit

    user = User(
        org_id=org.id if org else None,
        role=payload.role,
        full_name=payload.fullName,
        email=payload.email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email, "role": user.role, "user_id": user.id})
    return {"accessToken": token, "role": user.role}


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email, "role": user.role, "user_id": user.id})
    return {"accessToken": token, "role": user.role}


@app.post("/channels/voice/turn")
def voice_turn(payload: dict):
    transcript = payload.get("transcript", "")
    return {
        "transcript": transcript,
        "missing_slot": "quantity",
        "next_prompt": "ask_quantity.wav",
        "parsed_so_far": {},
    }