const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slot_date: { type: Date, required: true },
    slot_time: { type: String, required: true },
    is_available: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

timeSlotSchema.index(
  { doctor_id: 1, slot_date: 1, slot_time: 1 },
  { unique: true }
);

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
