const express = require('express');
const router = express.Router();
const { getLatestDraw } = require('../controllers/drawController');

router.get('/latest', getLatestDraw);

module.exports = router;
