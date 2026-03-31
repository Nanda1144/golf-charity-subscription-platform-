const User = require('../models/User');
const Draw = require('../models/Draw');
const { sendWinnerAlert, sendDrawPublishedAlert } = require('../utils/email');

const SUBSCRIPTION_PRICE = 12.99;
const POOL_CONTRIBUTION_PER_USER = 5.00; // Fixed portion per sub

const generateRandomNumbers = () => {
  const nums = [];
  while (nums.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums;
};

const generateWeightedNumbers = (userScores) => {
  const counts = {};
  for (let i = 1; i <= 45; i++) counts[i] = 0;
  userScores.forEach(s => counts[s]++);
  const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
  const candidates = sorted.slice(0, 15).map(c => Number(c[0]));
  const results = [];
  while (results.length < 5) {
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (!results.includes(pick)) results.push(pick);
  }
  return results;
};

// @desc    Admin: Run/Simulate a draw with Automated Prize Pool Logic
// @route   POST /api/admin/draw
const runDraw = async (req, res) => {
  const { type = 'Random', simulate = false } = req.body;
  
  const subscribedUsers = await User.find({ subscription: true });
  const allUserScores = subscribedUsers.flatMap(u => (u.scores || []).map(s => s.score));
  
  // 1. Calculate Total Monthly Pool
  const totalPool = subscribedUsers.length * POOL_CONTRIBUTION_PER_USER;
  
  // 2. Define Tier Shares (PRD enforced)
  const TIER_SHARES = {
    'Jackpot': 0.40, // 40% (Rollover)
    'Medium Prize': 0.35, // 35%
    'Small Prize': 0.25 // 25%
  };

  const drawNumbers = type === 'Weighted' ? generateWeightedNumbers(allUserScores) : generateRandomNumbers();
  const winnersList = [];

  subscribedUsers.forEach(user => {
    const matches = (user.scores || []).filter(s => drawNumbers.includes(s.score)).map(m => m.score);
    if (matches.length >= 3) {
      let cat = 'Small Prize';
      if (matches.length === 4) cat = 'Medium Prize';
      if (matches.length === 5) cat = 'Jackpot';

      winnersList.push({
        user: user._id,
        username: user.name,
        matchCount: matches.length,
        category: cat,
        charityAtTime: user.charity
      });
    }
  });

  // 3. Automated Prize Distribution & Splitting
  const tierWinners = {
    'Jackpot': winnersList.filter(w => w.category === 'Jackpot'),
    'Medium Prize': winnersList.filter(w => w.category === 'Medium Prize'),
    'Small Prize': winnersList.filter(w => w.category === 'Small Prize')
  };

  // Rollover Logic for Jackpot Value
  let currentJackpotPool = totalPool * TIER_SHARES['Jackpot'];
  const lastDraw = await Draw.findOne({ status: 'Published' }).sort('-createdAt');
  if (lastDraw && !lastDraw.winners.some(w => w.category === 'Jackpot')) {
     currentJackpotPool += (lastDraw.jackpotValue || 0); // ROLLOVER FROM PREVIOUS
  }

  // Assign individual prize amounts (Divided equally per tier)
  winnersList.forEach(winner => {
    const winnersInTier = tierWinners[winner.category].length;
    let tierTotalPool = totalPool * TIER_SHARES[winner.category];
    
    if (winner.category === 'Jackpot') {
       winner.prizeAmount = currentJackpotPool / winnersInTier;
    } else {
       winner.prizeAmount = tierTotalPool / winnersInTier;
    }
  });

  if (simulate) {
    return res.json({ 
      numbers: drawNumbers, 
      winners: winnersList, 
      status: 'Simulated',
      totalPool,
      jackpotValue: currentJackpotPool
    });
  }

  const draw = await Draw.create({
    numbers: drawNumbers,
    winners: winnersList,
    drawType: type,
    status: 'Draft',
    jackpotValue: tierWinners['Jackpot'].length > 0 ? (totalPool * TIER_SHARES['Jackpot']) : currentJackpotPool
  });

  res.status(201).json(draw);
};

const publishDraw = async (req, res) => {
  const draw = await Draw.findById(req.params.id);
  if (draw) {
    draw.status = 'Published';
    await draw.save();
    
    // Send System Notifications (PRD Required)
    const subscribers = await User.find({ subscription: true });
    subscribers.forEach(user => {
       // Alert all that results are live
       sendDrawPublishedAlert(user);
       
       // Alert specific winners
       const win = draw.winners.find(w => w.user.toString() === user._id.toString());
       if (win) sendWinnerAlert(user, win);
    });

    res.json(draw);
  } else {
    res.status(404).json({ message: 'Draw not found' });
  }
};

const getWinners = async (req, res) => {
  const draws = await Draw.find({ status: 'Published' }).sort('-createdAt');
  let results = [];
  draws.forEach(d => {
    d.winners.forEach(w => results.push({ ...w.toObject(), drawId: d._id, createdAt: d.createdAt }));
  });
  res.json(results);
};

const getUsers = async (req, res) => {
  const list = await User.find({}).sort('-createdAt');
  res.json(list);
};

// New high-fidelity audit logic
const verifyWinner = async (req, res) => {
  const { drawId, userId } = req.params;
  const { isVerified, payoutStatus } = req.body; // payoutStatus: 'Paid', 'Rejected', etc.
  
  const draw = await Draw.findById(drawId);
  if (draw) {
    const idx = draw.winners.findIndex(w => w.user.toString() === userId.toString());
    if (idx !== -1) {
      if (isVerified !== undefined) draw.winners[idx].isVerified = isVerified;
      if (payoutStatus) draw.winners[idx].payoutStatus = payoutStatus;
      
      // If payment is marked as 'Paid', it must be verified automatically
      if (payoutStatus === 'Paid') draw.winners[idx].isVerified = true;
      
      await draw.save();
      res.json(draw.winners[idx]);
    } else res.status(404).json({ message: 'Winner not found' });
  } else res.status(404).json({ message: 'Draw not found' });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, isAdmin, subscription, plan, subscriptionStatus, subscriptionExpiry, scores } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (subscription !== undefined) user.subscription = subscription;
    if (plan) user.plan = plan;
    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus;
    if (subscriptionExpiry) user.subscriptionExpiry = subscriptionExpiry;
    if (scores) user.scores = scores;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { runDraw, publishDraw, getWinners, getUsers, verifyWinner, updateUser };
