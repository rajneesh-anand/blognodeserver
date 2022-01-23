const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { validationResult } = require("express-validator");
const prisma = require("../lib/prisma");

exports.userSignupController = async (req, res) => {
  const { name, email, password } = req.body;

  const salt = genSaltSync(10);
  let hashedPassword = hashSync(password, salt);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await prisma.user.count({
    where: {
      email: email,
    },
  });

  if (user == 0) {
    try {
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });
      res.status(200).json({
        message: "sign up success",
      });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  } else {
    res.status(200).json({
      message: "user already exists",
    });
  }
};
