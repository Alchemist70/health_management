const User = require("../models/userModel");

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(
      userId,
      "id name email role dob gender phone address national_id emergency_contact"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error retrieving user data" });
  }
};

module.exports = {
  getUserById,
};
