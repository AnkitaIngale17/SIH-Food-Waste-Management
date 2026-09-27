import os
import sys
from datetime import datetime, timedelta
import hashlib

# Ensure imports resolve from backend folder
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, get_db
from models import Base, User, Organisation, SurplusListing, ComplianceRecord
from auth import hash_password

def seed_database():
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("🧹 Clearing existing test data...")
    # Delete in reverse order of foreign key dependencies
    db.query(ComplianceRecord).delete()
    db.query(SurplusListing).delete()
    db.query(User).delete()
    db.query(Organisation).delete()
    db.commit()
    print("✅ All old test records, listings, and accounts wiped clean.")

    print("\n🌱 Seeding fresh demo data...")

    # 1. ORGANISATIONS (Pune Coordinates)
    kitchen_org = Organisation(
        type="kitchen",
        name="Hotel Shreyas Kitchen",
        phone="9822012345",
        address="1242 Apte Road, Deccan Gymkhana, Pune",
        latitude=18.5204,
        longitude=73.8427,
    )
    ngo_org = Organisation(
        type="ngo",
        name="Seva Sahayog Foundation",
        phone="9822054321",
        address="Kothrud, Pune",
        latitude=18.5074,
        longitude=73.8077,
    )
    db.add_all([kitchen_org, ngo_org])
    db.flush()

    # 2. DEMO USERS (Password for all: admin123)
    default_pwd = hash_password("admin123")

    kitchen_user = User(
        org_id=kitchen_org.id,
        role="kitchen",
        full_name="Chef Rajesh Shinde",
        email="kitchen@annsetu.org",
        phone="9822012345",
        password_hash=default_pwd,
    )
    recipient_user = User(
        org_id=ngo_org.id,
        role="restaurant",  # mapped as recipient organization in UI
        full_name="Pooja Kulkarni (NGO Lead)",
        email="ngo@annsetu.org",
        phone="9822054321",
        password_hash=default_pwd,
    )
    volunteer_user = User(
        org_id=None,
        role="volunteer",
        full_name="Rahul Deshmukh (Volunteer)",
        email="volunteer@annsetu.org",
        phone="9822099999",
        password_hash=default_pwd,
    )
    db.add_all([kitchen_user, recipient_user, volunteer_user])
    db.flush()

    # 3. ACTIVE SURPLUS LISTINGS
    now = datetime.utcnow()
    otp_code = "4821"
    otp_hash = hashlib.sha256(otp_code.encode()).hexdigest()

    listing1 = SurplusListing(
        org_id=kitchen_org.id,
        food_item="Vegetable Biryani & Dal",
        quantity=30.0,
        unit="kg",
        urgency="high",
        status="confirmed",
        cooked_at=now - timedelta(hours=2),
        pickup_by=now + timedelta(hours=3),
        notes="Packed in clean insulated stainless trays. Freshly cooked.",
    )
    listing2 = SurplusListing(
        org_id=kitchen_org.id,
        food_item="Chapati & Mixed Sabzi",
        quantity=50.0,
        unit="packets",
        urgency="medium",
        status="claimed",
        accepted_by_org_id=ngo_org.id,
        pickup_otp_hash=otp_hash,
        cooked_at=now - timedelta(hours=3),
        pickup_by=now + timedelta(hours=4),
        notes="Individual foil packets ready for immediate distribution.",
    )
    db.add_all([listing1, listing2])
    db.flush()

    # 4. COMPLIANCE & HISTORICAL IMPACT (So charts have verified data)
    compliance1 = ComplianceRecord(
        listing_id=listing2.id,
        donor_org_id=kitchen_org.id,
        recipient_org_id=ngo_org.id,
        food_item="Moong Dal Khichdi",
        quantity=45.0,
        unit="kg",
        delivered_at=now - timedelta(days=1),
    )
    compliance2 = ComplianceRecord(
        listing_id=listing2.id,
        donor_org_id=kitchen_org.id,
        recipient_org_id=ngo_org.id,
        food_item="Veg Pulao & Curd",
        quantity=60.0,
        unit="servings",
        delivered_at=now - timedelta(days=2),
    )
    db.add_all([compliance1, compliance2])

    db.commit()
    db.close()
    print("✅ Database successfully seeded with demo accounts and compliance history!")

if __name__ == "__main__":
    seed_database()