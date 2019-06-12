const Validator = require("validator"),
  isEmpty = require("is-empty");

module.exports = ValidateLoginInput = userInput => {
  //create errors object to store error messages
  let errors = {};

  //convert empty fields to an empty string so we can use validator on them
  userInput.email = !isEmpty(userInput.email) ? userInput.email : "";
  userInput.password = !isEmpty(userInput.password) ? userInput.password : "";

  //check email
  if (Validator.isEmpty(userInput.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(userInput.email)) {
    errors.email = "Email is invalid";
  }

  //check password
  if (Validator.isEmpty(userInput.password)) {
    errors.password = "Password field is empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
