const express = require("express");
const userSignupValidator = require("../helper/user-validator");
const {
  registerUser,
  fetchUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const router = express.Router();

router.post("/", registerUser);
router.get("/", fetchUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
