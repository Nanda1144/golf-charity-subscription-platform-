const User = require('../models/User');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');

// @desc    Admin: Get Platform Intelligence (Reports & Analytics)
// @route   GET /api/admin/reports
const getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ subscription: true });
    
    // Total Prize Pool (Sum of all published draws' jackpot + shared pools)
    // We'll approximate from the Draw documents
    const draws = await Draw.find({ status: 'Published' });
    const totalPrizesAwarded = draws.reduce((acc, d) => {
       const winnersTotal = d.winners.reduce((wAcc, w) => wAcc + (w.prizeAmount || 0), 0);
       return acc + winnersTotal;
    }, 0);

    // Charity Contribution Totals
    // For MVP: Count by selectedCharity prevalence
    const charityStats = await User.aggregate([
       { $match: { subscription: true } },
       { $group: { _id: "$charity", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      activeSubscribers,
      totalPrizesAwarded,
      charityImpactCount: charityStats.length,
      revenueSimulated: activeSubscribers * 12.99
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getReports };
