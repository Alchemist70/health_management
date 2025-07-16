const User = require("../models/userModel");
const Prescription = require("../models/prescriptionModel");
const { sendEmail } = require("../services/emailService");

const createPrescription = async (req, res) => {
  console.log("\n=== Creating Prescription ===");
  const { patient_id, symptoms, diagnosis, medications, instructions } =
    req.body;
  const doctor_id = req.user && req.user.id;

  console.log("Received prescription data:", {
    patient_id,
    doctor_id,
    symptoms,
    diagnosis,
    medications,
    instructions,
  });

  // Validation
  if (!patient_id) {
    console.error("Missing patient_id");
    return res.status(400).json({ message: "Missing patient_id" });
  }
  if (!doctor_id) {
    console.error("Missing doctor_id from token");
    return res.status(400).json({ message: "Missing doctor_id (token issue)" });
  }
  if (!symptoms) {
    console.error("Missing symptoms");
    return res.status(400).json({ message: "Missing symptoms" });
  }
  if (!diagnosis) {
    console.error("Missing diagnosis");
    return res.status(400).json({ message: "Missing diagnosis" });
  }
  if (!Array.isArray(medications) || medications.length === 0) {
    console.error("Medications must be a non-empty array");
    return res
      .status(400)
      .json({ message: "Medications must be a non-empty array" });
  }

  try {
    // Get patient and doctor details
    const patient = await User.findById(patient_id);
    const doctor = await User.findById(doctor_id);
    if (!patient || !doctor) {
      console.error("Patient or doctor not found", { patient, doctor });
      return res.status(400).json({ message: "Patient or doctor not found" });
    }

    // Ensure medications is an array
    const medicationsArr = Array.isArray(medications) ? medications : [];

    // Create prescription
    const prescription = await Prescription.create({
      patient_id,
      doctor_id,
      symptoms,
      diagnosis,
      medications: medicationsArr,
      instructions,
    });

    console.log("Prescription created successfully:", prescription);

    // Send email notification
    try {
      await sendEmail(patient.email, "prescriptionAdded", [
        patient.name,
        doctor.name,
        new Date().toLocaleDateString(),
      ]);
      console.log("Prescription notification email sent successfully");
    } catch (emailError) {
      console.error(
        "Error sending prescription notification email:",
        emailError
      );
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: "Prescription created successfully",
      prescription_id: prescription._id,
      patient_email: patient.email,
    });
  } catch (err) {
    console.error("Error creating prescription:", err);
    res.status(500).json({
      message: "Failed to create prescription",
      error: err.message,
    });
  }
};

const getPatientPrescriptions = async (req, res) => {
  console.log("\n=== Getting Patient Prescriptions ===");
  console.log("User from token:", req.user);

  // Get patient_id from query params if provided (for doctors), otherwise use token's user id (for patients)
  const patient_id = req.query.patientId || req.user.id;
  console.log("Fetching prescriptions for patient_id:", patient_id);

  try {
    const prescriptions = await Prescription.find({ patient_id })
      .populate("doctor_id", "name")
      .sort({ created_at: -1 });

    console.log("Raw prescriptions from DB:", prescriptions);

    // Parse medications for each prescription (should already be array)
    const processedPrescriptions = prescriptions.map((prescription) => {
      const processed = prescription.toObject();
      processed.doctor_name = prescription.doctor_id?.name || "";
      return processed;
    });

    console.log("Processed prescriptions:", processedPrescriptions);
    res.json(processedPrescriptions);
  } catch (err) {
    console.error("Database error fetching prescriptions:", err);
    res.status(500).json({
      message: "Failed to fetch prescriptions",
      error: err.message,
    });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
};
