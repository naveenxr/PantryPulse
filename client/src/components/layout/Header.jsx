import React from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/inventory":
        return "Food Inventory";
      case "/add-food":
        return "Add New Food";
      case "/impact":
        return "Impact & Savings";
      default:
        return "Overview";
    }
  };

  return (
    <header className="app-header">
      <div className="header-title-container">
        <span className="header-brand-badge">PantryPulse</span>
        <h2 className="header-title">{getPageTitle(location.pathname)}</h2>
      </div>
    </header>
  );
};

export default Header;
