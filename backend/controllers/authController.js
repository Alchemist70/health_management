const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const DoctorRegistration = require("../models/doctorRegistrationModel");

// Register user
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      dob,
      gender,
      phone,
      address,
      national_id,
      emergency_contact,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      dob,
      gender,
      phone,
      address,
      national_id,
      emergency_contact,
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Failed to register user" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in User collection
    const user = await User.findOne({ email });
    if (user) {
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Create token
      const token = jwt.sign(
        { userId: user._id, role: user.role, name: user.name },
        "your-secret-key",
        { expiresIn: "24h" }
      );
      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // If not found in User, check DoctorRegistration
    const doctorReg = await DoctorRegistration.findOne({ email });
    if (doctorReg) {
      if (doctorReg.status === "pending") {
        return res
          .status(403)
          .json({ message: "Your registration is pending admin approval." });
      } else if (doctorReg.status === "rejected") {
        return res.status(403).json({
          message: "Your registration was rejected. Please contact support.",
        });
      }
    }

    // Not found in either collection
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Failed to login" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({ message: "Failed to get profile" });
  }
};

module.exports = {
  register,
  login,
  resetPassword,
  getProfile,
};
