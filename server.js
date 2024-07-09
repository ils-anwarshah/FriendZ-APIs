const express = require("express");
require("dotenv").config();
const userRouter = require("./src/routers/userRouter");
const db = require("./src/config/db");
const app = express();


app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is listning on port 3000");
  }
});
