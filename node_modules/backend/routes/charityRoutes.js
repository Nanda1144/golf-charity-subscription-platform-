const express = require('express');
const router = express.Router();
const { getCharities, getFeaturedCharities, getCharityById } = require('../controllers/charityController');

router.get('/', getCharities);
router.get('/featured', getFeaturedCharities);
router.get('/:id', getCharityById);

module.exports = router;
