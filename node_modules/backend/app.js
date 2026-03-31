const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const drawRoutes = require('./routes/drawRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const charityRoutes = require('./routes/charityRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/charities', charityRoutes);

app.get('/api/status', (req, res) => {
  const status = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.json({
    dbStatus: states[status] || 'Unknown',
    host: mongoose.connection.host || 'N/A',
    timestamp: new Date(),
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
