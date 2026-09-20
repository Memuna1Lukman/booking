from fastapi import APIRouter,HTTPException,status,Depends
from sqlalchemy.exc import IntegrityError
from .. import models,schemas,oauth
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List
from datetime import date,timedelta,datetime


router = APIRouter(
    tags=["Booking"],
    prefix="/booking"
)