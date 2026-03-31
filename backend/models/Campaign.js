const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: String,
  type: { type: String, enum: ['Flash Impact', 'Triple Rewards', 'Seasonal Event'], default: 'Flash Impact' },
  status: { type: String, enum: ['Scheduled', 'Active', 'Ended'], default: 'Scheduled' },
  country: { type: String, default: 'Global' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  prizeBoost: { type: Number, default: 0 } // Multiplier or fixed addition
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
