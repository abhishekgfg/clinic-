const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  checkAdminExists,
  getAllUsers,
   deleteUser,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signup);
router.get("/admin-exists", checkAdminExists);
router.get("/all-users", getAllUsers); // ✅ New route
router.delete("/delete-user/:username", deleteUser); // ✅ add this


module.exports = router;
