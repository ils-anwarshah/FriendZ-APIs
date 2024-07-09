const express = require("express");
const router = express.Router();
const {
  authLoginController,
  authRegisterController,
  authVerifyOTPController,
} = require("../controller/authController");

router.post("/login", authLoginController);
router.post("/register", authRegisterController);
router.post("/verifyOTP", authVerifyOTPController);

module.exports = router;
