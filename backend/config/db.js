const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  try {
    if (cachedConnection || mongoose.connection.readyState === 1) {
      return cachedConnection || mongoose.connection;
    }

    cachedConnection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
