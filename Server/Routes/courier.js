const express = require("express");
const router = express.Router();
const {
  getAllCourierRecords,
  saveCourierRecord,
} = require("../controllers/courierController");

router.get("/all", getAllCourierRecords);
router.post("/save", saveCourierRecord);

module.exports = router;
