from pydantic import BaseModel,EmailStr,ConfigDict
from typing import Optional
from datetime import datetime
from . models import SlotStatus

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


# =====================SLOTS SCHEMAS====================

class CreateSlots(BaseModel):
    service_id : int
    start_time: datetime
    end_time: datetime

class AddSlots(BaseModel):
    id: Optional[int]= None
    service_id : int
    start_time: datetime
    end_time: datetime
    status : SlotStatus    
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True) 