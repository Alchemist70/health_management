import React, { useState } from "react";
import axios from "axios";

const DoctorAppointments = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage(
        `Appointment ${newStatus} successfully! A notification email has been sent to the patient.`
      );

      // Refresh appointments list
      fetchAppointments();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update appointment status"
      );
    }
  };

  return (
    <div className="doctor-appointments-container">
      <h2>Manage Appointments</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {/* ... rest of the component ... */}
    </div>
  );
};

export default DoctorAppointments;
