const db = require("../config/database");
const { sendEmail } = require("../services/emailService");

const createPrescription = async (req, res) => {
  console.log("\n=== Creating Prescription ===");
  const { patient_id, symptoms, diagnosis, medications, instructions } =
    req.body;
  const doctor_id = req.user.id;

  console.log("Received prescription data:", {
    patient_id,
    doctor_id,
    symptoms,
    diagnosis,
    medications,
    instructions,
  });

  try {
    // Get patient and doctor details
    const [users] = await db.promise().query(
      `SELECT 
        p.email as patient_email, 
        p.name as patient_name,
        d.name as doctor_name
       FROM users p
       JOIN users d ON d.id = ?
       WHERE p.id = ?`,
      [doctor_id, patient_id]
    );

    if (!users.length) {
      throw new Error("Patient or doctor not found");
    }

    const { patient_email, patient_name, doctor_name } = users[0];

    // Ensure medications is properly stringified
    const medicationsJson = Array.isArray(medications)
      ? JSON.stringify(medications)
      : JSON.stringify([]);

    console.log("Stringified medications:", medicationsJson);

    const [result] = await db.promise().query(
      `INSERT INTO prescriptions 
       (patient_id, doctor_id, symptoms, diagnosis, medications, instructions, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        patient_id,
        doctor_id,
        symptoms,
        diagnosis,
        medicationsJson,
        instructions,
      ]
    );

    console.log("Prescription created successfully:", result);

    // Send email notification
    try {
      await sendEmail(patient_email, "prescriptionAdded", [
        patient_name,
        doctor_name,
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
      prescription_id: result.insertId,
      patient_email: patient_email,
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
    const [prescriptions] = await db.promise().query(
      `SELECT p.*, u.name as doctor_name 
       FROM prescriptions p 
       JOIN users u ON p.doctor_id = u.id 
       WHERE p.patient_id = ? 
       ORDER BY p.created_at DESC`,
      [patient_id]
    );

    console.log("Raw prescriptions from DB:", prescriptions);

    // Parse medications JSON for each prescription
    const processedPrescriptions = prescriptions.map((prescription) => {
      const processed = { ...prescription };
      try {
        // Check if medications is already an object
        if (
          typeof prescription.medications === "object" &&
          prescription.medications !== null
        ) {
          processed.medications = prescription.medications;
        } else if (typeof prescription.medications === "string") {
          // Try to parse if it's a string
          processed.medications = JSON.parse(prescription.medications);
        } else {
          // Default to empty array if neither
          processed.medications = [];
        }
      } catch (err) {
        console.error(
          `Error processing medications for prescription ${prescription.id}:`,
          err.message,
          "\nRaw medications value:",
          prescription.medications
        );
        processed.medications = [];
      }
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
