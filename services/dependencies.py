from fastapi import Depends
from services.bot import Chatbot

async def get_bot():
    return Chatbot