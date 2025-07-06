from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, plans, ai

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(plans.router, prefix="/plans", tags=["plans"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"]) 