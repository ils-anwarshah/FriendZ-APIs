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
  createUserPostController,
  getUserTypes,
  likePostController,
  getLikeAndConnectionCountConroller,
  makeConnectionController,
  getUserConnectionsController,
  deleteUserConnectionController,
  getMatchedUsersListController,
  getNewUsersListController,
  getUserDetailsFromUserIdController,
} = require("../controller/dashboardControllers");
const authorization = require("../middleware/validators/authorization");

dashboardRouter.use(authorization);
// dashboardRouter.post("/dashboard", getStatusDataController);
dashboardRouter.get("/getStatus", getStatusDataController);
dashboardRouter.post("/postStatus", postStatusDataController);
dashboardRouter.get("/getUserPostData", getUserPostDataController);
dashboardRouter.post("/createUserPost", createUserPostController);
dashboardRouter.get("/getUserTypes", getUserTypes);
dashboardRouter.post("/likePost", likePostController);
dashboardRouter.get(
  "/getLikeAndConnectionCount",
  getLikeAndConnectionCountConroller
);
dashboardRouter.get("/makeConnection/:userId", makeConnectionController);
dashboardRouter.get("/getUserConnections", getUserConnectionsController);
dashboardRouter.delete(
  "/deleteUserConnection/:userId",
  deleteUserConnectionController
);
dashboardRouter.post("/getMatchingUserList", getMatchedUsersListController);
dashboardRouter.get("/getNewUsersList", getNewUsersListController);
dashboardRouter.get(
  "/getUserDetails/:user_id",
  getUserDetailsFromUserIdController
);

module.exports = dashboardRouter;
