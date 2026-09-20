from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models import User, Organisation, SurplusListing
from auth import hash_password, verify_password, create_access_token, get_current_user_payload

app = FastAPI(title="Food Waste Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
        db.flush()

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

@app.get("/kitchen/dashboard")
def kitchen_dashboard(
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == token_payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    org = db.query(Organisation).filter(Organisation.id == user.org_id).first() if user.org_id else None

    listings = (
        db.query(SurplusListing)
        .filter(SurplusListing.org_id == user.org_id)
        .order_by(SurplusListing.created_at.desc())
        .all()
    )

    return {
        "kitchenName": org.name if org else user.full_name,
        "forecast": {
            "headline": "Not enough history yet",
            "points": [],
            "reasons": [],
        },
        "risk": {"label": "Not calculated yet"},
        "brief": None,
        "listings": [
            {
                "id": l.id,
                "foodItem": l.food_item,
                "quantity": l.quantity,
                "unit": l.unit,
                "urgency": l.urgency,
                "status": l.status,
                "pickupBy": l.pickup_by.isoformat() if l.pickup_by else None,
            }
            for l in listings
        ],
    }

class ReportSurplusRequest(BaseModel):
    foodItem: str
    quantity: float
    unit: str
    cookedAt: str
    pickupBy: str
    notes: str | None = None
    urgency: str = "medium"


@app.post("/kitchen/report-surplus")
def report_surplus(
    payload: ReportSurplusRequest,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == token_payload["user_id"]).first()
    if not user or not user.org_id:
        raise HTTPException(status_code=400, detail="No organisation linked to this user")

    listing = SurplusListing(
        org_id=user.org_id,
        food_item=payload.foodItem,
        quantity=payload.quantity,
        unit=payload.unit,
        urgency=payload.urgency,
        status="confirmed",
        cooked_at=datetime.fromisoformat(payload.cookedAt),
        pickup_by=datetime.fromisoformat(payload.pickupBy),
        notes=payload.notes,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    return {
        "id": listing.id,
        "foodItem": listing.food_item,
        "quantity": listing.quantity,
        "unit": listing.unit,
        "urgency": listing.urgency,
        "status": listing.status,
        "pickupBy": listing.pickup_by.isoformat(),
    }