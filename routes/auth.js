const express = require("express");

const { userSignupValidator } = require("../helper/user-validator");
const { signUpUser } = require("../controllers/auth");

const router = express.Router();

router.post("/signup", userSignupValidator(), signUpUser);

module.exports = router;
