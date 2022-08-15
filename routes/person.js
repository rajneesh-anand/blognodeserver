const express = require("express");
const personFieldsValidator = require("../helper/person-validator");
const registerPerson = require("../controllers/register-person");

const router = express.Router();

router.post("/register-person", personFieldsValidator(), registerPerson);

module.exports = router;
