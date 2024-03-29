const express = require("express");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const prisma = require("../lib/prisma");
const router = express.Router();
const verifyToken = require("../middleware/auth");
var AWS = require("aws-sdk");

const bucketName = process.env.S3_BUCKET;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.AWS_REGISN,
});

const s3 = new AWS.S3();

const readFile = async (file) => {
  const photo = await fs.promises.readFile(file.path).catch((err) => {
    console.error("Failed to read file", err);
  });
  const params = {
    Bucket: bucketName + "/products",
    Key: file.name,
    ContentType: file.type,
    Body: photo,
    ACL: "public-read",
  };

  try {
    let uploadRes = s3.upload(params).promise();
    let resData = await uploadRes;
    return resData.Location;
  } catch (error) {
    return error;
  }
};

const uploadPhototToawsS3 = async (data) => {
  const images = data.files.images;
  if (Array.isArray(images)) {
    const promises = images.map((item) => readFile(item));
    await Promise.all(promises);
    return { message: "success" };
  } else {
    readFile(images);
    return { message: "success" };
  }
};

router.post("/", async (req, res, next) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.multiples = true;
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  if (Object.keys(data.files).length !== 0) {
    const imageLocation = await readFile(data.files.image);

    try {
      await prisma.product.create({
        data: {
          name: data.fields.product_name,
          description: data.fields.description,
          image: imageLocation,
          slug: data.fields.slug,
          size: data.fields.size,
          weight: Number(data.fields.weight),
          price: Number(data.fields.price),
          sellingPrice: Number(data.fields.sale_price),
          discount: Number(data.fields.discount),
          usage: data.fields.usage,
          inStock: JSON.parse(data.fields.stock),
          category: JSON.parse(data.fields.category),
        },
      });
      res.status(200).json({
        msg: "success",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  } else {
    try {
      await prisma.product.create({
        data: {
          name: data.fields.product_name,
          description: data.fields.description,
          slug: data.fields.slug,
          size: data.fields.size,
          weight: Number(data.fields.weight),
          price: Number(data.fields.price),
          sellingPrice: Number(data.fields.sale_price),
          discount: Number(data.fields.discount),
          usage: data.fields.usage,
          inStock: JSON.parse(data.fields.stock),
          category: JSON.parse(data.fields.category),
        },
      });
      res.status(200).json({
        msg: "success",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  }
});

router.post("/:id", async (req, res, next) => {
  const id = req.params.id;
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  if (Object.keys(data.files).length !== 0) {
    const imageLocation = await readFile(data.files.image);

    try {
      await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name: data.fields.product_name,
          description: data.fields.description,
          image: imageLocation,
          slug: data.fields.slug,
          size: data.fields.size,
          weight: Number(data.fields.weight),
          price: Number(data.fields.price),
          sellingPrice: Number(data.fields.sale_price),
          discount: Number(data.fields.discount),
          usage: data.fields.usage,
          inStock: JSON.parse(data.fields.stock),
          category: JSON.parse(data.fields.category),
        },
      });
      res.status(200).json({
        msg: "success",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  } else {
    try {
      await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name: data.fields.product_name,
          description: data.fields.description,
          slug: data.fields.slug,
          size: data.fields.size,
          weight: Number(data.fields.weight),
          price: Number(data.fields.price),
          sellingPrice: Number(data.fields.sale_price),
          discount: Number(data.fields.discount),
          usage: data.fields.usage,
          inStock: JSON.parse(data.fields.stock),
          category: JSON.parse(data.fields.category),
        },
      });
      res.status(200).json({
        msg: "success",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    } finally {
      async () => {
        await prisma.$disconnect();
      };
    }
  }
});

router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ data: "success" });
});

module.exports = router;
