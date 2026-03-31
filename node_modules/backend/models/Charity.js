const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true // URL to image
  },
  gallery: [String], // Array of URLs
  website: String,
  upcomingEvents: [{
     title: String,
     date: Date,
     location: String,
     description: String
  }],
  category: {
    type: String,
    enum: ['Health', 'Education', 'Environment', 'Animal Welfare', 'Social Justice'],
    default: 'Health'
  },
  country: { type: String, default: 'Global' }, // Multi-country expansion
  currency: { type: String, default: 'USD' },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Charity', CharitySchema);
