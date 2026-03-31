const express = require('express');
const router = express.Router();

const { getUsers, runDraw, getWinners, verifyWinner, publishDraw, updateUser } = require('../controllers/adminController');
const { getReports } = require('../controllers/reportController');
const Charity = require('../models/Charity');
const { protect, admin } = require('../middleware/auth');

router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUser);
router.post('/draw', protect, admin, runDraw);
router.put('/draw/:id/publish', protect, admin, publishDraw);
router.get('/winners', protect, admin, getWinners);
router.put('/winners/:drawId/:userId/verify', protect, admin, verifyWinner);
router.get('/reports', protect, admin, getReports);

// Charity Management CRUD (Admin Only)
router.post('/charities', protect, admin, async (req, res) => {
  try {
    const c = await Charity.create(req.body);
    res.status(201).json(c);
  } catch { res.status(500).json({ message: 'Error' }); }
});

router.delete('/charities/:id', protect, admin, async (req, res) => {
   try {
     await Charity.findByIdAndDelete(req.params.id);
     res.status(204).end();
   } catch { res.status(500).json({ message: 'Error' }); }
});

module.exports = router;
