const User = require('../models/User');

// @desc    Simulate checkout flow (Mock Stripe integration)
// @route   POST /api/payments/checkout
// @access  Private
const createCheckout = async (req, res) => {
  const { planType } = req.body; // 'Monthly' or 'Yearly'
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  // In a real app, you would create a Stripe checkout session here
  // and redirect the user. We'll simulate the successful redirect.
  res.json({ 
    url: `http://localhost:5173/payment-success?session_id=mock_cs_${Date.now()}&plan=${planType}`,
    message: 'Redirecting to secure payment gateway...'
  });
};

// @desc    Simulate Stripe Webhook session.completed (Sync database state)
// @route   POST /api/payments/webhook
const handleWebhook = async (req, res) => {
  const { sessionId, userId, plan } = req.body; // Real webhooks would decode this payload
  const user = await User.findById(userId);

  if (user) {
    user.subscription = true;
    user.plan = plan;
    user.subscriptionStatus = 'Active';
    
    const now = new Date();
    if (plan === 'Monthly') {
      user.subscriptionExpiry = new Date(now.setMonth(now.getMonth() + 1));
    } else if (plan === 'Yearly') {
      user.subscriptionExpiry = new Date(now.setFullYear(now.getFullYear() + 1));
    }
    
    await user.save();
    res.json({ message: 'Subscription activated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    User cancels subscription (Renewal off)
// @route   PUT /api/payments/cancel
const cancelSubscription = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.subscriptionStatus = 'Canceled'; // In real apps, this means 'won't renew'
    await user.save();
    res.json({ message: 'Subscription set to canceled (No more renewals)' });
  }
};

module.exports = { createCheckout, handleWebhook, cancelSubscription };
