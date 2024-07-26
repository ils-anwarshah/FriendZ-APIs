const express = require("express");
const messagesRoutes = express.Router();

const authorization = require("../middleware/validators/authorization");
const { sendMessagesController } = require("../controller/messagesControllers");

messagesRoutes.use(authorization);
messagesRoutes.get("/getStatus", sendMessagesController);

module.exports = messagesRoutes;
