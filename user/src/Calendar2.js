// Calendar.js
import React, { useState, useEffect } from "react";

const Calendar2 = ({ bookedAppointments }) => {
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getDaysInMonth(year, month);
    setDaysInMonth(days);
  }, [bookedAppointments]);

  // Function to get the number of days in a month
  const getDaysInMonth = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  // Function to count the number of appointments for a given day
  const countAppointmentsForDay = (day) => {
    const appointments = bookedAppointments[day] || [];
    return appointments.length;
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {daysInMonth.map((day, index) => (
        <div key={index} className="flex flex-col items-center justify-center">
          <p>{day}</p>
          {[...Array(countAppointmentsForDay(day))].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-red-500 rounded-full my-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar2;
