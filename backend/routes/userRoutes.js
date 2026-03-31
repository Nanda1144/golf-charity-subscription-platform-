const express = require('express');
const router = express.Router();
const { getUserProfile, updateSubscription, selectCharity, addScore } = require('../controllers/userController');
const { uploadProof } = require('../controllers/proofController');
const { protect } = require('../middleware/auth');
const { subscribed } = require('../middleware/subscription');

router.get('/profile', protect, getUserProfile);
router.put('/subscribe', protect, updateSubscription); // Manual toggle (for dev or legacy)
router.put('/charity', protect, selectCharity);
router.post('/scores', protect, subscribed, addScore);
router.put('/winners/:drawId/proof', protect, subscribed, uploadProof);

module.exports = router;
