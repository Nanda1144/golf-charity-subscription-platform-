const Draw = require('../models/Draw');

const uploadProof = async (req, res) => {
  const { drawId } = req.params;
  const { proofUrl } = req.body;
  const user = req.user._id;

  try {
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });

    // Find the current user in this draw's winners array
    const winIdx = draw.winners.findIndex(w => w.user.toString() === user.toString());
    
    if (winIdx === -1) return res.status(403).json({ message: 'You are not a winner of this draw' });

    // Update proofURL
    draw.winners[winIdx].winnerProof = proofUrl;
    draw.winners[winIdx].payoutStatus = 'Processing';
    await draw.save();

    res.json({ message: 'Proof uploaded and payout processing initialized' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadProof };
