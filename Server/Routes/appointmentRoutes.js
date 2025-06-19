const express = require("express");
const router = express.Router();
const {
  addAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  rescheduleAppointment,
} = require("../Controllers/appointmentController");

router.post("https://clinic-2uu2.onrender.com/api/appointments/add", addAppointment);
router.get("https://clinic-2uu2.onrender.com/api/patients/all", getAllAppointments);
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);

module.exports = router;
