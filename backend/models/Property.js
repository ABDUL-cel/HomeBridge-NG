const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Studio', '1 Bedroom', '2 Bedrooms', 'Self Contain', 'Shared'],
    required: true,
  },
  description: String,
  images: [String],   // Cloudinary URLs
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Property', PropertySchema);
