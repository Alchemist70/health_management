// Script to fix pdf paths in MongoDB by removing leading 'uploads/'
// Run this with: node backend/scripts/add_dummy_pdf_to_records.js

const mongoose = require("mongoose");
const LabReport = require("../models/labReportModel");
const MedicalHistory = require("../models/medicalHistoryModel");
const EmergencyCase = require("../models/emergencyCaseModel");

const MONGO_URI =
  "mongodb+srv://Medical_Booking:doKczl3swtXGBWwy@medical-booking.htgmvr6.mongodb.net/?retryWrites=true&w=majority&appName=Medical-Booking";

async function fixPdfPaths() {
  await mongoose.connect(MONGO_URI);
  let total = 0;

  // Helper to update a collection
  async function updateCollection(Model, name) {
    const res = await Model.updateMany({ pdf: { $regex: "^uploads/" } }, [
      { $set: { pdf: { $substr: ["$pdf", 8, -1] } } },
    ]);
    console.log(`${name}: Updated ${res.modifiedCount} records.`);
    total += res.modifiedCount;
  }

  await updateCollection(LabReport, "LabReport");
  await updateCollection(MedicalHistory, "MedicalHistory");
  await updateCollection(EmergencyCase, "EmergencyCase");

  console.log(`Total records updated: ${total}`);
  await mongoose.disconnect();
}

fixPdfPaths().catch((err) => {
  console.error("Error fixing pdf paths:", err);
  process.exit(1);
});
