const express = require("express");
const personFieldsValidator = require("../helper/person-validator");
const {
  registerPerson,
  fetchPerson,
} = require("../controllers/register-person");

const router = express.Router();

router.post("/register-person", personFieldsValidator(), registerPerson);
router.get("/register-person", fetchPerson);

module.exports = router;
