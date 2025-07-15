const User = require("../models/userModel");

const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }, "id name email");
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

module.exports = {
  getPatients,
};
