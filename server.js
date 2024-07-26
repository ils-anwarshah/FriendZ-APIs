const express = require("express");
require("dotenv").config();
const userRouter = require("./src/routers/userRouter");
const dashboardRouters = require("./src/routers/dashboardRoutes");
const db = require("./src/config/db");
const messagesRoutes = require("./src/routers/messagesRoutes");
const app = express();

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/", dashboardRouters);
app.use("/messages", messagesRoutes);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is listning on port 3000");
  }
});
