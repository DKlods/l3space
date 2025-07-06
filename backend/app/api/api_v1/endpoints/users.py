from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.schemas.user import UserUpdate, User as UserSchema, Progress, WorkoutHistory, WorkoutHistoryCreate, ProgressCreate
from app.services import user_service
from app.db.base import get_db

router = APIRouter()


@router.get("/me", response_model=UserSchema)
def get_current_user(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=UserSchema)
def update_current_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update current user.
    """
    user = user_service.update_user(db, user_id=current_user.id, user_in=user_in)
    return user


@router.post("/me/premium", response_model=UserSchema)
def upgrade_to_premium(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upgrade current user to premium.
    """
    user = user_service.upgrade_to_premium(db, user_id=current_user.id)
    return user


@router.get("/me/progress", response_model=List[Progress])
def get_user_progress(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get user progress history.
    """
    progress = user_service.get_user_progress(db, user_id=current_user.id)
    return progress


@router.post("/me/progress", response_model=Progress)
def add_user_progress(
    *,
    db: Session = Depends(get_db),
    progress_in: ProgressCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add new progress entry.
    """
    progress = user_service.add_progress(db, user_id=current_user.id, progress_in=progress_in)
    return progress


@router.get("/me/workout-history", response_model=List[WorkoutHistory])
def get_workout_history(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get user workout history.
    """
    history = user_service.get_workout_history(db, user_id=current_user.id)
    return history


@router.post("/me/workout-history", response_model=WorkoutHistory)
def add_workout_history(
    *,
    db: Session = Depends(get_db),
    workout_in: WorkoutHistoryCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add new workout history entry.
    """
    history = user_service.add_workout_history(db, user_id=current_user.id, workout_in=workout_in)
    return history


@router.post("/me/challenge/{challenge_id}", response_model=UserSchema)
def toggle_challenge(
    *,
    db: Session = Depends(get_db),
    challenge_id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Toggle challenge completion status.
    """
    user_service.toggle_challenge(db, user_id=current_user.id, challenge_id=challenge_id)
    return current_user 