const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const { authenticateToken } = require("../middleware/auth");

// Create a new prescription (doctor only)
router.post("/", authenticateToken, prescriptionController.createPrescription);

// Get patient's prescriptions (patient only)
router.get(
  "/patient",
  authenticateToken,
  prescriptionController.getPatientPrescriptions
);

// Add a route for GET /api/prescriptions for compatibility with doctor view
router.get(
  "/",
  authenticateToken,
  prescriptionController.getPatientPrescriptions
);

module.exports = router;
