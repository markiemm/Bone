const mongoose = require('mongoose');
const logger = require('./logger');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    logger.info('✅ Connected to MongoDB');
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;