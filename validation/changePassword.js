const Validator = require("validator"),
  isEmpty = require("is-empty");

module.exports = ValidatePasswordInput = userInput => {
  //create errors object to store error messages
  let errors = {};

  //convert empty fields to an empty string so we can use validator on them
  userInput.otp = !isEmpty(userInput.otp) ? userInput.otp : "";
  userInput.email = !isEmpty(userInput.email) ? userInput.email : "";
  userInput.password = !isEmpty(userInput.password) ? userInput.password : "";
  userInput.password2 = !isEmpty(userInput.password2)
    ? userInput.password2
    : "";

  //check otp
  if (Validator.isEmpty(userInput.otp)) {
    errors.otp = "otp field is required";
  }
  //check email
  if (Validator.isEmpty(userInput.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(userInput.email)) {
    errors.email = "Email is invalid";
  }

  //check password fields
  if (Validator.isEmpty(userInput.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(userInput.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!Validator.isLength(userInput.password, { min: 8, max: 30 })) {
    errors.password = "Password must be at least 8 characters";
  }
  if (!Validator.equals(userInput.password, userInput.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
