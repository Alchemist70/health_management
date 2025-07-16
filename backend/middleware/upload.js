const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/lab_reports/");
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
    cb(null, "backend/uploads/medical_history/");
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
    cb(null, "backend/uploads/emergency_cases/");
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
