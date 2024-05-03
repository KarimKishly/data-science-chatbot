from fastapi import APIRouter


from services.bot import Chatbot
from pydantic import BaseModel
from services.bot_states import BotStates

router = APIRouter()

class Message(BaseModel):
    message: str

@router.post("/message")
async def send_message(message_model: Message):
    response = Chatbot.respond(message_model.message)
    return {'response': response}

@router.patch("/reset")
async def reset_bot_states():
    Chatbot.state = BotStates.INIT_STATE
    return {'state': Chatbot.state}

