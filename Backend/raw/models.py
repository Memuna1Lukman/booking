from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, UniqueConstraint,Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class SlotStatus(str, enum.Enum):
    open = "open"
    booked = "booked"
    cancelled = "cancelled"


class BookingStatus(str, enum.Enum):
    confirmed = "confirmed"
    cancelled = "cancelled"


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=True)
    is_admin = Column(Boolean, nullable=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bookings = relationship("Bookings", back_populates="user")


class Services(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    slots = relationship("AvailabilitySlot", back_populates="service")


class AvailabilitySlot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(SlotStatus), nullable=False, default=SlotStatus.open)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    service = relationship("Services", back_populates="slots")
    booking = relationship("Bookings", back_populates="slot", uselist=False)


class Bookings(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False, unique=True)  # <-- double-booking guard
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.confirmed)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    slot = relationship("AvailabilitySlot", back_populates="booking")
    user = relationship("Users", back_populates="bookings")