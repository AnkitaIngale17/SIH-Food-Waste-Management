from datetime import datetime
import secrets
import hashlib

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import User, Organisation, SurplusListing, ComplianceRecord
from auth import hash_password, verify_password, create_access_token, get_current_user_payload
from extractor import extract_surplus_fields

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
        "forecast": {"headline": "Not enough history yet", "points": [], "reasons": []},
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


@app.post("/kitchen/listings")
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


@app.get("/kitchen/listings/{listing_id}")
def get_listing(
    listing_id: int,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == token_payload["user_id"]).first()
    listing = db.query(SurplusListing).filter(
        SurplusListing.id == listing_id,
        SurplusListing.org_id == user.org_id,
    ).first()

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    return {
        "id": listing.id,
        "foodItem": listing.food_item,
        "title": listing.food_item,
        "quantity": listing.quantity,
        "unit": listing.unit,
        "urgency": listing.urgency,
        "status": listing.status,
        "pickupBy": listing.pickup_by.isoformat() if listing.pickup_by else None,
        "pickup": None,
        "recipient": None,
    }


@app.get("/recipient/offers")
def recipient_offers(
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    listings = (
        db.query(SurplusListing)
        .filter(SurplusListing.status == "confirmed")
        .order_by(SurplusListing.created_at.desc())
        .all()
    )

    result = []
    for l in listings:
        kitchen_org = db.query(Organisation).filter(Organisation.id == l.org_id).first()
        result.append({
            "id": l.id,
            "foodItem": l.food_item,
            "title": l.food_item,
            "quantity": l.quantity,
            "unit": l.unit,
            "pickupBy": l.pickup_by.isoformat() if l.pickup_by else None,
            "kitchen": {"name": kitchen_org.name if kitchen_org else "Kitchen"},
            "distanceKm": None,
        })
    return result


class RespondToOfferRequest(BaseModel):
    decision: str


@app.patch("/recipient/offers/{listing_id}")
def respond_to_offer(
    listing_id: int,
    payload: RespondToOfferRequest,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == token_payload["user_id"]).first()
    listing = db.query(SurplusListing).filter(SurplusListing.id == listing_id).first()

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if payload.decision == "accept":
        listing.status = "claimed"
        listing.accepted_by_org_id = user.org_id
        otp = f"{secrets.randbelow(10000):04d}"
        listing.pickup_otp_hash = hashlib.sha256(otp.encode()).hexdigest()
        db.commit()
        return {"status": "claimed", "otp_for_demo_only": otp}
    else:
        listing.status = "draft"
        db.commit()
        return {"status": "declined"}


@app.get("/volunteer/pickups/{listing_id}")
def get_pickup(
    listing_id: int,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    listing = db.query(SurplusListing).filter(SurplusListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Pickup not found")

    kitchen_org = db.query(Organisation).filter(Organisation.id == listing.org_id).first()
    recipient_org = (
        db.query(Organisation).filter(Organisation.id == listing.accepted_by_org_id).first()
        if listing.accepted_by_org_id else None
    )

    return {
        "id": listing.id,
        "foodItem": listing.food_item,
        "title": listing.food_item,
        "quantity": listing.quantity,
        "unit": listing.unit,
        "pickup": {"address": kitchen_org.address if kitchen_org else None,
                   "latitude": kitchen_org.latitude if kitchen_org else None,
                   "longitude": kitchen_org.longitude if kitchen_org else None},
        "recipient": {"address": recipient_org.address if recipient_org else None,
                      "latitude": recipient_org.latitude if recipient_org else None,
                      "longitude": recipient_org.longitude if recipient_org else None},
    }


class VerifyDeliveryRequest(BaseModel):
    otp: str


@app.post("/volunteer/pickups/{listing_id}/verify-delivery")
def verify_delivery(
    listing_id: int,
    payload: VerifyDeliveryRequest,
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    listing = db.query(SurplusListing).filter(SurplusListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Pickup not found")

    submitted_hash = hashlib.sha256(payload.otp.encode()).hexdigest()
    if submitted_hash != listing.pickup_otp_hash:
        raise HTTPException(status_code=400, detail="Incorrect code")

    listing.status = "delivered"

    record = ComplianceRecord(
        listing_id=listing.id,
        donor_org_id=listing.org_id,
        recipient_org_id=listing.accepted_by_org_id,
        food_item=listing.food_item,
        quantity=listing.quantity,
        unit=listing.unit,
    )
    db.add(record)
    db.commit()

    return {"status": "delivered"}

@app.get("/compliance/handovers")
def compliance_handovers(
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    records = db.query(ComplianceRecord).order_by(ComplianceRecord.delivered_at.desc()).all()

    result = []
    for r in records:
        donor = db.query(Organisation).filter(Organisation.id == r.donor_org_id).first()
        recipient = db.query(Organisation).filter(Organisation.id == r.recipient_org_id).first()
        result.append({
            "id": r.id,
            "reference": f"AS-{r.id:05d}",
            "deliveredAt": r.delivered_at.isoformat(),
            "kitchen": {"name": donor.name if donor else "Unknown"},
            "kitchenName": donor.name if donor else "Unknown",
            "recipient": {"name": recipient.name if recipient else "Unknown"},
            "recipientName": recipient.name if recipient else "Unknown",
            "foodItem": r.food_item,
            "quantity": r.quantity,
            "unit": r.unit,
        })
    return result


UNIT_TO_KG_ESTIMATE = {
    "kg": 1.0,
    "packets": 0.4,   # rough estimate: 400g per packet — adjust as needed
    "servings": 0.35,
    "trays": 2.5,
}


@app.get("/impact")
def impact(
    token_payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
):
    records = db.query(ComplianceRecord).all()

    meals_redistributed = sum(r.quantity for r in records)
    waste_prevented_kg = sum(
        r.quantity * UNIT_TO_KG_ESTIMATE.get(r.unit.lower(), 0.5)
        for r in records
    )
    rupees_saved = waste_prevented_kg * 40

    return {
        "mealsRedistributed": meals_redistributed,
        "wastePreventedKg": round(waste_prevented_kg, 1),
        "rupeesSaved": round(rupees_saved),
        "computations": {
            "mealsRedistributed": "Sum of verified delivered quantities across all handovers.",
            "wastePreventedKg": "Estimated kg-equivalent of verified deliveries, using per-unit weight estimates (e.g. ~0.4kg per packet).",
            "rupeesSaved": "Estimated at ₹40/kg of verified food redistributed (placeholder rate).",
        },
        "trend": [],
    }

class VoiceSurplusRequest(BaseModel):
    callerPhone: str
    foodItem: str
    quantity: float
    unit: str
    pickupBy: str


@app.post("/channels/voice/create-listing")
def create_listing_from_voice(payload: VoiceSurplusRequest, db: Session = Depends(get_db)):
    org = db.query(Organisation).filter(Organisation.phone == payload.callerPhone).first()
    if not org:
        raise HTTPException(status_code=404, detail="No kitchen registered with this phone number")

    listing = SurplusListing(
        org_id=org.id,
        food_item=payload.foodItem,
        quantity=payload.quantity,
        unit=payload.unit,
        urgency="medium",
        status="confirmed",
        cooked_at=datetime.utcnow(),
        pickup_by=datetime.fromisoformat(payload.pickupBy),
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    return {"id": listing.id, "status": "created"}

@app.post("/channels/voice/turn")
def voice_turn(payload: dict):
    transcript = payload.get("transcript", "")
    extracted = extract_surplus_fields(transcript)

    prompt_map = {
        "foodItem": "ask_food.wav",
        "quantity": "ask_quantity.wav",
        "pickupBy": "ask_pickup_time.wav",
    }

    return {
        "transcript": transcript,
        "missing_slot": extracted["missing_slot"],
        "next_prompt": prompt_map.get(extracted["missing_slot"]),
        "parsed_so_far": {
            "foodItem": extracted["foodItem"],
            "quantity": extracted["quantity"],
            "unit": extracted["unit"],
            "pickupBy": extracted["pickupBy"],
        },
    }