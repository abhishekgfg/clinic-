const express = require("express");
const router = express.Router();
const {
  getAllChithiRecords,
  saveChithiRecord,
} = require("../controllers/chithiController");

router.get("/all", getAllChithiRecords);   // Used in frontend to display data
router.post("/save", saveChithiRecord);    // Used in frontend to update status

module.exports = router;
