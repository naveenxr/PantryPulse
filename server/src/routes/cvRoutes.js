const express = require("express");
const router = express.Router();
let multer;
try {
  multer = require("multer");
} catch (e) {
  multer = null;
}

const { scanFoodImage, submitScanFeedback } = require("../controllers/cvController");

// Memory storage upload handler with 10MB file size limit
const upload = multer
  ? multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  : { single: () => (req, res, next) => next() };

router.post("/scan", upload.single("image"), scanFoodImage);
router.post("/feedback", submitScanFeedback);

module.exports = router;
