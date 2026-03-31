const User = require('../models/User');
const Draw = require('../models/Draw');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const draws = await Draw.find({ 'winners.user': req.user._id })
      .sort('-createdAt');
    
    const winningHistory = draws.map(d => {
      const winData = d.winners.find(w => w.user.toString() === req.user._id.toString());
      return {
        ...winData.toObject(),
        drawId: d._id,
        drawNumbers: d.numbers,
        createdAt: d.createdAt
      };
    });

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        accountType: user.accountType,
        subscription: user.subscription,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiry: user.subscriptionExpiry,
        plan: user.plan,
        charity: user.charity,
        charityPercentage: user.charityPercentage,
        scores: user.scores,
        winnings: winningHistory
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update subscription status
// @route   PUT /api/users/subscribe
// @access  Private
const updateSubscription = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { plan = 'None', isSubscribed = true } = req.body;

  if (user) {
    user.subscription = isSubscribed;
    user.plan = plan.charAt(0).toUpperCase() + plan.slice(1);
    
    if (user.subscription) {
       user.subscriptionStatus = 'Active';
       const now = new Date();
       if (plan.toLowerCase() === 'yearly') {
          user.subscriptionExpiry = new Date(now.setFullYear(now.getFullYear() + 1));
       } else {
          user.subscriptionExpiry = new Date(now.setMonth(now.getMonth() + 1));
       }
    } else {
       user.subscriptionStatus = 'None';
       user.subscriptionExpiry = null;
    }

    const updatedUser = await user.save();
    res.json({ 
      subscription: updatedUser.subscription, 
      subscriptionStatus: updatedUser.subscriptionStatus,
      subscriptionExpiry: updatedUser.subscriptionExpiry,
      plan: updatedUser.plan
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Select charity and contribution percentage
// @route   PUT /api/users/charity
// @access  Private
const selectCharity = async (req, res) => {
  const { charity, charityPercentage } = req.body; // charity is ID
  const user = await User.findById(req.user._id);

  if (user) {
    if (charity) user.charity = charity;
    if (charityPercentage) {
       // Enforce PRD Minimum 10%
       user.charityPercentage = Math.max(10, charityPercentage);
    }
    await user.save();
    res.json({ charity: user.charity, charityPercentage: user.charityPercentage });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Add a score (maintaining max 5)
// @route   POST /api/users/scores
// @access  Private
const addScore = async (req, res) => {
  const { score, date } = req.body;
  const numScore = Number(score);
  
  if (isNaN(numScore) || numScore < 1 || numScore > 45) {
     return res.status(400).json({ message: 'Score must be a number between 1 and 45' });
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.scores.push({
       score: numScore,
       date: date || new Date()
    });

    user.scores.sort((a, b) => new Date(a.date) - new Date(b.date));

    while (user.scores.length > 5) {
      user.scores.shift();
    }

    await user.save();
    res.json({ scores: user.scores });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUserProfile, updateSubscription, selectCharity, addScore };
