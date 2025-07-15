const mongoose = require("mongoose");

const doctorRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  phone: { type: String },
  address: { type: String },
  national_id: { type: String },
  specialization: { type: String, required: true },
  license_number: { type: String, required: true },
  years_experience: { type: Number, required: true },
  credentials_pdf: { type: String, required: true }, // file path or URL
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DoctorRegistration", doctorRegistrationSchema);
