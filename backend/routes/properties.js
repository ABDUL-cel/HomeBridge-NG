const express = require('express');
const Property = require('../models/Property');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// @route GET /api/properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('landlordId', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlordId', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/properties
router.post('/', auth(['LANDLORD']), async (req, res) => {
  try {
    const { title, location, price, type, description, images } = req.body;

    const property = await Property.create({
      landlordId: req.user.id,
      title,
      location,
      price,
      type,
      description,
      images: images || [],
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/properties/:id
router.put('/:id', auth(['LANDLORD']), async (req, res) => {
  try {
    const { title, location, price, type, description, images } = req.body;

    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.landlordId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this property' });
    }

    property.title = title || property.title;
    property.location = location || property.location;
    property.price = price || property.price;
    property.type = type || property.type;
    property.description = description || property.description;
    property.images = images || property.images;

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/properties/:id
router.delete('/:id', auth(['LANDLORD']), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.landlordId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this property' });
    }

    // Delete cloudinary images
    for (const url of property.images) {
      const publicId = url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`homebridge_properties/${publicId}`);
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
