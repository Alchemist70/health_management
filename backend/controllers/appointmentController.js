const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const TimeSlot = require("../models/timeSlotModel");
const mongoose = require("mongoose");

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }, "_id name email");
    // Always return id as string for frontend compatibility
    const doctorsWithId = doctors.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
    }));
    res.json(doctorsWithId);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// Get patient's appointments
const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const appointments = await Appointment.find({ patient_id: patientId })
      .populate("doctor_id", "name email")
      .sort({ appointment_date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctor_id: doctorId })
      .populate("patient_id", "name email")
      .sort({ appointment_date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Get available slots for a doctor
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    let objectId;
    try {
      objectId =
        typeof doctorId === "string"
          ? new mongoose.Types.ObjectId(doctorId)
          : doctorId;
    } catch (e) {
      console.error("Invalid doctorId:", doctorId, e);
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    const slots = await TimeSlot.find({
      doctor_id: objectId,
      is_available: true,
    }).sort({ slot_date: 1, slot_time: 1 });
    // Ensure each slot has an 'id' field for frontend compatibility
    const slotsWithId = slots.map((slot) => ({
      ...slot.toObject(),
      id: slot._id.toString(),
    }));
    res.json(slotsWithId);
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ message: "Failed to fetch available slots" });
  }
};

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    // Accept both old and new field names for compatibility
    const doctorId = req.body.doctorId;
    const appointmentDate = req.body.appointmentDate || req.body.date;
    const appointmentTime = req.body.appointmentTime || req.body.time;
    const symptoms = req.body.symptoms;
    const notes = req.body.notes;
    const patientId = req.user.id;

    let objectId;
    try {
      objectId =
        typeof doctorId === "string"
          ? new mongoose.Types.ObjectId(doctorId)
          : doctorId;
    } catch (e) {
      console.error("Invalid doctorId:", doctorId, e);
      return res.status(400).json({ message: "Invalid doctorId" });
    }

    // Check if slot is available
    const slot = await TimeSlot.findOne({
      doctor_id: objectId,
      slot_date: appointmentDate,
      slot_time: appointmentTime,
      is_available: true,
    });

    if (!slot) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient_id: patientId,
      doctor_id: objectId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      symptoms,
      notes,
      status: "scheduled",
    });

    // Mark slot as unavailable
    await TimeSlot.findByIdAndUpdate(slot._id, { is_available: false });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

// Update appointment status
const updateStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
};

// Add prescription to appointment
const addPrescription = async (req, res) => {
  try {
    const { appointmentId, prescription } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { prescription },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    console.error("Error adding prescription:", err);
    res.status(500).json({ message: "Failed to add prescription" });
  }
};

// Get single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId)
      .populate("patient_id", "name email")
      .populate("doctor_id", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

// Add a new time slot
const addTimeSlot = async (req, res) => {
  try {
    const { doctorId, slotDate, slotTime } = req.body;
    let objectId;
    try {
      objectId =
        typeof doctorId === "string"
          ? new mongoose.Types.ObjectId(doctorId)
          : doctorId;
    } catch (e) {
      console.error("Invalid doctorId:", doctorId, e);
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    const timeSlot = await TimeSlot.create({
      doctor_id: objectId,
      slot_date: slotDate,
      slot_time: slotTime,
      is_available: true,
    });
    // Ensure returned slot has 'id' field
    const slotWithId = {
      ...timeSlot.toObject(),
      id: timeSlot._id.toString(),
    };
    res.status(201).json(slotWithId);
  } catch (err) {
    console.error("Error adding time slot:", err);
    res.status(500).json({ message: "Failed to add time slot" });
  }
};

// Remove a time slot
const removeTimeSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const deleted = await TimeSlot.findByIdAndDelete(slotId);
    if (!deleted) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    res.json({ message: "Time slot removed successfully" });
  } catch (err) {
    console.error("Error removing time slot:", err);
    res.status(500).json({ message: "Failed to remove time slot" });
  }
};

// Utility: Generate default slots for a doctor for a given date
const generateDefaultSlotsForDoctor = async (doctorId, date) => {
  // date: JS Date object (midnight)
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const slotTime = `${hour.toString().padStart(2, "0")}:${
        min === 0 ? "00" : "30"
      }`;
      slots.push({
        doctor_id: doctorId,
        slot_date: date,
        slot_time: slotTime,
        is_available: true,
      });
    }
  }
  // Only insert slots that don't already exist
  for (const slot of slots) {
    try {
      await TimeSlot.updateOne(
        {
          doctor_id: slot.doctor_id,
          slot_date: slot.slot_date,
          slot_time: slot.slot_time,
        },
        { $setOnInsert: slot },
        { upsert: true }
      );
    } catch (err) {
      // Ignore duplicate errors
    }
  }
};

module.exports = {
  getDoctors,
  getPatientAppointments,
  getDoctorAppointments,
  getAvailableSlots,
  bookAppointment,
  updateStatus,
  addPrescription,
  getAppointmentById,
  addTimeSlot,
  removeTimeSlot,
  generateDefaultSlotsForDoctor, // Exported for server use
};
