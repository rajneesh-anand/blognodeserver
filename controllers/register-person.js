const { hash, genSalt } = require("bcrypt");
const prisma = require("../lib/prisma");
const { validationResult } = require("express-validator");

const registerPerson = async (req, res) => {
  const {
    email,
    password,
    first,
    last,
    city,
    zip,
    state,
    addressOne,
    addressTwo,
    contact,
    gender,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const person = await prisma.person.count({
    where: {
      email: email,
    },
  });

  if (person > 0) {
    return res.status(403).json({ msg: "Email adreess already in use !" });
  } else {
    try {
      await prisma.person.create({
        data: {
          first: first,
          last: last,
          addressOne: addressOne,
          addressTwo: addressTwo,
          city: city,
          state: state,
          zip: zip,
          contact: contact,
          email: email,
          password: hashedPassword,
          gender: gender,
        },
      });
      return res.status(200).json({
        msg: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  }
};

const fetchPerson = async (req, res) => {
  try {
    const result = await prisma.person.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
    });
    return res.status(200).json({
      msg: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};

module.exports = { registerPerson, fetchPerson };
