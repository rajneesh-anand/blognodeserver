const express = require("express");
const personFieldsValidator = require("../helper/person-validator");
const {
  registerPerson,
  fetchPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/register-person");

const router = express.Router();

router.post("/register-person", personFieldsValidator(), registerPerson);
router.get("/register-person", fetchPerson);
router.put("/register-person/:id", updatePerson);
router.delete("/register-person/:id", deletePerson);

module.exports = router;
