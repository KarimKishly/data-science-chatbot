import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

export default function CalendarComp({
  bookedAppointments,
  onDateSelect,
  onDateChange,
}) {
  const [dateState, setDateState] = useState(new Date());

  const filterAppointmentsByDate = (date) => {
    const selectedDate = moment(date).format("YYYY-MM-DD");
    const filteredAppointments = Object.keys(bookedAppointments).reduce(
      (acc, key) => {
        const formattedKey = key.replace(/"/g, "");
        const datePart = formattedKey.split("T")[0];
        if (datePart === selectedDate) {
          acc = bookedAppointments[key];
        }
        return acc;
      },
      []
    );
    return filteredAppointments;
  };

  const changeDate = (date) => {
    setDateState(date);
    const filteredAppointments = filterAppointmentsByDate(date);
    console.log(filteredAppointments);
    onDateSelect(filteredAppointments);
    onDateChange(date);
  };

  const tileClassName = ({ date }) => {
    const selectedDate = moment(date).format("YYYY-MM-DD");
    const appointments = filterAppointmentsByDate(selectedDate);
    return appointments.length > 0 ? "has-appointments" : null;
  };

  return (
    <div>
      <style>{`
        .has-appointments {
          background-color: red;
          color: white;
        }
        
        .react-calendar{
          width: 500px;
        }

      `}</style>
      <Calendar
        value={dateState}
        onChange={changeDate}
        // tileContent={tileContent}
        tileClassName={tileClassName}
      />
      {/* <p>
        Current selected date is{" "}
        <b>{moment(dateState).format("MMMM Do YYYY")}</b>
        <br />
        <b>{moment(dateState).format("YYYY-MM-DD")}</b>
      </p> */}
    </div>
  );
}
