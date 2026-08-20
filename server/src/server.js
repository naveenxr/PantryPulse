require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");
const productRoutes = require("./routes/productRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] }));
app.use(express.json());

// API Routes
app.use("/api/foods", foodRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PantryPulse API is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

// Async Server Startup (Connects DB before listening)
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT} (0.0.0.0:${PORT})`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection error:", error.message);
    process.exit(1);
  }
};

startServer();