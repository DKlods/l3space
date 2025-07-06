from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class GoalType(str, Enum):
    gain_mass = "gain_mass"
    get_ripped = "get_ripped"
    maintain = "maintain"
    diet_only = "diet_only"


class ChallengeType(str, Enum):
    water = "water"
    steps = "steps"
    workout = "workout"
    sleep = "sleep"


class UserRole(str, Enum):
    user = "user"
    premium = "premium"
    admin = "admin"


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class UserSettings(BaseModel):
    theme: str = "dark"
    notifications: bool = True


class ProgressBase(BaseModel):
    weight: float


class ProgressCreate(ProgressBase):
    pass


class Progress(ProgressBase):
    id: str
    date: datetime
    
    class Config:
        orm_mode = True


class ChallengeBase(BaseModel):
    type: ChallengeType
    title: str
    goal: float
    current: float = 0
    unit: str
    completed: bool = False


class ChallengeCreate(ChallengeBase):
    pass


class Challenge(ChallengeBase):
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True


class WorkoutHistoryBase(BaseModel):
    workout_name: str
    duration_minutes: int


class WorkoutHistoryCreate(WorkoutHistoryBase):
    pass


class WorkoutHistory(WorkoutHistoryBase):
    id: str
    date: datetime
    
    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[Gender] = None
    age: Optional[int] = None
    height: Optional[float] = None
    current_goal: Optional[GoalType] = None
    settings: Optional[UserSettings] = None


class UserInDB(UserBase):
    id: str
    role: UserRole = UserRole.user
    is_profile_complete: bool = False
    gender: Optional[Gender] = None
    age: Optional[int] = None
    height: Optional[float] = None
    current_goal: Optional[GoalType] = None
    settings: UserSettings
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class User(UserInDB):
    progress: List[Progress] = []
    daily_challenges: List[Challenge] = []
    workout_history: List[WorkoutHistory] = []


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str
    exp: int 