const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticateToken } = require("../middleware/auth");

// Debug logging for route setup
console.log("Setting up appointment routes...");

// Get all doctors
router.get("/doctors", authenticateToken, appointmentController.getDoctors);

// Get patient's appointments
router.get(
  "/patient",
  authenticateToken,
  appointmentController.getPatientAppointments
);

// Get doctor's appointments
router.get(
  "/doctor",
  authenticateToken,
  appointmentController.getDoctorAppointments
);

// Get available slots for a doctor
router.get(
  "/available-slots/:doctorId",
  authenticateToken,
  appointmentController.getAvailableSlots
);

// Book an appointment
router.post("/book", authenticateToken, appointmentController.bookAppointment);

// Update appointment status
router.put(
  "/update-status",
  authenticateToken,
  appointmentController.updateStatus
);

// Add prescription
router.put(
  "/add-prescription",
  authenticateToken,
  appointmentController.addPrescription
);

// Get single appointment by ID
router.get(
  "/view/:appointmentId",
  authenticateToken,
  appointmentController.getAppointmentById
);

// Add a new time slot
router.post("/add-slot", authenticateToken, appointmentController.addTimeSlot);

// Remove a time slot
router.delete(
  "/remove-slot/:slotId",
  authenticateToken,
  appointmentController.removeTimeSlot
);

console.log("Appointment routes setup complete");

module.exports = router;
