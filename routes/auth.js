const express = require("express");

const { userSignupValidator } = require("../helper/user-validator");
const { userSignupController } = require("../controllers/auth");

const router = express.Router();

router.post("/register", userSignupValidator(), userSignupController);

module.exports = router;
