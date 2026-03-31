const User = require('../models/User');

/**
 * Middleware to restrict access based on subscription status.
 * Rejects requests from non-active or lapsed subscribers.
 */
const subscribed = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });

  // Admins always have access to subscriber features for testing
  if (req.user.isAdmin) return next();

  if (req.user.subscriptionStatus === 'Active' && new Date(req.user.subscriptionExpiry) > new Date()) {
    next();
  } else {
    // If lapsed, automatically update status to Lapsed if it was Active
    if (req.user.subscriptionStatus === 'Active') {
       req.user.subscriptionStatus = 'Lapsed';
       await req.user.save();
    }
    
    res.status(403).json({ 
      message: 'Active subscription required',
      status: req.user.subscriptionStatus,
      expiry: req.user.subscriptionExpiry
    });
  }
};

module.exports = { subscribed };
