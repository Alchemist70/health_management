const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Get user by ID
router.get("/:id", authenticateToken, getUserById);

module.exports = router;
