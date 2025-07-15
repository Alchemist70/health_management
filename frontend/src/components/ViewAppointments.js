import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification.js";
import "../styles/ViewAppointments.css";

const ViewAppointments = () => {
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [historicalAppointments, setHistoricalAppointments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  const isAppointmentElapsed = (appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const now = new Date();
    return appointmentDate < now;
  };

  const checkAndUpdateElapsedAppointments = async () => {
    const elapsedAppointments = activeAppointments.filter(
      (apt) => apt.status === "scheduled" && isAppointmentElapsed(apt)
    );

    for (const apt of elapsedAppointments) {
      try {
        await handleStatusUpdate(apt.id, "elapsed");
      } catch (error) {
        console.error(
          `Failed to mark appointment ${apt.id} as elapsed:`,
          error
        );
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    console.log("Current user role:", userRole);
    fetchAppointments();

    // Check for elapsed appointments every minute
    const intervalId = setInterval(checkAndUpdateElapsedAppointments, 60000);
    return () => clearInterval(intervalId);
  }, [navigate, token]);

  const fetchAppointments = async () => {
    try {
      console.log("\n=== Fetching Appointments ===");
      console.log("User Role:", userRole);
      console.log("Token:", token ? "Present" : "Missing");

      const endpoint = userRole === "doctor" ? "doctor" : "patient";
      console.log("Using endpoint:", `/api/appointments/${endpoint}`);

      const API_BASE = process.env.REACT_APP_API_URL || "";
      const response = await axios.get(
        `${API_BASE}/api/appointments/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        // Process appointments
        const appointments = response.data.map((apt) => ({
          ...apt,
          symptoms: apt.symptoms || "None specified",
          notes: apt.notes || "None",
        }));

        console.log("Processed appointments:", appointments);

        const active = appointments.filter(
          (apt) =>
            (apt.status === "scheduled" || apt.status === "pending") &&
            !isAppointmentElapsed(apt)
        );

        const historical = appointments.filter(
          (apt) =>
            apt.status === "completed" ||
            apt.status === "cancelled" ||
            apt.status === "rejected" ||
            apt.status === "elapsed" ||
            (apt.status === "scheduled" && isAppointmentElapsed(apt))
        );

        console.log("Active appointments:", active);
        console.log("Historical appointments:", historical);

        setActiveAppointments(active);
        setHistoricalAppointments(historical);

        // Update any elapsed appointments in the backend
        checkAndUpdateElapsedAppointments();
      } else {
        console.error("Invalid data format received:", response.data);
        setNotification({
          message: "Failed to fetch appointments: Invalid data format",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      console.error("Error response:", error.response);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      }
      setNotification({
        message:
          error.response?.data?.message || "Failed to fetch appointments",
        type: "error",
      });
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setIsLoading(true);
      setNotification(null);

      const API_BASE = process.env.REACT_APP_API_URL || "";
      const response = await axios.put(
        `${API_BASE}/api/appointments/update-status`,
        {
          id: appointmentId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setNotification({
          message: `Appointment ${newStatus.toLowerCase()} successfully`,
          type: "success",
        });
        await fetchAppointments();
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setNotification({
        message:
          error.response?.data?.message ||
          "Failed to update appointment status. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "";
      await axios.put(
        `${API_BASE}/api/appointments/cancel`,
        { id: appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNotification({
        message: "Appointment cancelled successfully",
        type: "success",
      });
      fetchAppointments();
    } catch (error) {
      setNotification({
        message: "Failed to cancel appointment",
        type: "error",
      });
    }
  };

  const renderAppointmentCard = (appointment) => (
    <div
      key={appointment.id}
      className="appointment-card"
      onClick={() => navigate(`/appointments/view/${appointment.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="appointment-header">
        <span className={`status ${appointment.status.toLowerCase()}`}>
          {appointment.status}
        </span>
        <span className="date">
          {new Date(appointment.appointment_date).toLocaleDateString()}
        </span>
      </div>

      <div className="appointment-body">
        <h3>
          {userRole === "doctor"
            ? `Patient: ${appointment.patient_name}`
            : `Doctor: ${appointment.doctor_name}`}
        </h3>
        <p className="time">Time: {appointment.appointment_time}</p>
        <div className="appointment-details">
          <p className="symptoms">
            <strong>Symptoms:</strong>{" "}
            {appointment.symptoms || "None specified"}
          </p>
          <p className="notes">
            <strong>Notes:</strong> {appointment.notes || "None"}
          </p>
        </div>
      </div>

      {userRole === "doctor" && (
        <div className="appointment-actions">
          {appointment.status.toLowerCase() === "pending" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(appointment.id, "scheduled");
                }}
                className="action-button approve"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Approve"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(appointment.id, "rejected");
                }}
                className="action-button reject"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Reject"}
              </button>
            </>
          )}
          {appointment.status.toLowerCase() === "scheduled" &&
            !isAppointmentElapsed(appointment) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(appointment.id, "completed");
                }}
                className="action-button complete"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Mark as Completed"}
              </button>
            )}
        </div>
      )}
    </div>
  );

  return (
    <div className="view-appointments">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="appointments-header">
        <h2>My Appointments</h2>
        {userRole === "patient" && (
          <button className="book-now-button" onClick={() => navigate("/book")}>
            Book New Appointment
          </button>
        )}
      </div>

      <div className="appointments-section">
        <h3>Active Appointments</h3>
        <div className="appointments-grid">
          {activeAppointments.length === 0 ? (
            <div className="no-appointments">
              <div className="empty-state">
                <i className="far fa-calendar-times"></i>
                <p>No active appointments</p>
              </div>
            </div>
          ) : (
            activeAppointments.map(renderAppointmentCard)
          )}
        </div>
      </div>

      <div className="appointments-section">
        <h3>Appointment History</h3>
        <div className="appointments-grid">
          {historicalAppointments.length === 0 ? (
            <div className="no-appointments">
              <div className="empty-state">
                <i className="far fa-calendar-times"></i>
                <p>No appointment history</p>
              </div>
            </div>
          ) : (
            historicalAppointments.map(renderAppointmentCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAppointments;
