const mongoose = require("mongoose");
const seedDatabaseCollections = require("./seedDB");

/**
 * Connect to MongoDB database using process.env.MONGODB_URI.
 * Connects asynchronously & seeds all 4 database collections (users, fooditems, products, feedbacks).
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically seed all required collections
    await seedDatabaseCollections();
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.error(`Please ensure Render IP or 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.`);
    return null;
  }
};

module.exports = connectDB;
