const responseMessageSuccess = (data, statusCode, msg, error) => {
  return {
    ...(data && { data }),
    statusCode,
    ...(error && { err: error }),
    ...(msg && { msg }),
  };
};
const responseMessageError = (error, res) => {
  res.status(403).json({ err: error });
};
const accessTokenError = (error, res) => {
  res.status(401).json({ err: error });
};

module.exports = { responseMessageSuccess, responseMessageError,accessTokenError };
