import React from "react";

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div
        className="stat-icon-box"
        style={{
          color: color || "var(--primary)",
          backgroundColor: bgColor || "var(--primary-glow)",
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};

export default StatCard;
