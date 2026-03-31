const express = require('express');
const router = express.Router();
const { createCheckout, handleWebhook, cancelSubscription } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/checkout', protect, createCheckout);
router.post('/webhook', handleWebhook); // Webhook is usually called by Stripe
router.put('/cancel', protect, cancelSubscription);

module.exports = router;
