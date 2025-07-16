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

// Allow patients to update their profile information
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const allowedFields = [
      "name",
      "dob",
      "gender",
      "phone",
      "address",
      "national_id",
      "emergency_contact",
      "email",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        fields:
          "_id name email role dob gender phone address national_id emergency_contact",
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Map _id to id for frontend compatibility
    const userObj = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      dob: updatedUser.dob ? updatedUser.dob.toISOString().slice(0, 10) : "",
      gender: updatedUser.gender || "",
      phone: updatedUser.phone || "",
      address: updatedUser.address || "",
      national_id: updatedUser.national_id || "",
      emergency_contact: updatedUser.emergency_contact || "",
    };
    res.json(userObj);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
};

module.exports = {
  getUserById,
  updateUserProfile,
};
