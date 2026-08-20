const express = require("express");
const router = express.Router();
const { getProductByBarcode } = require("../controllers/productController");

// Base route: /api/products
router.get("/barcode/:barcode", getProductByBarcode);

module.exports = router;
