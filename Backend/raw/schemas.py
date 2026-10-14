from pydantic import BaseModel,EmailStr,ConfigDict
from typing import Optional
from datetime import datetime
from . models import SlotStatus,BookingStatus

class TokenData(BaseModel):
    id: Optional[int]= None


# =====================USER SCHEMAS=====================
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_admin: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


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



#===============BOOKING SCHEMAS==============
class CreateBooking(BaseModel):
    slot_id :int
    
    

class AddBooking(BaseModel):
    id: Optional[int]= None
    slot_id :int
    user_id:int
    status: BookingStatus  
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True) 

 
