const responseMessageSuccess = (data, statusCode, msg, error) => {
  return {
    ...(data && { data }),
    statusCode,
    ...(error && { err: error }),
    ...(msg && { msg }),
  };
};
const responseMessageError = () => {};

module.exports = { responseMessageSuccess };
