const joi = require("joi");
const { responseMessageError } = require("../../utility/responseMessage");

const registerSchemaValidator = (req, res, next) => {
  const userSchema = joi.object().keys({
    email: joi.string().email().required(),
    mobile_number: joi.number().required(),
    fname: joi.string().required(),
    lname: joi.string().required(),
    dob: joi.string().required(),
    gender: joi.string().valid("M", "F", "O").required(),
    profile_img: joi.string(),
  });

  const ValidateValues = userSchema.validate(req.body);
  if (ValidateValues.error) {
    // console.log(ValidateValues.error);
    let errorName = ValidateValues?.error?.name;
    let errorMessage = ValidateValues?.error?.details[0].message;
    responseMessageError(`${errorName} ${errorMessage}`, res);
  } else {
    next();
  }
};
const loginSchemaValidator = (req, res, next) => {
  const userSchema = joi.object().keys({
    mobile_number: joi.number().required(),
  });

  const ValidateValues = userSchema.validate(req.body);
  if (ValidateValues.error) {
    let errorName = ValidateValues?.error?.name;
    let errorMessage = ValidateValues?.error?.details[0].message;
    responseMessageError(`${errorName} ${errorMessage}`, res);
  } else {
    next();
  }
};
const sendMessageValidator = (req, res, next) => {
  const userSchema = joi.object().keys({
    receiver_id: joi.string().required(),
    file: joi.string().allow(""),
    message: joi.string().allow(""),
    attachment: joi.string().allow(""),
  });

  const ValidateValues = userSchema.validate(req.body);
  if (ValidateValues.error) {
    let errorName = ValidateValues?.error?.name;
    let errorMessage = ValidateValues?.error?.details[0].message;
    responseMessageError(`${errorName} ${errorMessage}`, res);
  } else {
    next();
  }
};

module.exports = {
  registerSchemaValidator,
  loginSchemaValidator,
  sendMessageValidator,
};
