const express = require("express");
const router = express.Router();
const {
  getAllPackageRecords,
  savePackageRecord,
} = require("../controllers/packageController");

router.get("/all", getAllPackageRecords);
router.post("/save", savePackageRecord);

module.exports = router;
