from fastapi import APIRouter
from pydantic import BaseModel
from routes.bot_router import Chatbot
import json
from datetime import datetime

router = APIRouter()


class Message(BaseModel):
    message: str


@router.post("/setAvailability")
async def set_availability(dates: list[datetime]):
    try:
        Chatbot.calendar.setAvailableAppointments(dates)
        return {"status": "ok"}
    except:
        return {"status": "error"}

@router.get("/getBookedAppointments")
async def get_booked_appointments():
    if len(Chatbot.calendar.bookedAppointments) == 0:
        return {}
    return {json.dumps(datetime.fromisocalendar(key.year, key.week, key.weekday).isoformat()) : value
            for key, value in Chatbot.calendar.bookedAppointments.items()}