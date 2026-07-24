const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadSingle = (folder, fieldName = "file") => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: `skillsphere/${folder}` },
  });
  return multer({ storage }).single(fieldName);
};

const uploadMultiple = (folder, fieldName = "files", maxCount = 10) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: `skillsphere/${folder}` },
  });
  return multer({ storage }).array(fieldName, maxCount);
};

module.exports = { cloudinary, uploadSingle, uploadMultiple };
