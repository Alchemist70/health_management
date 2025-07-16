const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../controllers/medicalHistoryController");
const { authenticateToken } = require("../middleware/auth");
const { uploadMedicalHistory } = require("../middleware/upload");

router.get("/", authenticateToken, medicalHistoryController.getMedicalHistory);
router.post(
  "/",
  authenticateToken,
  uploadMedicalHistory.single("pdf"),
  medicalHistoryController.addMedicalHistory
);
router.put(
  "/",
  authenticateToken,
  medicalHistoryController.updateMedicalHistory
);
router.delete(
  "/:id",
  authenticateToken,
  medicalHistoryController.deleteMedicalHistory
);

module.exports = router;
