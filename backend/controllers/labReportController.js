const LabReport = require("../models/labReportModel");
const path = require("path"); // Added for path.relative

// Get lab reports
const getLabReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === "patient") {
      query.patient_id = userId;
    } else if (userRole === "doctor") {
      query.doctor_id = userId;
    }

    const labReports = await LabReport.find(query)
      .populate("patient_id", "name email")
      .populate("doctor_id", "name email")
      .sort({ report_date: -1 });
    console.log("Sending lab reports:", labReports); // Debug log
    res.json(labReports);
  } catch (err) {
    console.error("Error fetching lab reports:", err);
    res.status(500).json({ message: "Failed to fetch lab reports" });
  }
};

// Add lab report
const addLabReport = async (req, res) => {
  try {
    console.log("addLabReport req.body:", req.body);
    console.log("addLabReport req.file:", req.file);
    const { patient_id, report, report_date } = req.body;
    const doctor_id = req.user.id;
    let pdf = null;
    if (req.file) {
      // Only store the subdirectory and filename, not the full path
      const relPath = path
        .relative(path.join(__dirname, "../"), req.file.path)
        .replace(/\\/g, "/");
      pdf = relPath.replace(/^uploads\//, "");
    }
    const labReport = await LabReport.create({
      patient_id,
      doctor_id,
      report,
      report_date: report_date || new Date(),
      pdf,
    });
    res.status(201).json(labReport);
  } catch (err) {
    console.error("Error adding lab report:", err);
    res.status(500).json({ message: "Failed to add lab report" });
  }
};

// Update lab report
const updateLabReport = async (req, res) => {
  try {
    console.log("updateLabReport req.body:", req.body);
    console.log("updateLabReport req.file:", req.file);
    const { id, report, report_date } = req.body;
    let updateFields = { report, report_date };
    if (req.file) {
      // Only store the subdirectory and filename, not the full path
      const relPath = path
        .relative(path.join(__dirname, "../"), req.file.path)
        .replace(/\\/g, "/");
      updateFields.pdf = relPath.replace(/^uploads\//, "");
    }
    const labReport = await LabReport.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!labReport) {
      return res.status(404).json({ message: "Lab report not found" });
    }
    res.json(labReport);
  } catch (err) {
    console.error("Error updating lab report:", err);
    res.status(500).json({ message: "Failed to update lab report" });
  }
};

// Delete lab report
const deleteLabReport = async (req, res) => {
  try {
    console.log("deleteLabReport req.params:", req.params);
    const { id } = req.params;

    const labReport = await LabReport.findByIdAndDelete(id);

    if (!labReport) {
      return res.status(404).json({ message: "Lab report not found" });
    }

    res.json({ message: "Lab report deleted successfully" });
  } catch (err) {
    console.error("Error deleting lab report:", err);
    res.status(500).json({ message: "Failed to delete lab report" });
  }
};

module.exports = {
  getLabReports,
  addLabReport,
  updateLabReport,
  deleteLabReport,
};
