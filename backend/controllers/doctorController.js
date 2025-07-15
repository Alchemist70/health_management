const DoctorRegistration = require("../models/doctorRegistrationModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Register doctor (pending approval)
exports.registerDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      dob,
      gender,
      phone,
      address,
      national_id,
      specialization,
      license_number,
      years_experience,
    } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Credentials PDF is required." });
    const existing = await DoctorRegistration.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "A registration with this email already exists." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await DoctorRegistration.create({
      name,
      email,
      password: hashedPassword,
      dob,
      gender,
      phone,
      address,
      national_id,
      specialization,
      license_number,
      years_experience,
      credentials_pdf: req.file.filename,
      status: "pending",
    });
    res
      .status(201)
      .json({ message: "Registration submitted. Pending admin approval." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all pending doctor registrations
exports.getPendingDoctors = async (req, res) => {
  try {
    const pending = await DoctorRegistration.find({ status: "pending" });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download credentials PDF
exports.downloadCredentials = async (req, res) => {
  try {
    const doctor = await DoctorRegistration.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const filePath = path.join(
      __dirname,
      "../uploads/doctor_credentials",
      doctor.credentials_pdf
    );
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve doctor registration
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await DoctorRegistration.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    // Create user account for doctor
    await User.create({
      name: doctor.name,
      email: doctor.email,
      password: doctor.password,
      role: "doctor",
      dob: doctor.dob,
      gender: doctor.gender,
      phone: doctor.phone,
      address: doctor.address,
      national_id: doctor.national_id,
      specialization: doctor.specialization,
      license_number: doctor.license_number,
      years_experience: doctor.years_experience,
    });
    doctor.status = "approved";
    await doctor.save();
    res.json({ message: "Doctor approved and account created." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject doctor registration
exports.rejectDoctor = async (req, res) => {
  try {
    const doctor = await DoctorRegistration.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    doctor.status = "rejected";
    await doctor.save();
    res.json({ message: "Doctor registration rejected." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
