import React, { useState, useEffect } from "react";
import { getFoods } from "../services/api";
import { Package } from "lucide-react";

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

const Inventory = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await getFoods({ includeConsumed: false });
        if (res && res.data) {
          setFoods(res.data.foods || []);
        }
      } catch (err) {
        console.error("Inventory fetch error:", err);
        setError("Failed to load inventory. Ensure backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return <div className="status-container">Loading food inventory...</div>;
  }

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Food Inventory</h1>
        <p className="dashboard-subtitle">All active food items currently stored in your household pantry.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {foods.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Package size={32} />
          </div>
          <h3 className="empty-title">No items in inventory</h3>
          <p className="empty-text">Your food inventory is currently empty.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "left" }}>
                <th style={{ padding: "12px 16px" }}>Food Name</th>
                <th style={{ padding: "12px 16px" }}>Category</th>
                <th style={{ padding: "12px 16px" }}>Quantity</th>
                <th style={{ padding: "12px 16px" }}>Storage</th>
                <th style={{ padding: "12px 16px" }}>Days Left</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((item) => {
                const statusClass = getStatusClass(item.freshness?.status);
                return (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <td style={{ padding: "16px", fontWeight: 700, color: "var(--text-main)" }}>
                      {item.name}
                    </td>
                    <td style={{ padding: "16px", textTransform: "capitalize", color: "var(--text-secondary)" }}>
                      {item.category}
                    </td>
                    <td style={{ padding: "16px", fontWeight: 600 }}>
                      {item.quantity} {item.unit}
                    </td>
                    <td style={{ padding: "16px", textTransform: "capitalize", color: "var(--text-secondary)" }}>
                      {item.storageType}
                    </td>
                    <td style={{ padding: "16px", fontWeight: 600 }}>
                      {item.freshness?.daysRemaining < 0
                        ? `${Math.abs(item.freshness.daysRemaining)}d ago`
                        : item.freshness?.daysRemaining === 0
                        ? "Today"
                        : `${item.freshness?.daysRemaining} days`}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span className={`status-badge ${statusClass}`}>{item.freshness?.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
