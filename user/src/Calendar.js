import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

export default function CalendarComp({ bookedAppointments, onDateSelect }) {
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
  };

  // Function to check if a day has appointments
  //   const tileContent = ({ date, view }) => {
  //     if (view === "month") {
  //       const selectedDate = moment(date).format("YYYY-MM-DD");
  //       const appointments = filterAppointmentsByDate(selectedDate);
  //       if (appointments.length > 0) {
  //         return (
  //           <div
  //             style={{
  //               backgroundColor: "red",
  //               borderRadius: "50%",
  //               height: "20px",
  //               width: "20px",
  //             }}
  //           />
  //         );
  //       }
  //     }
  //   };

  // Function to style the day tiles
  const tileClassName = ({ date }) => {
    const selectedDate = moment(date).format("YYYY-MM-DD");
    const appointments = filterAppointmentsByDate(selectedDate);
    return appointments.length > 0 ? "has-appointments" : null;
  };

  return (
    <>
      <style>{`
        .has-appointments {
          background-color: red;
          color: white;
        }
      `}</style>
      <Calendar
        value={dateState}
        onChange={changeDate}
        // tileContent={tileContent}
        tileClassName={tileClassName}
      />
      <p>
        Current selected date is{" "}
        <b>{moment(dateState).format("MMMM Do YYYY")}</b>
        <br />
        <b>{moment(dateState).format("YYYY-MM-DD")}</b>
      </p>
    </>
  );
}
