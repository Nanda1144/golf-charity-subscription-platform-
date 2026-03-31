const mongoose = require('mongoose');

const WinnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  draw: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draw',
    required: true
  },
  matchCount: {
    type: Number,
    required: true,
    enum: [3, 4, 5]
  },
  category: {
    type: String,
    enum: ['Small Prize', 'Medium Prize', 'Jackpot']
  },
  matchedNumbers: {
    type: [Number] // Added field
  },
  charityAtTime: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Winner', WinnerSchema);
