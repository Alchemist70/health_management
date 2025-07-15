const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { authenticateAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Set up multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/doctor_credentials"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed!"));
  },
});

// Doctor registration (pending approval)
router.post(
  "/register",
  upload.single("credentials"),
  doctorController.registerDoctor
);

// Admin endpoints
router.get("/pending", authenticateAdmin, doctorController.getPendingDoctors);
router.get(
  "/credentials/:id",
  authenticateAdmin,
  doctorController.downloadCredentials
);
router.post("/approve/:id", authenticateAdmin, doctorController.approveDoctor);
router.post("/reject/:id", authenticateAdmin, doctorController.rejectDoctor);

module.exports = router;
