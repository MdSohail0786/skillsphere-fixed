const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadSingle = (folder, fieldName = 'file') => {
  const storage = new CloudinaryStorage({ cloudinary, params: { folder: `skillsphere/${folder}`, resource_type: 'auto' } });
  return multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).single(fieldName);
};
const uploadMultiple = (folder, fieldName = 'files', maxCount = 10) => {
  const storage = new CloudinaryStorage({ cloudinary, params: { folder: `skillsphere/${folder}`, resource_type: 'auto' } });
  return multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).array(fieldName, maxCount);
};
module.exports = { cloudinary, uploadSingle, uploadMultiple };
