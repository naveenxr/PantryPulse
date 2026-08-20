import React from "react";
import { AlertCircle, Clock, Tag } from "lucide-react";

const getStatusClass = (status) => {
  switch (status) {
    case "FRESH":
      return "fresh";
    case "USE_SOON":
      return "use-soon";
    case "EXPIRING_TODAY":
      return "expiring";
    case "EXPIRED":
      return "expired";
    default:
      return "fresh";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "FRESH":
      return "Fresh";
    case "USE_SOON":
      return "Use Soon";
    case "EXPIRING_TODAY":
      return "Expires Today";
    case "EXPIRED":
      return "Expired";
    default:
      return status;
  }
};

const UseFirstCard = ({ food }) => {
  if (!food) return null;

  const { name, category, quantity, unit, estimatedPrice, freshness = {}, priority = {} } = food;
  const statusClass = getStatusClass(freshness.status);
  const statusLabel = getStatusLabel(freshness.status);

  return (
    <div className="use-first-card">
      <div className="card-top">
        <div>
          <h3 className="item-name">{name}</h3>
          <div className="item-meta">
            <span>{quantity} {unit}</span>
            <span>•</span>
            <span style={{ textTransform: "capitalize" }}>{category}</span>
          </div>
        </div>
        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={14} /> Days Left:
          </span>
          <span className="detail-value">
            {freshness.daysRemaining < 0
              ? `${Math.abs(freshness.daysRemaining)} days ago`
              : freshness.daysRemaining === 0
              ? "Today"
              : `${freshness.daysRemaining} days`}
          </span>
        </div>

        {estimatedPrice > 0 && (
          <div className="detail-row">
            <span className="detail-label" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Tag size={14} /> Est. Price:
            </span>
            <span className="detail-value">₹{estimatedPrice}</span>
          </div>
        )}
      </div>

      <div className={`urgency-banner ${statusClass}`}>
        <AlertCircle size={16} />
        <span>{priority.priorityReason || "Requires priority usage"}</span>
      </div>
    </div>
  );
};

export default UseFirstCard;
