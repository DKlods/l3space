from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.services import ai_service, user_service
from app.db.base import get_db

router = APIRouter()


@router.post("/generate-plan")
async def generate_plan(
    *,
    db: Session = Depends(get_db),
    goal: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate a personalized fitness and diet plan.
    """
    try:
        if not current_user.is_profile_complete:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User profile is not complete. Cannot generate a personalized plan."
            )
        
        plan_data = await ai_service.generate_plan(current_user, goal)
        
        # Сохраняем план в базе данных
        user_service.save_plan(db, user_id=current_user.id, plan_data=plan_data)
        
        return plan_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating plan: {str(e)}"
        )


@router.post("/chat-config")
async def get_chat_config(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_premium_user),
) -> Any:
    """
    Get configuration for AI chat. Only available for premium users.
    """
    try:
        # Получаем текущий план пользователя
        plan = user_service.get_current_plan(db, user_id=current_user.id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active plan found"
            )
        
        # Создаем конфигурацию для чата
        system_instruction = await ai_service.get_chat_system_instruction(plan.plan_data)
        chat_config = await ai_service.GeminiClient().create_chat(system_instruction)
        
        return chat_config
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating chat configuration: {str(e)}"
        ) 