const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/email');
const generateToken = require('../config/generateToken');

const buildUniqueUsername = async (seedValue) => {
  const sanitizedSeed = (seedValue || 'player')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 18) || 'player';

  let candidate = sanitizedSeed;
  let attempt = 0;

  while (await User.findOne({ username: candidate })) {
    attempt += 1;
    candidate = `${sanitizedSeed}${attempt}`;
  }

  return candidate;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, username, email: rawEmail, password, isAdmin, charity } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !password || !(name || username)) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const resolvedUsername = await buildUniqueUsername(username || name || email.split('@')[0]);

    const user = await User.create({
      name: name || username,
      username: resolvedUsername,
      email, // Correct: Use normalized email variable
      password,
      isAdmin: isAdmin || false,
      charity: charity || null
    });

    if (user) {
      // Send Welcome Email (Architectural Anchor)
      sendWelcomeEmail(user);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        subscription: user.subscription,
        subscriptionStatus: user.subscriptionStatus,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Handle hardcoded admin case as per USER_REQUEST
    if (email === 'admin@golfcharity.com' && password === 'admin@golfcharity') {
      let adminUser = await User.findOne({ email: 'admin@golfcharity.com' });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'PlatformAdmin',
          email: 'admin@golfcharity.com',
          password: 'admin@golfcharity',
          isAdmin: true
        });
      }
      
      if (!adminUser.isAdmin) {
        adminUser.isAdmin = true;
        await adminUser.save();
      }

      return res.json({
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: true,
        subscription: true,
        subscriptionStatus: 'Active',
        token: generateToken(adminUser._id)
      });
    }

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        subscription: user.subscription,
        subscriptionStatus: user.subscriptionStatus,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

module.exports = { registerUser, authUser };
