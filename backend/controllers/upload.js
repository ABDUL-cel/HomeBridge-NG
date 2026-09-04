
// backend/controllers/upload.js
const cloudinary = require('cloudinary').v2;
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.CLOUD_API_KEY, api_secret: process.env.CLOUD_API_SECRET });

exports.uploadImage = async (req, res) => {
  const { image } = req.body; // base64 string
  try {
    const result = await cloudinary.uploader.upload(image, { folder: 'homebridge_properties' });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
