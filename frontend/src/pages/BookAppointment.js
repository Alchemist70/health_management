import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.js";
import "../styles/BookAppointment.css";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    symptoms: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const API_BASE = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    console.log("Component mounted. UserId:", userId);
    console.log("Token:", token);
    fetchDoctors();
    fetchPatientEmail();
  }, [navigate, token]);

  const fetchPatientEmail = async () => {
    if (!userId || !token) {
      console.error("Missing userId or token:", { userId, token });
      return;
    }

    try {
      console.log("Fetching patient email for userId:", userId);
      console.log("Using token:", token);

      const response = await axios.get(`${API_BASE}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Full patient data response:", response.data);

      if (response.data && response.data.email) {
        console.log("Successfully retrieved email:", response.data.email);
        setPatientEmail(response.data.email);
      } else {
        console.error("No email in response data:", response.data);
        // Try to get email from localStorage as fallback
        const localEmail = localStorage.getItem("userEmail");
        if (localEmail) {
          console.log("Using email from localStorage:", localEmail);
          setPatientEmail(localEmail);
        }
      }
    } catch (err) {
      console.error(
        "Error fetching patient email:",
        err.response?.data || err.message
      );
      // Try to get email from localStorage as fallback
      const localEmail = localStorage.getItem("userEmail");
      if (localEmail) {
        console.log(
          "Using email from localStorage after fetch error:",
          localEmail
        );
        setPatientEmail(localEmail);
      }
    }
  };

  const fetchDoctors = async () => {
    try {
      console.log("Fetching doctors with token:", token);
      const response = await axios.get(`${API_BASE}/api/appointments/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Doctors response:", response.data);
      setDoctors(response.data);
    } catch (err) {
      console.error(
        "Error fetching doctors:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to fetch doctors");
      }
    }
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setError("");
    setTimeSlots([]);
    setSelectedDate("");
    setSelectedTime("");

    try {
      console.log("Fetching slots for doctor:", doctor.id);
      const response = await axios.get(
        `${API_BASE}/api/appointments/available-slots/${doctor.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Received slots response:", response.data);

      if (Array.isArray(response.data)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter out any invalid slots
        const validSlots = response.data.filter((slot) => {
          if (!slot.slot_date || !slot.slot_time || !slot.is_available) {
            return false;
          }

          const slotDate = new Date(slot.slot_date);
          return slotDate >= today;
        });

        console.log("Valid slots after filtering:", validSlots);

        if (validSlots.length === 0) {
          console.log("No valid slots found after filtering");
          setError("No available time slots found for this doctor");
          setTimeSlots([]);
        } else {
          console.log("Setting time slots:", validSlots);
          setTimeSlots(validSlots);
        }
      } else {
        console.error("Invalid response format:", response.data);
        setError("Failed to load time slots. Please try again.");
        setTimeSlots([]);
      }
    } catch (err) {
      console.error(
        "Error fetching time slots:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error || "Failed to fetch available time slots"
        );
        setTimeSlots([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowModal(false);
    setSuccessMessage("");

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError("Please select a doctor, date, and time slot");
      return;
    }

    // Validate appointment time is not in the past
    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const currentDateTime = new Date();

    if (appointmentDateTime < currentDateTime) {
      setError("Appointment time cannot be in the past");
      return;
    }

    try {
      const bookingData = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        symptoms: formData.symptoms.trim() || "None specified",
        notes: formData.notes.trim() || "None",
      };

      console.log("Attempting to book appointment with data:", bookingData);

      const response = await axios.post(
        `${API_BASE}/api/appointments/book`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking response:", response.data);
      console.log("Current patient email value:", patientEmail);

      if (response.status === 201) {
        // If we don't have patientEmail, try to fetch it again
        if (!patientEmail) {
          console.log("No patient email found, fetching again...");
          await fetchPatientEmail();
        }

        const emailToDisplay =
          patientEmail ||
          localStorage.getItem("userEmail") ||
          "your registered email";
        setSuccessMessage(
          `Appointment booked successfully! A confirmation email has been sent to your registered email @ ${emailToDisplay}`
        );
        setShowModal(true);
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.error ||
            "Failed to book appointment. Please try again."
        );
      }
    }
  };

  // Get unique dates from time slots and sort them
  const availableDates = [
    ...new Set(timeSlots.map((slot) => slot.slot_date)),
  ].sort();

  // Get available times for selected date and sort them
  const availableTimes = timeSlots
    .filter((slot) => slot.slot_date === selectedDate)
    .map((slot) => slot.slot_time)
    .sort();

  const handleModalClose = () => {
    setShowModal(false);
    setSuccessMessage("");
    navigate("/patient-dashboard");
  };

  return (
    <div className="book-appointment-container">
      <div className="book-appointment-header">
        <h1>Book an Appointment</h1>
        <p>Schedule your visit with our experienced healthcare professionals</p>
      </div>

      <div className="appointment-form">
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Select Doctor</h2>
            <div className="doctor-selection">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`doctor-card ${
                    selectedDoctor?.id === doctor.id ? "selected" : ""
                  }`}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="doctor-info">
                    <div className="doctor-avatar">👨‍⚕️</div>
                    <div className="doctor-details">
                      <h3>{doctor.name}</h3>
                      <p>{doctor.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedDoctor && (
            <>
              <div className="form-section">
                <h2>Select Date & Time</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <select
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    >
                      <option value="">Select a date</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <select
                      id="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      disabled={!selectedDate}
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Additional Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="symptoms">Symptoms</label>
                    <textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
                      placeholder="Please describe your symptoms..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-button">
                Book Appointment
              </button>
            </>
          )}
        </form>
      </div>

      <Modal isOpen={showModal} onClose={handleModalClose}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 56, color: "#4caf50", marginBottom: 12 }}>
            <i className="fas fa-check-circle" aria-hidden="true"></i>
          </div>
          <p
            style={{
              fontSize: "1.15rem",
              color: "#222",
              marginBottom: 24,
              marginTop: 0,
              textAlign: "center",
            }}
          >
            {successMessage}
          </p>
          <button
            className="modal-close-button"
            onClick={handleModalClose}
            autoFocus
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BookAppointment;
