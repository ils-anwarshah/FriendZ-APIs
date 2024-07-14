const express = require("express");
const dashboardRouter = express.Router();
const {
  authLoginController,
  authRegisterController,
  authVerifyOTPController,
} = require("../controller/authController");

const {
  getStatusDataController,
  postStatusDataController,
  getUserPostDataController,
} = require("../controller/dashboardControllers");
const authorization = require("../middleware/validators/authorization");

dashboardRouter.use(authorization);
// dashboardRouter.post("/dashboard", getStatusDataController);
dashboardRouter.get("/getStatus", getStatusDataController);
dashboardRouter.post("/postStatus", postStatusDataController);
dashboardRouter.get("/getUserPostData", getUserPostDataController);
// dashboardRouter.post("/getSearchPostData", authVerifyOTPController);

module.exports = dashboardRouter;
