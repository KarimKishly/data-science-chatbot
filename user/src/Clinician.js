import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarComp from "./Calendar";
import moment from "moment";

function Clinician() {
  const [availability, setAvailability] = useState([]);
  const [tempAvailability, setTempAvailability] = useState(""); // Temporary state for selected date/time
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const storedAvailability = localStorage.getItem("availability");
    if (storedAvailability) {
      setAvailability(JSON.parse(storedAvailability));
    }
    getBookedAppointments();
  }, []);

  const setClinicianAvailability = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/clinician/setAvailability",
        [tempAvailability]
      );
      console.log(response.data);
      const updatedAvailability = [...availability, tempAvailability];
      setAvailability(updatedAvailability);
      localStorage.setItem("availability", JSON.stringify(updatedAvailability));
      // Reset temporary state
      setTempAvailability("");
    } catch (error) {
      console.error(error);
    }
  };

  const clearAvailability = () => {
    setAvailability([]);
    localStorage.removeItem("availability");
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

  const handleDateSelect = (appointments) => {
    setFilteredAppointments(appointments);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="Clinician mb-4">
        <h2 className="text-3xl font-semibold text-center">
          Clinician Page 🥼
        </h2>
        <div className="Set-availability mb-10 mt-2">
          <h3 className="text-lg font-semibold ">Set Availability</h3>
          <div className="input-and-buttons flex justify-between">
            <div className="left-part">
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
            </div>
            <button
              onClick={clearAvailability}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded "
            >
              Clear Availability
            </button>
          </div>
          {availability.length > 0 && (
            <div className="mt-2">
              <h3 className="text-lg font-semibold">
                Initial Available slots:
              </h3>
              <ul className="mt-2 border border-gray-300 rounded p-4">
                {availability.sort().map((slot, index) => (
                  <li key={index}>
                    {moment(slot).format("MMMM Do YYYY | hh:00 A")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex gap-10 justify-center border-t border-gray-300 pt-4">
          <CalendarComp
            bookedAppointments={bookedAppointments}
            onDateSelect={handleDateSelect}
            onDateChange={handleDateChange}
          />

          <div className="filtered">
            <h2 className="text-xl font-semibold">
              Appointments of {moment(selectedDate).format("MMMM Do YYYY")}
            </h2>
            <div className="mt-2 border border-gray-300 rounded p-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-semibold">
                      - Hour: {moment().hour(appointment.hour).format("h:00 A")}
                    </p>
                    <p>Patient: {appointment.patient}</p>
                    <p>Case: {appointment.case}</p>
                  </div>
                ))
              ) : (
                <p>No appointments for the selected date.</p>
              )}
            </div>
          </div>
        </div>
        <div className="Booked-Appointments mt-4">
          <h3 className="text-lg font-semibold">All Booked Appointments</h3>
          <button
            onClick={getBookedAppointments}
            className="hidden bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Booked Appointments
          </button>
          <div className="mt-2 border border-gray-300 rounded p-4">
            {Object.entries(bookedAppointments).map(([date, appointments]) => (
              <div key={date} className="mb-4 border-b border-gray-300">
                <h4 className="font-semibold">
                  {moment(date.replace(/"/g, "")).format("MMMM Do YYYY")}
                </h4>
                <div className="ml-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-semibold">
                        - Hour:{" "}
                        {moment().hour(appointment.hour).format("h:00 A")}
                      </p>
                      <p>Patient: {appointment.patient}</p>
                      <p>Case: {appointment.case}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="">
        <h2 className="text-xl font-semibold">Current States</h2>
        <p>Availability: {JSON.stringify(availability)}</p>
        {/* <p>Temp Availability: {tempAvailability}</p> */}
        <p>Booked Appointments: {JSON.stringify(bookedAppointments)}</p>
      </div>
    </>
  );
}

export default Clinician;
