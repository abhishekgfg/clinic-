const express = require("express");
const router = express.Router();
const {
  importGooglePatients,
  getGooglePatients,
  updateStatus,
} = require("../controllers/googlePatientController");

router.post("/import", importGooglePatients);
router.get("/all", getGooglePatients);
router.patch("/:id/status", updateStatus);

module.exports = router;
