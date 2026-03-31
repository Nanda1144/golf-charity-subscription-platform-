const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
  numbers: {
    type: [Number],
    required: true,
    validate: [val => val.length === 5, 'Draw must have exactly 5 numbers']
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  drawType: {
    type: String,
    enum: ['Random', 'Weighted'],
    default: 'Random'
  },
  jackpotValue: {
    type: Number,
    default: 1000 // Base jackpot in USD or currency
  },
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    matchCount: Number,
    category: String,
    charityAtTime: String,
    prizeAmount: { type: Number, default: 0 },
    matchedNumbers: [Number],
    winnerProof: { type: String, default: null }, // URL to proof image
    isVerified: { type: Boolean, default: false }, // For admin payout verification
    payoutStatus: { type: String, enum: ['Pending', 'Processing', 'Paid', 'Rejected'], default: 'Pending' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Draw', DrawSchema);
