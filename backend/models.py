# backend/models.py
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Organisation(Base):
    __tablename__ = "organisation"

    id = Column(Integer, primary_key=True)
    type = Column(String(20), nullable=False)  # kitchen | ngo | shelter | community_kitchen | volunteer
    name = Column(String(200), nullable=False)
    address = Column(String(300))
    latitude = Column(Float)
    longitude = Column(Float)
    phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organisation")


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    org_id = Column(Integer, ForeignKey("organisation.id"), nullable=True)
    role = Column(String(20), nullable=False)  # kitchen | restaurant | volunteer
    full_name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    phone = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    organisation = relationship("Organisation", back_populates="users")