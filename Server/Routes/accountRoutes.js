const express = require("express");
const router = express.Router();

const {
  getAllAccountRecords,
  updateAccountStatus,
  addPaymentReference,
  saveFullAccountRecord,
  getSavedAccountRecords,
  updateAccountDetails,
  updateReferenceNumber,
} = require("../controllers/accountController");

// Routes
router.get("/all", getAllAccountRecords);
router.put("/update/:id", updateAccountStatus);
router.post("/add-reference", addPaymentReference);
router.post("/add-full", saveFullAccountRecord);
router.get("/saved-records", getSavedAccountRecords);
router.put("/update-details/:assistantId", updateAccountDetails);
router.put("/update-reference/:assistantId", updateReferenceNumber); // ✅ Editing only reference #

module.exports = router;
