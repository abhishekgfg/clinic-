const express = require("express");
const router = express.Router();
const {
  saveSheetLink,
  getSheetLink,
  deleteSheetLink,
} = require("../controllers/googleSheetLinkController");

router.post("/", saveSheetLink);
router.get("/", getSheetLink);
router.delete("/", deleteSheetLink);

module.exports = router;
