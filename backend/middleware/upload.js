const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/lab_reports/"); // Fixed path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const uploadLabReport = multer({ storage, fileFilter });

const storageMedicalHistory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/medical_history/"); // Fixed path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadMedicalHistory = multer({
  storage: storageMedicalHistory,
  fileFilter,
});

const storageEmergencyCase = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/emergency_cases/"); // Fixed path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadEmergencyCase = multer({
  storage: storageEmergencyCase,
  fileFilter,
});

module.exports = { uploadLabReport, uploadMedicalHistory, uploadEmergencyCase };
