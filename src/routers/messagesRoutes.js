const express = require("express");
const messagesRoutes = express.Router();

const authorization = require("../middleware/validators/authorization");
const {
  sendMessagesController,
  fetchMessagesController,
  createUserConnection,
  fetchRecentMessageUserList,
  updateMessageStatusController,
} = require("../controller/messagesControllers");
const { sendMessageValidator } = require("../middleware/validators/validators");

messagesRoutes.use(authorization);
messagesRoutes.post(
  "/sendMessage",
  sendMessageValidator,
  sendMessagesController
);
messagesRoutes.get("/fetchMessages/:roomId", fetchMessagesController);
messagesRoutes.post("/createUserConnection", createUserConnection);
messagesRoutes.get("/fetchRecentMessageUserList", fetchRecentMessageUserList);
messagesRoutes.put(
  "/updateMessageStatus/:roomId/:receiverId",
  updateMessageStatusController
);

module.exports = messagesRoutes;
