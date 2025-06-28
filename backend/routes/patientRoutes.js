const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { authenticateToken } = require("../middleware/auth");

// Get all patients (protected route)
router.get("/", authenticateToken, patientController.getPatients);

module.exports = router;
