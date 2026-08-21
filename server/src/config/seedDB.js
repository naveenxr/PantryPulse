const mongoose = require("mongoose");
const FoodItem = require("../models/FoodItem");
const Feedback = require("../models/Feedback");

/**
 * Mongoose Schema for Grocery Products Catalog
 */
const productCatalogSchema = new mongoose.Schema(
  {
    barcode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "packaged" },
    shelfLifeDays: { type: Number, default: 30 },
    storageType: { type: String, default: "room" },
    estimatedPrice: { type: Number, default: 50 },
    brand: { type: String, default: "PantryPulse" },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productCatalogSchema);

/**
 * Seeds catalog products and feedback models without creating dummy users.
 * All user registrations come directly from real mobile/web user signups!
 */
const seedDatabaseCollections = async () => {
  try {
    console.log("[MongoDB Seeder] Verifying database catalog...");

    // 1. Seed Products Barcode Catalog Collection
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.create([
        {
          barcode: "8904132988873",
          name: "Reliance Independence Biscuits",
          category: "packaged",
          shelfLifeDays: 180,
          storageType: "room",
          estimatedPrice: 10,
          brand: "Independence",
        },
        {
          barcode: "8901058852326",
          name: "Campa Cola 500ml PET",
          category: "packaged",
          shelfLifeDays: 90,
          storageType: "refrigerator",
          estimatedPrice: 20,
          brand: "Campa",
        },
        {
          barcode: "8901058852333",
          name: "Maggie 2-Minute Noodles 70g",
          category: "packaged",
          shelfLifeDays: 240,
          storageType: "room",
          estimatedPrice: 14,
          brand: "Nestle",
        },
        {
          barcode: "8901234567890",
          name: "Fresh Farm Eggs (6 Pack)",
          category: "other",
          shelfLifeDays: 14,
          storageType: "refrigerator",
          estimatedPrice: 42,
          brand: "Farm Fresh",
        },
      ]);
      console.log("[MongoDB Seeder] Created 'products' collection.");
    }

    // 2. Seed Feedbacks Collection
    const feedbackCount = await Feedback.countDocuments();
    if (feedbackCount === 0) {
      await Feedback.create({
        scanId: `seed_scan_${Date.now()}`,
        modelVersion: "yolo-world-v1",
        originalDetections: [{ label: "tomato", confidence: 0.94 }],
        confirmedItems: [{ label: "Tomato", quantity: 3 }],
        userCorrections: [],
      });
      console.log("[MongoDB Seeder] Created 'feedbacks' collection.");
    }

    // 3. Seed FoodItems Collection if empty
    const foodCount = await FoodItem.countDocuments();
    if (foodCount === 0) {
      await FoodItem.create([
        {
          name: "Tomato",
          category: "vegetable",
          quantity: 5,
          unit: "pcs",
          purchaseDate: new Date().toISOString(),
          shelfLifeDays: 7,
          storageType: "room",
          estimatedPrice: 30,
          isConsumed: false,
        },
        {
          name: "Fresh Milk",
          category: "dairy",
          quantity: 1,
          unit: "litre",
          purchaseDate: new Date().toISOString(),
          shelfLifeDays: 3,
          storageType: "refrigerator",
          estimatedPrice: 60,
          isConsumed: false,
        },
      ]);
      console.log("[MongoDB Seeder] Created 'fooditems' collection.");
    }

    console.log("[MongoDB Seeder] Database catalog active!");
  } catch (err) {
    console.error("[MongoDB Seeder Warning]:", err.message);
  }
};

module.exports = seedDatabaseCollections;
