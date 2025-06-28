import React, { useEffect, useState } from "react";
import axios from "axios";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token"); // ✅ Fix: Declare token here

  useEffect(() => {
    axios
      .get("http://localhost:5000/appointments", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure token is included
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, [token]); // ✅ Include token as dependency

  const handleUpdate = async (id, status) => {
    try {
      await axios.put(
        "http://localhost:5000/update-status",
        { id, status },
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Fix: Use backticks for `Bearer ${token}`
        }
      );
      alert("Updated!");

      // Update the local state to reflect the change
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === id ? { ...appt, status } : appt
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {appt.patient_id} booked with Doctor {appt.doctor_id} on{" "}
            {appt.appointment_date} - Status: {appt.status}
            <button onClick={() => handleUpdate(appt.id, "Completed")}>
              Mark as Completed
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsList;
