const express = require('express');
const Application = require('../models/Application');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

const router = express.Router();

// @route GET /api/applications
router.get('/', auth(), async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'TALENT') filter.talentId = req.user.id;
    if (req.user.role === 'LANDLORD') filter.propertyId = { $in: await Property.find({ landlordId: req.user.id }).distinct('_id') };

    const applications = await Application.find(filter)
      .populate('propertyId')
      .populate('talentId', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/applications
router.post('/', auth(['TALENT']), async (req, res) => {
  const { propertyId } = req.body;
  try {
    const existing = await Application.findOne({ talentId: req.user.id, propertyId });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const application = await Application.create({ talentId: req.user.id, propertyId });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/applications/:id
router.put('/:id', auth(['LANDLORD']), async (req, res) => {
  const { status } = req.body;
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const property = await Property.findById(application.propertyId);
    if (property.landlordId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
