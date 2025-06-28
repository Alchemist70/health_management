import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ManageSchedule.css";

const ManageSchedule = () => {
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notification, setNotification] = useState(null);
  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // Check if user is logged in and is a doctor
    if (!token) {
      navigate("/login");
      return;
    }

    if (userRole !== "doctor") {
      navigate("/");
      return;
    }

    if (!doctorId) {
      console.error("Doctor ID not found in localStorage");
      setNotification({
        type: "error",
        message: "User ID not found. Please try logging in again.",
      });
      return;
    }

    console.log("Initializing ManageSchedule with:", {
      doctorId,
      userRole,
      hasToken: !!token,
    });

    fetchTimeSlots();
  }, [navigate, token, doctorId, userRole]);

  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/available-slots/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTimeSlots(response.data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setNotification({
        type: "error",
        message: "Please select both date and time",
      });
      return;
    }

    try {
      const requestData = {
        date: selectedDate,
        time: selectedTime,
      };

      console.log("Token being sent:", token);
      console.log("Request data:", requestData);
      console.log("Request headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      const response = await axios.post(
        "http://localhost:5000/api/appointments/add-slot",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Full server response:", response);
      console.log("Response data:", response.data);

      setNotification({
        type: "success",
        message: "Time slot added successfully",
      });
      fetchTimeSlots();
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      setNotification({
        type: "error",
        message: error.response?.data?.error || "Failed to add time slot",
      });
    }
  };

  const handleRemoveSlot = async (slotId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/remove-slot/${slotId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification({
        type: "success",
        message: "Time slot removed successfully",
      });
      fetchTimeSlots();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.error || "Failed to remove time slot",
      });
    }
  };

  // Generate time options (9 AM to 5 PM)
  const timeOptions = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  return (
    <div className="manage-schedule-container">
      <div className="manage-schedule-header">
        <h1>Manage Your Schedule</h1>
        <p>Add or remove your available time slots</p>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="schedule-management">
        <div className="add-slot-section">
          <h2>Add New Time Slot</h2>
          <form onSubmit={handleAddSlot}>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="add-slot-button">
              Add Time Slot
            </button>
          </form>
        </div>

        <div className="slots-list-section">
          <h2>Available Time Slots</h2>
          <div className="slots-grid">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot) => (
                <div key={slot.id} className="slot-card">
                  <div className="slot-info">
                    <span className="slot-date">
                      {new Date(slot.slot_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="slot-time">{slot.slot_time}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSlot(slot.id)}
                    className="remove-slot-button"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="no-slots">
                <p>No time slots available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;
