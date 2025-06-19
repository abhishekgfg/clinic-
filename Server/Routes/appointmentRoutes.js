const express = require("express");
const router = express.Router();
const {
  addAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  rescheduleAppointment,
} = require("../Controllers/appointmentController");

// ✅ Use relative paths only
router.post("/add", addAppointment);                 // POST /api/appointments/add
router.get("/all", getAllAppointments);              // GET  /api/appointments/all
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);

module.exports = router;
