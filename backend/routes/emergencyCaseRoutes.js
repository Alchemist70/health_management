const express = require("express");
const router = express.Router();
const emergencyCaseController = require("../controllers/emergencyCaseController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, emergencyCaseController.getEmergencyCases);
router.post("/", authenticateToken, emergencyCaseController.addEmergencyCase);
router.put("/", authenticateToken, emergencyCaseController.updateEmergencyCase);
router.delete(
  "/:id",
  authenticateToken,
  emergencyCaseController.deleteEmergencyCase
);

module.exports = router;
