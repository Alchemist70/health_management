const express = require("express");
const {
  register,
  login,
  resetPassword,
  getProfile,
} = require("../controllers/authController");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
