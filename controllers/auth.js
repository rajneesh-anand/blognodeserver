const { hash, genSalt } = require("bcrypt");
const { validationResult } = require("express-validator");
const prisma = require("../lib/prisma");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;

const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

exports.signUpUser = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const user = await prisma.user.count({
    where: {
      AND: [{ email: data.fields.email }],
    },
  });

  if (user > 0) {
    return res
      .status(401)
      .json({ error: "User with the email already exists !" });
  } else {
    const salt = await genSalt(10);
    const hashedPassword = await hash(data.fields.password, salt);
    try {
      if (Object.keys(data.files).length !== 0) {
        const photo = await fs.promises
          .readFile(data.files.photo.path)
          .catch((err) => console.error("Failed to read file", err));

        let photo64 = parser.format(
          path.extname(data.files.photo.name).toString(),
          photo
        );
        const uploadResult = await cloudinaryUpload(photo64.content);

        await prisma.user.create({
          data: {
            name: data.fields.name,
            email: data.fields.email,
            password: hashedPassword,
            image: uploadResult.secure_url,
          },
        });

        return res.status(200).json({ message: "success" });
      } else {
        await prisma.user.create({
          data: {
            name: data.fields.name,
            email: data.fields.email,
            password: hashedPassword,
          },
        });

        return res.status(200).json({ message: "success" });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Database Error" });
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  }
};

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
    const token = jwt.sign(
      {
        name: name,
        email: email,
        picture: "/images/default-profile.svg",
        iat: new Date().getTime(),
        exp: 30 * 24 * 60 * 60,
      },
      process.env.SECRET
    );
    console.log(token);

    try {
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });
      res.status(200).json({
        message: "success",
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
