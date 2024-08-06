const express = require("express");
require("dotenv").config();
const userRouter = require("./src/routers/userRouter");
const dashboardRouters = require("./src/routers/dashboardRoutes");
const db = require("./src/config/db");
const messagesRoutes = require("./src/routers/messagesRoutes");
const socketIo = require("socket.io");
const http = require("http");
const { initSocketServer } = require("./src/config/socket");

const app = express();
const server = http.createServer(app);

const io = socketIo(server);

initSocketServer(io);

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/", dashboardRouters);
app.use("/messages", messagesRoutes);

server.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is listening on port 3000");
  }
});
