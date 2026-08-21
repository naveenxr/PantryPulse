require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");
const productRoutes = require("./routes/productRoutes");
const aiRoutes = require("./routes/aiRoutes");
const cvRoutes = require("./routes/cvRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] }));
app.use(express.json());

// API Routes
app.use("/api/foods", foodRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pantry", cvRoutes);
app.use("/api/auth", authRoutes);

// Root Route & Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "PantryPulse Backend API",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PantryPulse API is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

// Start Express server immediately for Render port binding
app.listen(PORT, "0.0.0.0", () => {
  console.log(`PantryPulse Server listening on port ${PORT} (0.0.0.0:${PORT})`);
  // Connect to MongoDB Atlas in background
  connectDB();
});