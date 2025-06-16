const express = require('express');
const router = express.Router();
const patientController = require('../Controllers/patientController');

// GET all
router.get('/all', patientController.getAllPatients);

// ADD
router.post('/add', patientController.addPatient);
router.post('/bulk-add', patientController.bulkAddPatients);

// UPDATE
router.put('/update-status/:id', patientController.updateStatus);
router.put('/update/:id', patientController.updatePatient); // ✅ edit patient

// DELETE
router.delete('/delete/:id', patientController.deletePatient); // ✅ delete patient

module.exports = router;
