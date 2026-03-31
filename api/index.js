const dotenv = require('dotenv');
const connectDB = require('../backend/config/db');
const app = require('../backend/app');

dotenv.config({ path: './backend/.env' });

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
