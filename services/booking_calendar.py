from datetime import datetime

class BookingCalendar:
    def __init__(self):
        self.availableAppointments = {}
        self.bookedAppointments = {}
    def setAvailableAppointments(self, appointments: list[datetime]):
        for appointment in appointments:
            if appointment.isocalendar() not in self.availableAppointments.keys():
                self.availableAppointments[appointment.isocalendar()] = []
            self.availableAppointments[appointment.isocalendar()].append(appointment.hour)
    def addAvailableAppointment(self, appointment: datetime):
        if appointment.isocalendar() not in self.availableAppointments.keys():
            self.availableAppointments[appointment.isocalendar()] = []
        self.availableAppointments[appointment.isocalendar()].append(appointment.hour)
    def getUnbookedAppointments(self):
        unbookedAppointments = {}
        for appointment in self.availableAppointments.keys():
            if appointment not in self.bookedAppointments.keys():
                unbookedAppointments[appointment] = []
                for hour in self.availableAppointments[appointment]:
                    unbookedAppointments[appointment].append(hour)
            elif appointment in self.bookedAppointments.keys():
                for hour in self.availableAppointments[appointment]:
                    if hour not in list(map(lambda booking: booking['hour'], self.bookedAppointments[appointment])):
                        if appointment not in unbookedAppointments.keys():
                            unbookedAppointments[appointment] = []
                        unbookedAppointments[appointment].append(hour)
        sorted_appointments = sorted(unbookedAppointments.items(), key=lambda item: item[0])
        return sorted_appointments
    def getUnbookedAppointmentsByDay(self, day: datetime):
        return list(filter(lambda app: app[0] == day.isocalendar(), self.getUnbookedAppointments()))
    def bookAppointment(self, appointment: datetime, patient: str, case: str):
        if appointment.isocalendar() not in self.availableAppointments.keys():
            return False
        elif appointment.isocalendar() in self.availableAppointments.keys():
            if not self.availableAppointments[appointment.isocalendar()].__contains__(appointment.hour):
                return False
        if appointment.isocalendar() not in self.bookedAppointments.keys():
            self.bookedAppointments[appointment.isocalendar()] = []
        dayAppointments: list = self.bookedAppointments.get(appointment.isocalendar())
        availableBooking = True
        for dayAppointment in dayAppointments:
            if dayAppointment['hour'] == appointment.hour:
                availableBooking = False
        if availableBooking:
            self.bookedAppointments[appointment.isocalendar()].append({
                'hour': appointment.hour,
                'patient': patient,
                'case': case
            })

    def checkAvailableAppointment(self, appointment: datetime) -> bool:
        if appointment.isocalendar() not in self.availableAppointments.keys():
            return False
        elif appointment.isocalendar() in self.availableAppointments.keys():
            if not self.availableAppointments[appointment.isocalendar()].__contains__(appointment.hour):
                return False
        if appointment.isocalendar() not in self.bookedAppointments.keys():
            self.bookedAppointments[appointment.isocalendar()] = []
        dayAppointments: list = self.bookedAppointments.get(appointment.isocalendar())
        availableBooking = True
        for dayAppointment in dayAppointments:
            if dayAppointment['hour'] == appointment.hour:
                availableBooking = False
        return availableBooking

