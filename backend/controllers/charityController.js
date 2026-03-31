const Charity = require('../models/Charity');

// @desc    Get all active charities (with search and filtering)
// @route   GET /api/charities
const getCharities = async (req, res) => {
  const { category, search } = req.query;
  const query = { isActive: true };

  if (category) query.category = category;
  if (search) {
     query.name = { $regex: search, $options: 'i' };
  }

  try {
    const list = await Charity.find(query).sort('-createdAt');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured/spotlight charities for home page
// @route   GET /api/charities/featured
const getFeaturedCharities = async (req, res) => {
  try {
    const list = await Charity.find({ isActive: true, isFeatured: true }).limit(3);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get individual charity profile
// @route   GET /api/charities/:id
const getCharityById = async (req, res) => {
  try {
    const item = await Charity.findById(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Charity not found' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCharities, getFeaturedCharities, getCharityById };
