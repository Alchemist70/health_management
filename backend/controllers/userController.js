const db = require("../config/database");

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const [user] = await db
      .promise()
      .query(
        "SELECT id, name, email, role, dob, gender, phone, address, national_id, emergency_contact FROM users WHERE id = ?",
        [userId]
      );

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error retrieving user data" });
  }
};

module.exports = {
  getUserById,
};
