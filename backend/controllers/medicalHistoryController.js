// Always store only the subdirectory and filename for pdf, not the full path (e.g. 'medical_history/filename.pdf')
const MedicalHistory = require("../models/medicalHistoryModel");
const path = require("path"); // Add at the top if not present

// Get medical history
const getMedicalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === "patient") {
      query.patient_id = userId;
    } else if (userRole === "doctor") {
      query.doctor_id = userId;
    }

    const medicalHistory = await MedicalHistory.find(query)
      .populate("patient_id", "name email")
      .populate("doctor_id", "name email")
      .sort({ history_date: -1 });
    console.log("Sending medical history:", medicalHistory); // Debug log
    res.json(medicalHistory);
  } catch (err) {
    console.error("Error fetching medical history:", err);
    res.status(500).json({ message: "Failed to fetch medical history" });
  }
};

// Add medical history
const addMedicalHistory = async (req, res) => {
  try {
    console.log("addMedicalHistory req.body:", req.body);
    console.log("addMedicalHistory req.file:", req.file);
    const { patient_id, history, history_date } = req.body;
    const doctor_id = req.user.id;
    let pdf = null;
    if (req.file) {
      // Always store the subdirectory and filename, e.g. 'medical_history/filename.pdf'
      const relPath = path
        .relative(path.join(__dirname, "../"), req.file.path)
        .replace(/\\/g, "/");
      pdf = relPath.replace(/^uploads\//, "");
    }
    const medicalHistory = await MedicalHistory.create({
      patient_id,
      doctor_id,
      history,
      history_date: history_date || new Date(),
      pdf,
    });
    res.status(201).json(medicalHistory);
  } catch (err) {
    console.error("Error adding medical history:", err);
    res.status(500).json({ message: "Failed to add medical history" });
  }
};

// Update medical history
const updateMedicalHistory = async (req, res) => {
  try {
    console.log("updateMedicalHistory req.body:", req.body);
    console.log("updateMedicalHistory req.file:", req.file);
    const { id, history, history_date } = req.body;
    let updateFields = { history, history_date };
    if (req.file) {
      // Always store the subdirectory and filename, e.g. 'medical_history/filename.pdf'
      const relPath = path
        .relative(path.join(__dirname, "../"), req.file.path)
        .replace(/\\/g, "/");
      updateFields.pdf = relPath.replace(/^uploads\//, "");
    }
    const medicalHistory = await MedicalHistory.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }
    res.json(medicalHistory);
  } catch (err) {
    console.error("Error updating medical history:", err);
    res.status(500).json({ message: "Failed to update medical history" });
  }
};

// Delete medical history
const deleteMedicalHistory = async (req, res) => {
  try {
    console.log("deleteMedicalHistory req.params:", req.params);
    const { id } = req.params;

    const medicalHistory = await MedicalHistory.findByIdAndDelete(id);

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    res.json({ message: "Medical history deleted successfully" });
  } catch (err) {
    console.error("Error deleting medical history:", err);
    res.status(500).json({ message: "Failed to delete medical history" });
  }
};

module.exports = {
  getMedicalHistory,
  addMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
};
