const express = require("express");
const router = express.Router();
const emergencyCaseController = require("../controllers/emergencyCaseController");
const { authenticateToken } = require("../middleware/auth");
const { uploadEmergencyCase } = require("../middleware/upload");

router.get("/", authenticateToken, emergencyCaseController.getEmergencyCases);
router.post(
  "/",
  authenticateToken,
  uploadEmergencyCase.single("pdf"),
  emergencyCaseController.addEmergencyCase
);
router.put("/", authenticateToken, emergencyCaseController.updateEmergencyCase);
router.delete(
  "/:id",
  authenticateToken,
  emergencyCaseController.deleteEmergencyCase
);

module.exports = router;
