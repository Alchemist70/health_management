const mongoose = require("mongoose");
const connectDB = require("../config/database");
const MedicalHistory = require("../models/medicalHistoryModel");
const LabReport = require("../models/labReportModel");
const EmergencyCase = require("../models/emergencyCaseModel");

const DUMMY_PDF = "dummy.pdf"; // This should exist in /uploads/ for testing

async function updateRecords() {
  await connectDB();
  let updated = 0;

  // MedicalHistory
  const mh = await MedicalHistory.updateMany(
    { $or: [{ pdf: { $exists: false } }, { pdf: null }, { pdf: "" }] },
    { $set: { pdf: DUMMY_PDF } }
  );
  updated += mh.nModified || mh.modifiedCount || 0;

  // LabReport
  const lr = await LabReport.updateMany(
    { $or: [{ pdf: { $exists: false } }, { pdf: null }, { pdf: "" }] },
    { $set: { pdf: DUMMY_PDF } }
  );
  updated += lr.nModified || lr.modifiedCount || 0;

  // EmergencyCase
  const ec = await EmergencyCase.updateMany(
    { $or: [{ pdf: { $exists: false } }, { pdf: null }, { pdf: "" }] },
    { $set: { pdf: DUMMY_PDF } }
  );
  updated += ec.nModified || ec.modifiedCount || 0;

  console.log(`Updated ${updated} records with dummy PDF.`);
  mongoose.connection.close();
}

updateRecords().catch((err) => {
  console.error("Error updating records:", err);
  mongoose.connection.close();
});
