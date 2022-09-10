const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const prisma = require("../lib/prisma");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;

const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

const createStudent = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const student = await prisma.student.count({
    where: {
      AND: [{ email: data.fields.email, firstName: data.fields.fname }],
    },
  });

  if (student > 0) {
    return res.status(401).json({ error: "Student data already exists !" });
  } else {
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

        await prisma.student.create({
          data: {
            firstName: data.fields.fname,
            lastName: data.fields.lname,
            address: data.fields.address,
            city: data.fields.city,
            state: data.fields.state,
            zip: data.fields.zip,
            contact: data.fields.contact,
            email: data.fields.email,
            schoolName: data.fields.school,
            photo: uploadResult.secure_url,
            class: data.fields.class,
            gender: data.fields.gender,
            birthDate: data.fields.dob,
          },
        });

        return res.status(200).json({ message: " Student Data Saved !" });
      } else {
        await prisma.student.create({
          data: {
            firstName: data.fields.fname,
            lastName: data.fields.lname,
            address: data.fields.address,
            city: data.fields.city,
            state: data.fields.state,
            zip: data.fields.zip,
            contact: data.fields.contact,
            email: data.fields.email,
            schoolName: data.fields.school,
            class: data.fields.class,
            gender: data.fields.gender,
            birthDate: data.fields.dob,
          },
        });

        return res.status(200).json({ message: " Student Data Saved !" });
      }
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

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

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

      await prisma.student.update({
        where: {
          id: Number(id),
        },
        data: {
          firstName: data.fields.fname,
          lastName: data.fields.lname,
          address: data.fields.address,
          city: data.fields.city,
          state: data.fields.state,
          zip: data.fields.zip,
          contact: data.fields.contact,
          email: data.fields.email,
          schoolName: data.fields.school,
          photo: uploadResult.secure_url,
          class: data.fields.class,
          gender: data.fields.gender,
          birthDate: data.fields.dob,
        },
      });

      return res.status(200).json({ message: "success" });
    } else {
      await prisma.student.update({
        where: {
          id: Number(id),
        },
        data: {
          firstName: data.fields.fname,
          lastName: data.fields.lname,
          address: data.fields.address,
          city: data.fields.city,
          state: data.fields.state,
          zip: data.fields.zip,
          contact: data.fields.contact,
          email: data.fields.email,
          schoolName: data.fields.school,
          class: data.fields.class,
          gender: data.fields.gender,
          birthDate: data.fields.dob,
        },
      });

      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};
const fetchSingleStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};

const deleteStudent = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};

module.exports = {
  createStudent,
  fetchSingleStudent,
  updateStudent,
  deleteStudent,
};
