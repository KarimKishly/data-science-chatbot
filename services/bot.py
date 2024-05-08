from services.bot_states import BotStates
import json, joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from random import choice
from services.booking_calendar import BookingCalendar
from datetime import datetime
from services.date_extraction import extract_and_convert_date
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import Sequential, load_model
from sklearn.preprocessing import LabelEncoder
import os


class Chatbot:
    state = BotStates.INIT_STATE

    patient_name = None
    patient_case = None

    day = None
    hour = None
    day_hour = None

    end = False

    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'

    le: LabelEncoder = joblib.load('assets/label_encoder.joblib')
    model: Sequential = load_model('assets/neural_network.h5')
    tfidf_vectorizer: TfidfVectorizer = joblib.load('assets/nn_vectorizer.joblib')

    with open('assets/chatbot/bot_greetings.txt', 'r') as f:
        greetings: list = json.loads(f.read())
    with open('assets/chatbot/appointment_suggestion.txt', 'r') as f:
        suggestion: list = json.loads(f.read())
    with open('assets/chatbot/bot_confirmation.txt', 'r') as f:
        confirmation: list = json.loads(f.read())
    with open('assets/chatbot/bot_rejection_response.txt', 'r') as f:
        rejection_response: list = json.loads(f.read())

    calendar: BookingCalendar = BookingCalendar()

    @staticmethod
    def respond(message: str):
        if Chatbot.state == BotStates.INIT_STATE:
            response = Chatbot.__resolveInitState(message)
        elif Chatbot.state == BotStates.GREETING_STATE:
            response = Chatbot.__resolveGreetingState(message)
        elif Chatbot.state == BotStates.APPOINTMENT_SUGGESTION:
            response = Chatbot.__resolveAppointmentSuggestion(message)
        elif Chatbot.state == BotStates.BOOKING_DISCUSSION:
            response = Chatbot.__resolveBookingConfirmation(message)
        elif Chatbot.state == BotStates.PATIENT_NAME:
            response = Chatbot.__resolveBookingConfirmation(message)
        elif Chatbot.state == BotStates.END_CONVERSATION:
            Chatbot.state = BotStates.APPOINTMENT_SUGGESTION
            Chatbot.patient_name = None
            Chatbot.patient_case = None
            Chatbot.day = None
            Chatbot.hour = None
            Chatbot.day_hour = None
            Chatbot.end = True
            return
        if response == 'NA':
            response = 'I am still a chatbot under development. Please rephrase your statement so that I can understand.'
        return response
    @staticmethod
    def __resolveInitState(message: str) -> str:
        analysis = Chatbot.__analyzeMessage(message)
        if analysis == 'patient_greet':
            Chatbot.state = BotStates.GREETING_STATE
            return choice(Chatbot.greetings)
        else:
            return 'NA'
    @staticmethod
    def __resolveGreetingState(message: str) -> str:
        analysis = Chatbot.__analyzeMessage(message)
        if analysis == 'patient_issue':
            Chatbot.patient_case = message
            Chatbot.state = BotStates.APPOINTMENT_SUGGESTION
            return ('I appreciate you voicing your concerns and would like to offer you a visit to our clinic. '
                    'May I ask for your availability in order to schedule an appointment?')
        else:
            return 'Please state your case so that I can provide further assistance.'
    @staticmethod
    def __resolveAppointmentSuggestion(message: str) -> str:

        analysis = ''

        if not Chatbot.day:
            chosen_date = extract_and_convert_date(message)
        else:
            chosen_date = extract_and_convert_date(message, Chatbot.day)
            analysis = Chatbot.__analyzeMessage(message)

        if chosen_date == datetime.fromtimestamp(0):
            pass
        if analysis == 'patient_rejection':
            Chatbot.day = None
            Chatbot.hour = None
            Chatbot.day_hour = None
            return 'No problem, let us look for another time.'
        elif chosen_date.hour == 0:
            Chatbot.day = chosen_date
            availableHours = Chatbot.calendar.getUnbookedAppointmentsByDay(Chatbot.day)
            if len(availableHours) == 0:
                Chatbot.day = None
                Chatbot.hour = None
                Chatbot.day_hour = None
                return 'Sorry, there are no appointments available on this day. Please pick another day.'
            else:
                dayString = ''
                hoursString = ''
                date = availableHours[0][0]
                hours = sorted(availableHours[0][1])
                dayString += datetime.fromisocalendar(date.year, date.week, date.weekday).strftime("%A, %B %d")
                for hour in hours:
                    hoursString += f"\t - {str(hour) + ' AM' if hour < 12 else str(hour % 12) + ' PM'}\n"
                return f'Great! The available appointments on {dayString} are:\n {hoursString}'
        else:
            analysis = Chatbot.__analyzeMessage(message)
            if Chatbot.hour is not None:
                if analysis == 'patient_confirmation':
                    Chatbot.state = BotStates.PATIENT_NAME
                    return 'Please provide your name to complete the booking.'
            Chatbot.day_hour = chosen_date
            Chatbot.day = chosen_date
            Chatbot.hour = chosen_date.hour
            if Chatbot.calendar.checkAvailableAppointment(Chatbot.day_hour):
                return 'We have an availability at that time. Would you like to book an appointment?'
            else:
                return 'Sorry, there are no appointments available on the chosen date. Please pick another date.'
    @staticmethod
    def __resolveBookingConfirmation(message: str) -> str:
        Chatbot.patient_name = message
        Chatbot.calendar.bookAppointment(Chatbot.day_hour, Chatbot.patient_name, Chatbot.patient_case)
        Chatbot.state = BotStates.END_CONVERSATION
        return choice(Chatbot.confirmation)
    @staticmethod
    def __analyzeMessage(message: str) -> str:
        analysis = Chatbot.le.inverse_transform(tf.math.argmax(Chatbot.model
                                            .predict(Chatbot.tfidf_vectorizer
                                                     .transform(np.array([message])).toarray()), axis=1))
        return analysis[0]


if __name__ == '__main__':
    chatbot = Chatbot()
    chatbot.calendar.setAvailableAppointments([
        datetime(2024, 4, 15, 18),
        datetime(2024, 4, 15, 19),
        datetime(2024, 4, 16, 17),
        datetime(2024, 4, 16, 14)
    ])
    while not chatbot.end:
        print(chatbot.respond(input('Enter your message: ')))
    print('Available appointments:', chatbot.calendar.availableAppointments)
    print('Booked appointments:', chatbot.calendar.bookedAppointments)
