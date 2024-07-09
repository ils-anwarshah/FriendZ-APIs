const nodemailer = require("nodemailer");
const { getOTPHTMLTamplet } = require("../utility/getOTPTamplet");

const sendMail = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendOTPEmail = (email, name, otp) => {
  return sendMail.sendMail({
    to: email, // list of receivers
    subject: "Here is your verfication OTP", // Subject line
    // text: "Hello world?", // plain text body
    html: getOTPHTMLTamplet(otp, name), // html body
  });
};

module.exports = { sendOTPEmail };
