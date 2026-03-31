const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  country: { type: String, default: 'US' }, // Multi-country expansion support
  accountType: { type: String, enum: ['Individual', 'Corporate', 'Team'], default: 'Individual' },
  teamId: { type: String, default: null }, // Corporate/Team support
  subscription: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    enum: ['Monthly', 'Yearly', 'None'],
    default: 'None'
  },
  subscriptionStatus: {
    type: String,
    enum: ['Active', 'Canceled', 'Lapsed', 'None'],
    default: 'None'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
    default: null
  },
  charityPercentage: {
    type: Number,
    min: 10,
    default: 10 // Minimum 10% as per PRD
  },
  scores: [{
    score: { type: Number, required: true, min: 1, max: 45 },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
