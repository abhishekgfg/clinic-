const express = require("express");
const router = express.Router();
const {
  getConfirmedAppointments,
  savePaymentInfo,
} = require("../controllers/assistantDoctorController");

router.get("/confirmed", getConfirmedAppointments);
router.post("/payment/:appointmentId", savePaymentInfo);

module.exports = router;
