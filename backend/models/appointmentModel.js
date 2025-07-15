const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
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
    appointment_date: { type: Date, required: true },
    appointment_time: { type: String, required: true },
    symptoms: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "scheduled",
        "completed",
        "cancelled",
        "rejected",
        "elapsed",
      ],
      default: "pending",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
