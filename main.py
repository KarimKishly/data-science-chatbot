from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from routes import bot_router, clinician_router
from services.bot import Chatbot

tags_metadata = [
    {
        "name": "Bot",
        "description": "Endpoints involving interacting with the bot",
    },
    {
        "name": "Clinician",
        "description": "Endpoints involving clinician's portal"
    }
]

app = FastAPI(version='1.0', title='Clinician Chatbot',
              description="Chatbot that facilitates booking an appointment at a clinic.",
              openapi_tags=tags_metadata)

chatbot = Chatbot()

app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],
                   )

app.include_router(
    bot_router.router,
    prefix="/bot",
    tags=["Bot"]
)

app.include_router(
    clinician_router.router,
    prefix="/clinician",
    tags=["Clinician"]
)