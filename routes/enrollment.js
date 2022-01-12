const express = require("express");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const prisma = require("../lib/prisma");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

router.post("/", async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  if (Object.keys(data.files).length !== 0) {
    const photo = await fs.promises
      .readFile(data.files.photo.path)
      .catch((err) => console.error("Failed to read file", err));

    const photo64 = parser.format(
      path.extname(data.files.photo.name).toString(),
      photo
    );
    const uploadResult = await cloudinaryUpload(photo64.content);
    try {
      let result = await prisma.student.create({
        data: {
          firstName: data.fields.fName,
          lastName: data.fields.lName,
          address: data.fields.address,
          city: data.fields.city,
          state: data.fields.state,
          pinCode: data.fields.pincode,
          contact: data.fields.contact,
          email: data.fields.email,
          schoolName: data.fields.school,
          photo: uploadResult.secure_url,
          class: data.fields.class,
          stream: data.fields.stream,
          message: data.fields.message,
          subjects: JSON.parse(data.fields.subjects),
        },
      });
      return res.status(200).json({
        msg: "success",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  } else {
    try {
      let result = await prisma.student.create({
        data: {
          firstName: data.fields.fName,
          lastName: data.fields.lName,
          address: data.fields.address,
          city: data.fields.city,
          state: data.fields.state,
          pinCode: data.fields.pincode,
          contact: data.fields.contact,
          email: data.fields.email,
          schoolName: data.fields.school,
          class: data.fields.class,
          stream: data.fields.stream,
          message: data.fields.message,
          subjects: JSON.parse(data.fields.subjects),
        },
      });
      return res.status(200).json({
        msg: "success",
        data: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  }
});

router.get("/", async (req, res) => {
  try {
    let result = await prisma.student.findMany({});
    return res.status(200).json({
      msg: "success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
});

module.exports = router;
