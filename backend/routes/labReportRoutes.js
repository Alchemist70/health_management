const express = require("express");
const router = express.Router();
const labReportController = require("../controllers/labReportController");
const { authenticateToken } = require("../middleware/auth");
const { uploadLabReport } = require("../middleware/upload");

router.get("/", authenticateToken, labReportController.getLabReports);
router.post(
  "/",
  authenticateToken,
  uploadLabReport.single("pdf"),
  labReportController.addLabReport
);
router.put("/", authenticateToken, labReportController.updateLabReport);
router.delete("/:id", authenticateToken, labReportController.deleteLabReport);

module.exports = router;
