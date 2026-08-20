import React from "react";
import { TrendingUp } from "lucide-react";

const Impact = () => {
  return (
    <div className="page-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Sustainability & Money Saved</h1>
        <p className="dashboard-subtitle">Track your environmental impact and financial savings.</p>
      </div>

      <div className="empty-state" style={{ maxWidth: "600px" }}>
        <div className="empty-icon">
          <TrendingUp size={32} />
        </div>
        <h3 className="empty-title">Your food impact dashboard is coming next.</h3>
        <p className="empty-text">
          Detailed metrics on money saved, food waste reduced, and household sustainability analytics will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default Impact;
