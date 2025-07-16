const User = require("../models/userModel");

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(
      userId,
      "_id name email role dob gender phone address national_id emergency_contact"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map _id to id and format dob for frontend compatibility
    const userObj = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      dob: user.dob ? user.dob.toISOString().slice(0, 10) : "",
      gender: user.gender || "",
      phone: user.phone || "",
      address: user.address || "",
      national_id: user.national_id || "",
      emergency_contact: user.emergency_contact || "",
    };

    res.json(userObj);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error retrieving user data" });
  }
};

module.exports = {
  getUserById,
};
