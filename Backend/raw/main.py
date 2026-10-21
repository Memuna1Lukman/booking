from fastapi import FastAPI, Response
import models
from database import engine
from routes import auth, users, services, slots, bookings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://booking-one-brown.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def greet():
    return {"message": "Hellooo!"}

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(services.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(bookings.router, prefix="/booking")
