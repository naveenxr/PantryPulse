const mongoose = require("mongoose");

/**
 * Connect to MongoDB database using process.env.MONGODB_URI.
 * Connects asynchronously with error logging to prevent web server crash on startup.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.error(`Please ensure Render IP or 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.`);
    return null;
  }
};

module.exports = connectDB;
