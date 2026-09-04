const express = require('express');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// @route POST /api/upload
// body: { image: base64 }
router.post('/', auth(), async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'No image provided' });

    const result = await cloudinary.uploader.upload(image, {
      folder: 'homebridge_properties',
      resource_type: 'image',
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
