const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const labReportRoutes = require("./routes/labReportRoutes");
const medicalHistoryRoutes = require("./routes/medicalHistoryRoutes");
const emergencyCaseRoutes = require("./routes/emergencyCaseRoutes");

const app = express();

// Middleware
app.use(cors());
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

// Validate database setup
const validateDatabase = async () => {
  try {
    // Check users table structure
    const [columns] = await db.promise().query("DESCRIBE users");
    console.log("\nUsers table structure:", columns);

    // Check if we have any users without names
    const [usersWithoutNames] = await db
      .promise()
      .query("SELECT id, email FROM users WHERE name IS NULL OR name = ''");

    if (usersWithoutNames.length > 0) {
      console.log("\nWarning: Found users without names:", usersWithoutNames);

      // Update test accounts with default names if they don't have one
      await db
        .promise()
        .query(
          "UPDATE users SET name = CONCAT('Test ', role) WHERE (name IS NULL OR name = '') AND email LIKE 'test%@%'"
        );

      console.log("Updated test accounts with default names");
    }

    // Verify the updates
    const [users] = await db
      .promise()
      .query("SELECT id, name, email, role FROM users");
    console.log("\nCurrent users in database:", users);
  } catch (err) {
    console.error("Database validation error:", err);
  }
};

// Routes
console.log("\n=== Registering Routes ===");
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("\n=== Error Handler ===");
  console.error("Error details:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Create tables on startup
const createTables = async () => {
  // Create users table if it doesn't exist
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('patient', 'doctor') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create time_slots table if it doesn't exist
  const createTimeSlotsTable = `
    CREATE TABLE IF NOT EXISTS time_slots (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL,
      slot_date DATE NOT NULL,
      slot_time TIME NOT NULL,
      is_available BOOLEAN DEFAULT true,
      FOREIGN KEY (doctor_id) REFERENCES users(id),
      UNIQUE KEY unique_slot (doctor_id, slot_date, slot_time)
    )
  `;

  // Create appointments table if it doesn't exist
  const createAppointmentsTable = `
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      doctor_id INT NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      symptoms TEXT,
      notes TEXT,
      status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id),
      FOREIGN KEY (doctor_id) REFERENCES users(id)
    )
  `;

  try {
    await db.promise().query(createUsersTable);
    console.log("Users table ready");

    await db.promise().query(createTimeSlotsTable);
    console.log("Time slots table ready");

    await db.promise().query(createAppointmentsTable);
    console.log("Appointments table ready");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

// Initialize tables
createTables();

// Create test users if they don't exist
const createTestUsers = async () => {
  const bcrypt = require("bcryptjs");

  // Create a test patient
  const patientPassword = await bcrypt.hash("patient123", 10);
  const patientQuery = `
    INSERT INTO users (name, email, password, role)
    SELECT 'Test Patient', 'patient@test.com', ?, 'patient'
    WHERE NOT EXISTS (
      SELECT 1 FROM users WHERE email = 'patient@test.com'
    )
  `;

  // Create a test doctor
  const doctorPassword = await bcrypt.hash("doctor123", 10);
  const doctorQuery = `
    INSERT INTO users (name, email, password, role)
    SELECT 'Test Doctor', 'doctor@test.com', ?, 'doctor'
    WHERE NOT EXISTS (
      SELECT 1 FROM users WHERE email = 'doctor@test.com'
    )
  `;

  try {
    await db.promise().query(patientQuery, [patientPassword]);
    await db.promise().query(doctorQuery, [doctorPassword]);
    console.log("Test users created successfully");
  } catch (err) {
    console.error("Error creating test users:", err);
  }
};

// Initialize test users
createTestUsers();

// Reset all unhashed passwords
const resetAllPasswords = async () => {
  const bcrypt = require("bcryptjs");

  try {
    // Get all users with unhashed passwords (length < 50)
    const [users] = await db
      .promise()
      .query(
        "SELECT id, email, password FROM users WHERE LENGTH(password) < 50"
      );

    console.log("\nResetting passwords for users with unhashed passwords:");

    for (const user of users) {
      try {
        // Set password to email prefix + "123"
        const defaultPassword = user.email.split("@")[0] + "123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await db
          .promise()
          .query("UPDATE users SET password = ? WHERE id = ?", [
            hashedPassword,
            user.id,
          ]);

        console.log(`✓ Reset password for ${user.email}`);
        console.log(`  New password: ${defaultPassword}`);
      } catch (err) {
        console.error(`Failed to reset password for ${user.email}:`, err);
      }
    }

    // Verify all passwords are now hashed
    const [verifyUsers] = await db
      .promise()
      .query("SELECT email, LENGTH(password) as pass_length FROM users");

    console.log("\nVerification of password lengths:");
    verifyUsers.forEach((user) => {
      console.log(`${user.email}: ${user.pass_length} characters`);
    });
  } catch (err) {
    console.error("Error in resetAllPasswords:", err);
  }
};

// Run password reset
resetAllPasswords();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await validateDatabase();
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
