const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Get user by ID
router.get("/:id", authenticateToken, getUserById);

// Add route for updating user profile
router.put("/profile", authenticateToken, userController.updateUserProfile);

module.exports = router;
