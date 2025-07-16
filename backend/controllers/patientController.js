const User = require("../models/userModel");

const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }, "_id name email");
    // Map _id to id for frontend compatibility
    const patientsWithId = patients.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      email: p.email,
    }));
    res.json(patientsWithId);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

module.exports = {
  getPatients,
};
