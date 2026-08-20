import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, PlusCircle, TrendingUp, Leaf } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Inventory", path: "/inventory", icon: Package },
    { label: "Add Food", path: "/add-food", icon: PlusCircle },
    { label: "Impact", path: "/impact", icon: TrendingUp },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-branding">
        <div className="brand-icon">
          <Leaf size={22} />
        </div>
        <div>
          <h1 className="brand-title">PantryPulse</h1>
          <p className="brand-tagline">Smarter food. Less waste.</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              end={item.path === "/"}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
