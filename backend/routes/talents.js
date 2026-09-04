const express = require('express');
const TalentProfile = require('../models/TalentProfile');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route GET /api/talents
router.get('/', async (req, res) => {
  try {
    const talents = await TalentProfile.find().populate('userId', 'name email');
    res.json(talents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/talents/me  (our own profile)
router.get('/me', auth(['TALENT']), async (req, res) => {
  try {
    let profile = await TalentProfile.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!profile) {
      profile = await TalentProfile.create({ userId: req.user.id });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/talents/me
router.put('/me', auth(['TALENT']), async (req, res) => {
  try {
    const { profession, bio, skills, location, avatarUrl, availability } = req.body;
    let profile = await TalentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new TalentProfile({ userId: req.user.id });
    }

    profile.profession = profession || profile.profession;
    profile.bio = bio || profile.bio;
    profile.skills = skills || profile.skills;
    profile.location = location || profile.location;
    profile.avatarUrl = avatarUrl || profile.avatarUrl;
    if (availability !== undefined) profile.availability = availability;

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
