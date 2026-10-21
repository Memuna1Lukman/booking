from fastapi import APIRouter,HTTPException,status,Depends
from sqlalchemy.exc import IntegrityError
import models,schemas,oauth
from database import get_db
from sqlalchemy.orm import Session
from typing import List
from datetime import date,timedelta,datetime


router = APIRouter(
    tags=["Bookings"],
    prefix="/bookings"
)

@router.post("", response_model=schemas.AddBooking, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.AddBooking, status_code=status.HTTP_201_CREATED)
def create_bookings(booking:schemas.CreateBooking,db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    # does the slot exist?
    slots = db.query(models.AvailabilitySlot).filter(models.AvailabilitySlot.id == booking.slot_id).first()
    if not slots:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not found")
    # is it still opened?
    if slots.status != models.SlotStatus.open:
        
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="can not book")
    book_dict = booking.model_dump()
    add_bookings = models.Bookings(
        slot_id=booking.slot_id,
        user_id=current_user.id
    )
    try:
        db.add(add_bookings)
        slots.status = models.SlotStatus.booked
        db.commit()
        db.refresh(add_bookings)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Conflict")    
    return add_bookings


@router.get("", response_model=List[schemas.AddBooking])
@router.get("/", response_model=List[schemas.AddBooking])
def get_all_bookings(db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    # query to get the logged in users bookings
    bookings = db.query(models.Bookings).filter(
        models.Bookings.user_id == current_user.id
    ).all()
    return bookings



@router.get("/{id}",response_model=schemas.AddBooking)
def get_unique_booking(id:int,db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    bookings = db.query(models.Bookings).filter(
        models.Bookings.user_id == current_user.id,
        models.Bookings.id == id
    ).first()
    if not bookings:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not Found")
    return bookings



@router.delete("/{id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(id:int,db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    # whose bookings am i deleting
    del_bookings = db.query(models.Bookings).filter(
        models.Bookings.user_id == current_user.id,
        models.Bookings.id == id
    ).first()
    if not del_bookings:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not Found")
    slot = db.query(models.AvailabilitySlot).filter(
        models.AvailabilitySlot.id == del_bookings.slot_id
    ).first()
    slot.status = models.SlotStatus.open
    del_bookings.status = models.BookingStatus.cancelled   
    db.commit()
    return 