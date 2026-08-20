import React from "react";
import { PlusCircle } from "lucide-react";

const AddFood = () => {
  return (
    <div className="page-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Add Food Item</h1>
        <p className="dashboard-subtitle">Log new food items into your pantry inventory.</p>
      </div>

      <div className="empty-state" style={{ maxWidth: "600px" }}>
        <div className="empty-icon">
          <PlusCircle size={32} />
        </div>
        <h3 className="empty-title">Add Food Form Coming Soon</h3>
        <p className="empty-text">
          The interactive form for adding new food items, custom categories, and expiration dates will be enabled in the next phase.
        </p>
      </div>
    </div>
  );
};

export default AddFood;
