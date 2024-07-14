const jsonWebToken = require("jsonwebtoken");
const {
  responseMessageSuccess,
  accessTokenError,
} = require("../../utility/responseMessage");
const authorization = (req, res, next) => {
  const access_token = req.headers.authorization;
//   console.log(
//     "__________________________________________________",
//     req.headers.authorization
//   );
  jsonWebToken.verify(access_token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
    //   console.log(err);
      accessTokenError(err.message, res);
    } else {
    //   console.log(decode);
      next();
    }
  });
};

module.exports = authorization;
