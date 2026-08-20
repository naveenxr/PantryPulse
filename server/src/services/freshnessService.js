/**
 * Freshness Service
 * Calculates food item expiration date, days remaining, and freshness status.
 */

const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Calculates freshness metrics for a food item.
 * @param {Object} item - Food item containing purchaseDate and shelfLifeDays
 * @returns {Object} Freshness object { expiryDate, daysRemaining, status, isExpired }
 */
const calculateFreshness = (item) => {
  const purchaseDate = item.purchaseDate ? new Date(item.purchaseDate) : new Date();
  const shelfLifeDays = Number(item.shelfLifeDays) || 1;

  const purchaseStart = getStartOfDay(purchaseDate);
  const expiryDate = new Date(purchaseStart.getTime() + shelfLifeDays * 24 * 60 * 60 * 1000);

  const todayStart = getStartOfDay(new Date());
  const diffTime = expiryDate.getTime() - todayStart.getTime();
  const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let status;
  let isExpired = false;

  if (daysRemaining < 0) {
    status = "EXPIRED";
    isExpired = true;
  } else if (daysRemaining === 0) {
    status = "EXPIRING_TODAY";
  } else if (daysRemaining === 1 || daysRemaining === 2) {
    status = "USE_SOON";
  } else {
    status = "FRESH";
  }

  return {
    expiryDate: expiryDate.toISOString(),
    daysRemaining,
    status,
    isExpired,
  };
};

module.exports = {
  calculateFreshness,
};
