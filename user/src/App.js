import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar2 from "./Calendar2";
import Calendar1 from "./Calendar1";
import CalendarComp from "./Calendar";

const App = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [availability, setAvailability] = useState([]);
  const [tempAvailability, setTempAvailability] = useState(""); // Temporary state for selected date/time
  const [bookedAppointments, setBookedAppointments] = useState([]);

  useEffect(() => {
    getBookedAppointments();
  }, []); // Fetch booked appointments on component mount

  const sendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:8000/bot/message", {
        message,
      });
      setResponse(response.data.response); // Set the response from the server
    } catch (error) {
      console.error(error);
    }
  };

  const resetBot = async () => {
    try {
      const response = await axios.patch("http://localhost:8000/bot/reset");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const setClinicianAvailability = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/clinician/setAvailability",
        [tempAvailability]
      );
      console.log(response.data);
      setAvailability([...availability, tempAvailability]);
      // Reset temporary state
      setTempAvailability("");
    } catch (error) {
      console.error(error);
    }
  };

  const getBookedAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/clinician/getBookedAppointments"
      );
      setBookedAppointments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clinician Chatbot</h1>
      <div className="Bot mb-4">
        <h2 className="text-xl font-semibold">Bot</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Message
        </button>
        <p className="mt-2">Response: {response}</p>
        <button
          onClick={resetBot}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Reset Bot
        </button>
      </div>
      <div className="Clinician mb-4">
        <h2 className="text-xl font-semibold">Clinician</h2>
        <div className="Set-availability mb-4">
          <h3 className="text-lg font-semibold">Set Availability</h3>
          <input
            type="datetime-local"
            value={tempAvailability}
            onChange={(e) => setTempAvailability(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 mr-2"
          />
          <button
            onClick={setClinicianAvailability}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Set Availability
          </button>
          {availability.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold">Available slots:</h4>
              <ul>
                {availability.map((slot, index) => (
                  <li key={index}>{slot}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="Booked-Appointments">
          <h3 className="text-lg font-semibold">Booked Appointments</h3>
          <button
            onClick={getBookedAppointments}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Booked Appointments
          </button>
          <div className="mt-2 border border-gray-300 rounded p-4">
            {Object.entries(bookedAppointments).map(([date, appointments]) => (
              <div key={date} className="mb-4">
                <h4 className="font-semibold">{date}</h4>
                <div className="ml-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-semibold">Hour: {appointment.hour}</p>
                      <p>Patient: {appointment.patient}</p>
                      <p>Case: {appointment.case}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* <table className="mt-2 border border-gray-300 rounded p-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Appointments</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(bookedAppointments).map(
                ([date, appointments]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{countAppointmentsForDay(date)}</td>
                  </tr>
                )
              )}
            </tbody>
          </table> */}
          {/* <Calendar2 bookedAppointments={bookedAppointments} /> */}
          {/* <Calendar1 bookedAppointments={bookedAppointments} /> */}
          <CalendarComp />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Current States</h2>
        <p>Message: {message}</p>
        <p>Response: {response}</p>
        <p>Availability: {JSON.stringify(availability)}</p>
        <p>Temp Availability: {tempAvailability}</p>
        <p>Booked Appointments: {JSON.stringify(bookedAppointments)}</p>
      </div>
    </div>
  );
};

export default App;
