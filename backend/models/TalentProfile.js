const mongoose = require('mongoose');

const TalentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  profession: {
    type: String,
    required: true,
  },
  bio: String,
  skills: [String],
  location: String,
  avatarUrl: String,
  availability: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('TalentProfile', TalentProfileSchema);
