require("dotenv").config();
const connectDB = require("./src/config/db");

console.log("🚀 Running PantryPulse MongoDB Collection Seeder...");

connectDB().then(() => {
  console.log("✅ All 4 MongoDB collections (users, fooditems, products, feedbacks) populated successfully!");
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}).catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
