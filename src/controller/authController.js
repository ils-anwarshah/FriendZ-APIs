const randomstring = require("randomstring");
const jsonWebToken = require("jsonwebtoken");
const { responseMessageSuccess } = require("../utility/responseMessage");
const { sendOTPEmail } = require("../config/mailer");

function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

const authLoginController = async (req, res) => {
  const { mobile_number } = req.body;
  const randomOTP = generateOTP();
  // console.log(randomOTP, "-------");
  await req.db
    .query("SELECT * FROM Users WHERE mobile_number=?", [mobile_number])
    .then(async (result) => {
      await req.db.query(
        "CREATE TABLE IF NOT EXISTS otp (id INT NOT NULL AUTO_INCREMENT,user_id INT,mobile_number VARCHAR(12),gender VARCHAR (2),email VARCHAR(40),name VARCHAR(80),otp VARCHAR(10),access_token VARCHAR(1024), FOREIGN KEY (user_id) REFERENCES Users(user_id), PRIMARY KEY (id))"
      );
      console.log(result[0]);
      if (result[0].length > 0) {
        // console.log(result[0]);
        const { user_id, email, mobile_number, fname, lname, gender } =
          result[0][0];
        req.db
          .query(
            "INSERT INTO otp(user_id,mobile_number,email,name,gender,otp) VALUES (?,?,?,?,?,?)",
            [
              user_id,
              mobile_number,
              email,
              `${fname} ${lname}`,
              gender,
              randomOTP,
            ]
          )
          .then((result) => {
            // console.log("_____________________________", result[0].affectedRows);
            if (result[0].affectedRows > 0) {
              sendOTPEmail(email, `${fname} ${lname}`, randomOTP);
              res
                .status(200)
                .json(
                  responseMessageSuccess(
                    { otp: randomOTP },
                    200,
                    "OTP sent successfully"
                  )
                );
            }
          });
      } else {
        res.status(400).json({ err: "No User Found!" });
        // res.json({ err: "" });
      }
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
};

const authVerifyOTPController = (req, res) => {
  const { otp, mobile_number } = req.body;
  // console.log(req.body);
  req.db
    .query("SELECT * FROM otp WHERE mobile_number=? AND otp=?", [
      mobile_number,
      otp,
    ])
    .then(async (result) => {
      if (result[0].length > 0) {
        const token = jsonWebToken.sign(result[0][0], process.env.SECRET_KEY, {
          expiresIn: "7d",
        });
        await req.db.query(
          "UPDATE otp SET access_token = ? WHERE mobile_number=? ORDER BY id DESC LIMIT 1",
          [token, mobile_number]
        );
        res
          .status(200)
          .json(
            responseMessageSuccess(
              { ...result[0][0], access_token: token },
              200,
              "success"
            )
          );
      } else {
        res.status(400).json(responseMessageSuccess({}, 400, "invalid OTP!"));
      }
    })
    .catch((err) => {
      res.json({ err });
    });
};

const authRegisterController = async (req, res) => {
  const { fname, lname, dob, email, mobile_number, gender, profile_img } =
    req.body;
  req.db
    .query(
      `INSERT INTO Users(fname,lname,dob,email,mobile_number,gender,profile_img) VALUES (?,?,?,?,?,?,?)`,
      [fname, lname, dob, email, mobile_number, gender, profile_img]
    )
    .then((result) => {
      // console.log("RES", result);
      res
        .status(201)
        .json({ msg: "User created succesfully", statusCode: 201 });
    })
    .catch((err) => {
      console.log("ERR", err);
      res.status(400).json({
        err: err.code === "ER_DUP_ENTRY" ? "User Already Exists" : err,
        statusCode: 400,
      });
    });
};

module.exports = {
  authLoginController,
  authRegisterController,
  authVerifyOTPController,
};
