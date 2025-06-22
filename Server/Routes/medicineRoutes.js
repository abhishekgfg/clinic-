const express = require("express");
const router = express.Router();
const {
  getAllMedicineRecords,
  saveMedicineRecord,
} = require("../controllers/medicineController");

router.get("/all", getAllMedicineRecords);
router.post("/save", saveMedicineRecord); // used in frontend

module.exports = router;
