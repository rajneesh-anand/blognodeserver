const express = require("express");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary");

const router = express.Router();
const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// const cloudinaryUpload = (file) => cloudinary.uploader.upload(file);

router.get("/", (req, res) => {
  cloudinary.v2.api.resources(
    {
      type: "upload",
      prefix: "victoria",
    },
    (error, result) => {
      if (error) {
        console.log(error);
      }
      return res.status(200).json(result.resources);
    }
  );
});

module.exports = router;
