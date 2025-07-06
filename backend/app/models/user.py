from sqlalchemy import Boolean, Column, String, Integer, Float, ForeignKey, Table, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="user")  # user, premium, admin
    is_profile_complete = Column(Boolean, default=False)
    gender = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    height = Column(Float, nullable=True)
    current_goal = Column(String, nullable=True)  # gain_mass, get_ripped, maintain, diet_only
    settings = Column(JSON, default={"theme": "dark", "notifications": True})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    progress = relationship("Progress", back_populates="user")
    daily_challenges = relationship("Challenge", back_populates="user")
    workout_history = relationship("WorkoutHistory", back_populates="user")
    plans = relationship("Plan", back_populates="user")


class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    weight = Column(Float)
    
    user = relationship("User", back_populates="progress")


class Challenge(Base):
    __tablename__ = "challenges"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String)  # water, steps, workout, sleep
    title = Column(String)
    goal = Column(Float)
    current = Column(Float, default=0)
    unit = Column(String)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="daily_challenges")


class WorkoutHistory(Base):
    __tablename__ = "workout_history"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    workout_name = Column(String)
    duration_minutes = Column(Integer)
    
    user = relationship("User", back_populates="workout_history")


class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    plan_data = Column(JSON)  # Stores the entire plan as JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="plans") 