import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddFood from "./pages/AddFood";
import Impact from "./pages/Impact";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add-food" element={<AddFood />} />
            <Route path="/impact" element={<Impact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
