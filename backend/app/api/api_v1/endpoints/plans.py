from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User, Plan
from app.services import user_service
from app.db.base import get_db

router = APIRouter()


@router.post("/generate", status_code=status.HTTP_201_CREATED)
def generate_plan(
    *,
    db: Session = Depends(get_db),
    plan_data: Dict[str, Any],
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate and save a new plan for the user.
    """
    if not current_user.is_profile_complete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User profile is not complete. Cannot generate a personalized plan."
        )
    
    plan = user_service.save_plan(db, user_id=current_user.id, plan_data=plan_data)
    return plan.plan_data


@router.get("/current")
def get_current_plan(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get the current active plan for the user.
    """
    plan = user_service.get_current_plan(db, user_id=current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found"
        )
    return plan.plan_data 