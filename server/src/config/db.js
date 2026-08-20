const mongoose = require("mongoose");

/**
 * Connect to MongoDB database using process.env.MONGODB_URI.
 * Throws an error on failure so server initialization halts cleanly.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
