from enum import Enum

class BotStates(Enum):
    INIT_STATE = 0
    GREETING_STATE = 1
    APPOINTMENT_SUGGESTION = 2
    BOOKING_DISCUSSION = 3
    PATIENT_NAME = 4
    END_CONVERSATION = 5
