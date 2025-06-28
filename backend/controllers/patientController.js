const db = require("../config/database");

const getPatients = async (req, res) => {
  try {
    const [patients] = await db
      .promise()
      .query("SELECT id, name, email FROM users WHERE role = 'patient'");
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

module.exports = {
  getPatients,
};
