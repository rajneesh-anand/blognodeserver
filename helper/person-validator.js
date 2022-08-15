const { body, validationResult } = require("express-validator");

const personFieldsValidator = () => {
  return [
    body("email").isEmail().withMessage("Must be a valid email address."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ];
};

module.exports = personFieldsValidator;
