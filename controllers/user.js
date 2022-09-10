const { hash, genSalt } = require("bcrypt");
const prisma = require("../lib/prisma");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return new Promise((resolve, reject) => {
    const { id, first, email } = user;
    resolve(
      jwt.sign({ id, first, email }, process.env.SECRET, {
        expiresIn: "30m",
      })
    );
  });
};

const registerUser = async (req, res) => {
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
    return res.status(401).json({ msg: "Email adreess already in use !" });
  } else {
    try {
      const user = await prisma.person.create({
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

      const token = await createToken(user);
      console.log(token);
      return res.status(200).json({ first, email, token });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: error.message });
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  }
};

const fetchUser = async (req, res) => {
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

const updateUser = async (req, res) => {
  const id = req.params.id;
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

  try {
    await prisma.person.update({
      where: {
        id: Number(id),
      },
      data: {
        first: first,
        last: last,
        addressOne: addressOne,
        addressTwo: addressTwo,
        city: city,
        state: state,
        zip: zip,
        contact: contact,
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
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.person.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      msg: "user deleted successfully",
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

module.exports = { registerUser, fetchUser, updateUser, deleteUser };
