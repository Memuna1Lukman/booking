from fastapi import APIRouter,HTTPException,status,Depends
from sqlalchemy.exc import IntegrityError
from .. import models,schemas,oauth
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List
from datetime import date,timedelta,datetime


router = APIRouter(
    tags=["Slots"],
    prefix="/slots"
)

@router.post("", response_model=schemas.AddSlots, status_code=status.HTTP_201_CREATED)
def create_slots(slot:schemas.CreateSlots,db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_admin)):
    # confirm the referenced service actually exists
    service = db.query(models.Services).filter(models.Services.id == slot.service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    # change into a dict
    slot_dict = slot.model_dump()
    
    # # how do i make sure that thee endtime and the start time are different and also the endtime is greater than the start time let me try
    if  slot_dict["start_time"] >= slot_dict["end_time"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Badd request")

    add_slots = models.AvailabilitySlot(**slot_dict)
    try:
        db.add(add_slots)
        db.commit()
        db.refresh(add_slots)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not create slot")
    return add_slots


@router.get("", response_model=List[schemas.AddSlots])
def get_slots(
    db: Session = Depends(get_db),
    date_filter: date | None = None,
    service_id: int | None = None,
):
    # only get all the slots that are still open
    query = db.query(models.AvailabilitySlot).filter(
        models.AvailabilitySlot.status == models.SlotStatus.open
    )
    if date_filter is not None:
        start_of_day = datetime.combine(date_filter,datetime.min.time())
        end_of_day = start_of_day + timedelta(days=1)
        query = query.filter(
            models.AvailabilitySlot.start_time>=start_of_day,
            models.AvailabilitySlot.start_time < end_of_day
        )
    if service_id is not None:
        query = query.filter(models.AvailabilitySlot.service_id == service_id)
    query_slots = query.all()
    return query_slots   
 
  


@router.get("/{id}",response_model=schemas.AddSlots)
def get_specific_slot(id:int,db:Session = Depends(get_db)):
    # check whether id exist
    slot = db.query(models.AvailabilitySlot).filter(models.AvailabilitySlot.id == id).first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Slot Not Found")
    return slot
