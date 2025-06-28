const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../controllers/medicalHistoryController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, medicalHistoryController.getMedicalHistory);
router.post("/", authenticateToken, medicalHistoryController.addMedicalHistory);
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
