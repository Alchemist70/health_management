const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const User = require("./models/userModel");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const labReportRoutes = require("./routes/labReportRoutes");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes");
const emergencyCaseRoutes = require("./routes/emergencyCaseRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const fs = require("fs");
const path = require("path");
const appointmentController = require("./controllers/appointmentController");

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://health-management-qyw4.onrender.com",
            "http://localhost:3000",
          ]
        : "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-code"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging for requests
app.use((req, res, next) => {
  console.log("\n=== Incoming Request ===");
  console.log(`${req.method} ${req.path}`);
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("Headers:", {
    authorization: req.headers.authorization ? "Present" : "Not present",
    "content-type": req.headers["content-type"],
  });
  next();
});

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads", "doctor_credentials");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Validate database setup
const validateDatabase = async () => {
  try {
    // Check if we have any users without names
    const usersWithoutNames = await User.find({
      $or: [{ name: null }, { name: "" }],
    });

    if (usersWithoutNames.length > 0) {
      console.log("\nWarning: Found users without names:", usersWithoutNames);

      // Update test accounts with default names if they don't have one
      await User.updateMany(
        {
          $or: [{ name: null }, { name: "" }],
          email: { $regex: /^test.*@.*/ },
        },
        { $set: { name: { $concat: ["Test ", "$role"] } } }
      );

      console.log("Updated test accounts with default names");
    }

    // Verify the updates
    const users = await User.find({}, "id name email role");
    console.log("\nCurrent users in database:", users);
  } catch (err) {
    console.error("Database validation error:", err);
  }
};

// Routes
console.log("\n=== Registering Routes ===");

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "MedCare Backend API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/auth/*",
      appointments: "/api/appointments/*",
      users: "/api/users/*",
      patients: "/api/patients/*",
      prescriptions: "/api/prescriptions/*",
      labReports: "/api/lab-reports/*",
      medicalHistory: "/api/medical-history/*",
      emergencyCases: "/api/emergency-cases/*",
    },
  });
});

console.log("Registering /auth routes...");
app.use("/auth", authRoutes);
console.log("Registering /appointments routes...");
app.use("/api/appointments", appointmentRoutes);
console.log("Registering /users routes...");
app.use("/api/users", userRoutes);
console.log("Registering /patients routes...");
app.use("/api/patients", patientRoutes);
console.log("Registering /prescriptions routes...");
app.use("/api/prescriptions", prescriptionRoutes);
console.log("Registering /lab-reports routes...");
app.use("/api/lab-reports", labReportRoutes);
console.log("Registering /medical-history routes...");
app.use("/api/medical-history", medicalHistoryRoutes);
console.log("Registering /emergency-cases routes...");
app.use("/api/emergency-cases", emergencyCaseRoutes);
console.log("Registering /doctors routes...");
app.use("/api/doctors", doctorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "File too large. Max size is 5MB." });
  }
  if (
    err &&
    err.message &&
    err.message.includes("Only PDF files are allowed")
  ) {
    return res.status(400).json({ message: "Only PDF files are allowed." });
  }
  console.error("\n=== Error Handler ===");
  console.error("Error details:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Create test users if they don't exist
const createTestUsers = async () => {
  const bcrypt = require("bcryptjs");

  try {
    // Create a test patient
    const patientPassword = await bcrypt.hash("patient123", 10);
    const existingPatient = await User.findOne({ email: "patient@test.com" });
    if (!existingPatient) {
      await User.create({
        name: "Test Patient",
        email: "patient@test.com",
        password: patientPassword,
        role: "patient",
      });
      console.log("Test patient created successfully");
    }

    // Create a test doctor
    const doctorPassword = await bcrypt.hash("doctor123", 10);
    const existingDoctor = await User.findOne({ email: "doctor@test.com" });
    if (!existingDoctor) {
      await User.create({
        name: "Test Doctor",
        email: "doctor@test.com",
        password: doctorPassword,
        role: "doctor",
      });
      console.log("Test doctor created successfully");
    }

    console.log("Test users ready");
  } catch (err) {
    console.error("Error creating test users:", err);
  }
};

// Initialize database and test users
const initializeApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create test users
    await createTestUsers();

    // Validate database
    await validateDatabase();

    // Generate default slots for all doctors for today and next 7 days
    const doctors = await User.find({ role: "doctor" });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const doctor of doctors) {
      for (let i = 0; i < 7; i++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + i);
        await appointmentController.generateDefaultSlotsForDoctor(
          doctor._id,
          slotDate
        );
      }
    }
    console.log("Default slots generated for all doctors for the next 7 days");

    console.log("Database initialization complete");
  } catch (err) {
    console.error("Error initializing app:", err);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeApp();
  console.log("Routes configured:");
  console.log("- /auth/*");
  console.log("- /api/appointments/*");
  console.log("- /api/users/*");
  console.log("- /api/patients/*");
  console.log("- /api/prescriptions/*");
  console.log("- /api/lab-reports/*");
  console.log("- /api/medical-history/*");
  console.log("- /api/emergency-cases/*");
});
