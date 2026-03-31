const Draw = require('../models/Draw');

const getLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne({ status: 'Published' }).sort('-createdAt');
    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getDrawHistory = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'Published' }).sort('-createdAt');
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLatestDraw, getDrawHistory };
