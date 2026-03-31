const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
  }
};

startServer();
