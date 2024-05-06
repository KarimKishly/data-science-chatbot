import React, { useState, useEffect } from "react";
import axios from "axios";

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
        [tempAvailability] // Send selected availability as an array
      );
      console.log(response.data); // Log the server response
      // Update availability in UI state
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
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Clinician Chatbot</h1>
      <div className="mb-4">
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Clinician</h2>
        <div className="mb-4">
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
        <div>
          <h3 className="text-lg font-semibold">Booked Appointments</h3>
          <button
            onClick={getBookedAppointments}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Booked Appointments
          </button>
          <ul>
            {Object.entries(bookedAppointments).map(([date, appointments]) => (
              <li key={date}>
                <h4 className="font-semibold">{date}</h4>
                <ul>
                  {appointments.map((appointment, index) => (
                    <li key={index}>
                      <p>Hour: {appointment.hour}</p>
                      <p>Patient: {appointment.patient}</p>
                      <p>Case: {appointment.case}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
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
