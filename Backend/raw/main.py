from fastapi import FastAPI,Response
from . import models
from .database import engine
from .routes import auth,users,services,slots
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(services.router)
app.include_router(slots.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://booking-one-brown.vercel.app"], # React Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)