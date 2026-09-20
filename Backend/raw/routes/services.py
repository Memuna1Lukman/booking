from fastapi import APIRouter,HTTPException,status,Depends
from sqlalchemy.exc import IntegrityError
from .. import models,schemas,oauth
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List


router = APIRouter(
    tags=["Services"],
    prefix="/services"
)


@router.post("/",response_model=schemas.AddServices,status_code=status.HTTP_201_CREATED)
def created_services(service:schemas.PostServices,db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_admin)):
    services_dict = service.model_dump()
    add_services = models.Services(**services_dict)
    try:
        db.add(add_services)
        db.commit()
        db.refresh(add_services)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="there is a conflict")
    return add_services    


@router.get("/",response_model=List[schemas.AddServices])
def get_services(db:Session = Depends(get_db)):
    # check services exist that is does the user have any services

    services = db.query(models.Services).all()
    return services

@router.get("/{id}",response_model=schemas.AddServices)
def get_unique_service(id:int,db:Session = Depends(get_db)):
    # check whether the service with that id exist
    service = db.query(models.Services).filter(models.Services.id == id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Service Not Found")