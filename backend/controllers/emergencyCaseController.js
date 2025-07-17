const EmergencyCase = require("../models/emergencyCaseModel");

// Get emergency cases
const getEmergencyCases = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === "patient") {
      query.patient_id = userId;
    } else if (userRole === "doctor") {
      query.doctor_id = userId;
    }

    const emergencyCases = await EmergencyCase.find(query)
      .populate("patient_id", "name email")
      .populate("doctor_id", "name email")
      .sort({ case_date: -1 });
    console.log("Sending emergency cases:", emergencyCases); // Debug log
    res.json(emergencyCases);
  } catch (err) {
    console.error("Error fetching emergency cases:", err);
    res.status(500).json({ message: "Failed to fetch emergency cases" });
  }
};

// Add emergency case
const addEmergencyCase = async (req, res) => {
  try {
    const { patient_id, case_description, case_date } = req.body;
    const doctor_id = req.user.id;
    let pdf = null;
    if (req.file) {
      pdf = req.file.path.replace("backend/", ""); // Store relative path
    }

    const emergencyCase = await EmergencyCase.create({
      patient_id,
      doctor_id,
      case_description,
      case_date: case_date || new Date(),
      pdf,
    });

    res.status(201).json(emergencyCase);
  } catch (err) {
    console.error("Error adding emergency case:", err);
    res.status(500).json({ message: "Failed to add emergency case" });
  }
};

// Update emergency case
const updateEmergencyCase = async (req, res) => {
  try {
    const { id, case_description, case_date } = req.body;

    const emergencyCase = await EmergencyCase.findByIdAndUpdate(
      id,
      { case_description, case_date },
      { new: true }
    );

    if (!emergencyCase) {
      return res.status(404).json({ message: "Emergency case not found" });
    }

    res.json(emergencyCase);
  } catch (err) {
    console.error("Error updating emergency case:", err);
    res.status(500).json({ message: "Failed to update emergency case" });
  }
};

// Delete emergency case
const deleteEmergencyCase = async (req, res) => {
  try {
    const { id } = req.params;

    const emergencyCase = await EmergencyCase.findByIdAndDelete(id);

    if (!emergencyCase) {
      return res.status(404).json({ message: "Emergency case not found" });
    }

    res.json({ message: "Emergency case deleted successfully" });
  } catch (err) {
    console.error("Error deleting emergency case:", err);
    res.status(500).json({ message: "Failed to delete emergency case" });
  }
};

module.exports = {
  getEmergencyCases,
  addEmergencyCase,
  updateEmergencyCase,
  deleteEmergencyCase,
};
