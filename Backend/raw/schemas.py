from pydantic import BaseModel,EmailStr,ConfigDict
from typing import Optional
from datetime import datetime


class TokenData(BaseModel):
    id: Optional[int]= None


#=====================  Services Schema======================
class PostServices(BaseModel):
    name: str
    duration_minutes: str


class AddServices(BaseModel):
    id: Optional[int]= None
    name: str
    duration_minutes: str  
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True) 