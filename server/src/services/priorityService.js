/**
 * Priority Service
 * Calculates priority score and human-readable reason for using items first.
 */

/**
 * Calculates priority metrics given freshness data and estimated price.
 * @param {Object} freshness - Calculated freshness object
 * @param {Number} estimatedPrice - Estimated item price
 * @returns {Object} Priority object { priorityScore, priorityReason }
 */
const calculatePriority = (freshness, estimatedPrice = 0) => {
  const { status, daysRemaining } = freshness;
  let freshnessScore = 10;
  let priorityReason = "Fresh, but should be monitored";

  switch (status) {
    case "EXPIRED":
      freshnessScore = 100;
      priorityReason = "Expired item requires immediate attention";
      break;
    case "EXPIRING_TODAY":
      freshnessScore = 95;
      priorityReason = "Expires today";
      break;
    case "USE_SOON":
      freshnessScore = 80 + (3 - daysRemaining) * 5;
      priorityReason = daysRemaining === 1 ? "Only 1 day remaining" : `Only ${daysRemaining} days remaining`;
      break;
    case "FRESH":
    default:
      freshnessScore = Math.max(10, 80 - (daysRemaining - 3) * 5);
      priorityReason = "Fresh, but should be monitored";
      break;
  }

  const priceScore = Math.min(20, Math.max(0, Number(estimatedPrice) || 0) / 10);
  const rawScore = freshnessScore + priceScore;
  const priorityScore = Math.round(rawScore * 100) / 100;

  return {
    priorityScore,
    priorityReason,
  };
};

module.exports = {
  calculatePriority,
};
