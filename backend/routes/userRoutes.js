const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Get user by ID
router.get("/:id", authenticateToken, userController.getUserById);

// Add route for updating user profile
router.put("/profile", authenticateToken, userController.updateUserProfile);

module.exports = router;
