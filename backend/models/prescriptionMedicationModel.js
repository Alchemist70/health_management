const mongoose = require("mongoose");

const prescriptionMedicationSchema = new mongoose.Schema(
  {
    prescription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model(
  "PrescriptionMedication",
  prescriptionMedicationSchema
);
