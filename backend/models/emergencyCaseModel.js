const mongoose = require("mongoose");

const emergencyCaseSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    case_description: { type: String, required: true },
    case_date: { type: Date, required: true },
    pdf: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("EmergencyCase", emergencyCaseSchema);
