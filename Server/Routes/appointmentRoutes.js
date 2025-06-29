  // routes/appointmentRoutes.js
  const express = require("express");
  const router = express.Router();
  const {
    addAppointment,
    getAllAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    rescheduleAppointment
  } = require("../controllers/appointmentController");

  router.post("/add", addAppointment);
  router.get("/all", getAllAppointments);
  router.patch("/:id/status", updateAppointmentStatus);
  router.patch("/:id/reschedule", rescheduleAppointment);
  router.delete("/:id", deleteAppointment);

  module.exports = router;
