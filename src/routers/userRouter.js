const express = require("express");
const router = express.Router();
const {
  authLoginController,
  authRegisterController,
  authVerifyOTPController,
} = require("../controller/authController");
const {
  registerSchemaValidator,
  loginSchemaValidator,
} = require("../middleware/validators/validators");

router.post("/login", loginSchemaValidator, authLoginController);
router.post("/register", registerSchemaValidator, authRegisterController);
router.post("/verifyOTP", authVerifyOTPController);

module.exports = router;
