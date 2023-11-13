const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const propertyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "property-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

module.exports = {
  cloudinary,
  profileStorage,
  propertyStorage,
};
