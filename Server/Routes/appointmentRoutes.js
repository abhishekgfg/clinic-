const express = require("express");
const router = express.Router();
const {
  addAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../Controllers/appointmentController");

router.post("/add", addAppointment);
router.get("/all", getAllAppointments);
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

module.exports = router;
