from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.user import User, Progress, Challenge, WorkoutHistory, Plan
from app.schemas import user as user_schemas
from app.core.security import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_in: user_schemas.UserCreate) -> User:
    db_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
        settings={"theme": "dark", "notifications": True}
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_user(db: Session, user_id: str, user_in: user_schemas.UserUpdate) -> User:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    
    update_data = user_in.dict(exclude_unset=True)
    
    # Check if profile is now complete
    if not user.is_profile_complete:
        if all([
            user.gender or ('gender' in update_data and update_data['gender']),
            user.age or ('age' in update_data and update_data['age']),
            user.height or ('height' in update_data and update_data['height']),
            user.current_goal or ('current_goal' in update_data and update_data['current_goal'])
        ]):
            update_data['is_profile_complete'] = True
    
    update_data['updated_at'] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def add_progress(db: Session, user_id: str, progress_in: user_schemas.ProgressCreate) -> Progress:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    
    db_progress = Progress(
        user_id=user_id,
        weight=progress_in.weight
    )
    
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


def get_user_progress(db: Session, user_id: str) -> List[Progress]:
    return db.query(Progress).filter(Progress.user_id == user_id).order_by(Progress.date).all()


def toggle_challenge(db: Session, user_id: str, challenge_id: str) -> Challenge:
    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id, 
        Challenge.user_id == user_id
    ).first()
    
    if not challenge:
        raise ValueError("Challenge not found")
    
    challenge.completed = not challenge.completed
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


def add_workout_history(db: Session, user_id: str, workout_in: user_schemas.WorkoutHistoryCreate) -> WorkoutHistory:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    
    db_workout = WorkoutHistory(
        user_id=user_id,
        workout_name=workout_in.workout_name,
        duration_minutes=workout_in.duration_minutes
    )
    
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout


def get_workout_history(db: Session, user_id: str) -> List[WorkoutHistory]:
    return db.query(WorkoutHistory).filter(
        WorkoutHistory.user_id == user_id
    ).order_by(WorkoutHistory.date.desc()).all()


def save_plan(db: Session, user_id: str, plan_data: Dict[str, Any]) -> Plan:
    # Деактивируем все предыдущие планы пользователя
    db.query(Plan).filter(Plan.user_id == user_id).update({"is_active": False})
    
    db_plan = Plan(
        user_id=user_id,
        plan_data=plan_data,
        is_active=True
    )
    
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def get_current_plan(db: Session, user_id: str) -> Optional[Plan]:
    return db.query(Plan).filter(
        Plan.user_id == user_id,
        Plan.is_active == True
    ).order_by(Plan.created_at.desc()).first()


def upgrade_to_premium(db: Session, user_id: str) -> User:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    
    user.role = "premium"
    user.updated_at = datetime.utcnow()
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user 