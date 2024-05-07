import React, { useState, useEffect } from "react";

const Calendar1 = ({ bookedAppointments }) => {
  const [nav, setNav] = useState(0); // Navigation for months
  const [clicked, setClicked] = useState(null); // Clicked date
  const [events, setEvents] = useState([]); // Event array

  useEffect(() => {
    if (bookedAppointments) {
      setEvents(bookedAppointments);
    }
  }, [bookedAppointments]);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const nextMonth = () => {
    setNav(nav + 1);
  };

  const prevMonth = () => {
    setNav(nav - 1);
  };

  const generateCalendarDays = () => {
    const dt = new Date();
    if (nav !== 0) {
      dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

    const calendarDays = [];

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = i > paddingDays ? i - paddingDays : null;
      const dayString = daySquare ? `${month + 1}/${daySquare}/${year}` : null;

      calendarDays.push(
        <div
          key={i}
          className={`p-2 text-center border ${
            daySquare === day && nav === 0 ? "bg-gray-200" : ""
          }`}
          onClick={() => daySquare && openModal(dayString)}
        >
          {daySquare}
          {daySquare &&
            Array.isArray(events) &&
            events.find &&
            events.find((event) => event.date === dayString) && (
              <div className="bg-red-500 w-2 h-2 rounded-full mx-auto mt-1"></div>
            )}
        </div>
      );
    }

    return calendarDays;
  };

  const openModal = (date) => {
    setClicked(date);
    console.log("Clicked date:", date);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg">
      <div
        id="monthDisplay"
        className="text-lg font-bold mb-4"
      >{`${new Date().toLocaleDateString("en-us", {
        month: "long",
      })} ${new Date().getFullYear()}`}</div>
      <div id="weekdays" className="flex">
        {weekdays.map((day) => (
          <div key={day} className="flex-1 text-center font-semibold">
            {day}
          </div>
        ))}
      </div>
      <div id="calendar" className="grid grid-cols-7 gap-2 mt-4">
        {calendarDays}
      </div>
      <button
        id="backButton"
        onClick={prevMonth}
        className="mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back
      </button>
      <button
        id="nextButton"
        onClick={nextMonth}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Calendar1;
