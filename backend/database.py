# backend/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise ValueError("DATABASE_URL is missing. Check your .env file.")

engine = create_engine(database_url)
SessionLocal = sessionmaker(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()