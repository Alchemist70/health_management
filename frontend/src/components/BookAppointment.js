import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import "../styles/App.css";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/doctors");
      setDoctors(response.data);
    } catch (error) {
      setError("Failed to fetch doctors");
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/appointments/available-slots?doctorId=${selectedDoctor}&date=${selectedDate}`
      );
      setAvailableSlots(response.data);
    } catch (error) {
      setError("Failed to fetch available slots");
    }
  };

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/appointments/book",
        {
          doctorId: selectedDoctor,
          date: selectedDate,
          time: selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Booking response:", response.data);

      setSuccessMessage(
        response.data.emailMessage || "Appointment booked successfully!"
      );
      setShowModal(true);

      // Clear form
      setSelectedDoctor("");
      setSelectedDate("");
      setSelectedTime("");
      setAvailableSlots([]);
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSuccessMessage("");
    // Navigate to appointments page
    navigate("/appointments");
  };

  return (
    <div className="book-appointment-container">
      <h2>Book an Appointment</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="doctor">Select Doctor</label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Select Date</label>
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
          <label htmlFor="time">Select Time</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            disabled={!selectedDate || availableSlots.length === 0}
          >
            <option value="">Select a time</option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.time}>
                {slot.time}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="book-button" disabled={isLoading}>
          {isLoading ? "Booking..." : "Book Appointment"}
        </button>
      </form>

      <Modal isOpen={showModal} onClose={handleModalClose}>
        <p>{successMessage}</p>
      </Modal>
    </div>
  );
};

export default BookAppointment;
