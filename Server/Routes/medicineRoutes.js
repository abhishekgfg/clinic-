const express = require("express");
const router = express.Router();
const { getAllMedicineRecords } = require("../controllers/medicineController");

router.get("/all", getAllMedicineRecords);

module.exports = router;
