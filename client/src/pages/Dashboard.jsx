import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle2, AlertTriangle, XCircle, PlusCircle, Flame } from "lucide-react";
import { getFoods, getUseFirstFoods } from "../services/api";
import StatCard from "../components/dashboard/StatCard";
import UseFirstCard from "../components/dashboard/UseFirstCard";

const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [useFirstFoods, setUseFirstFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [allFoodsRes, useFirstRes] = await Promise.all([
          getFoods({ includeConsumed: false }),
          getUseFirstFoods(5),
        ]);

        if (allFoodsRes && allFoodsRes.data) {
          setFoods(allFoodsRes.data.foods || []);
        }

        if (useFirstRes && useFirstRes.data) {
          setUseFirstFoods(useFirstRes.data.foods || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Unable to load pantry data. Make sure the backend server is running on http://localhost:5000.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute Statistics
  const totalItems = foods.length;
  const freshItems = foods.filter((f) => f.freshness?.status === "FRESH").length;
  const useSoonItems = foods.filter(
    (f) => f.freshness?.status === "USE_SOON" || f.freshness?.status === "EXPIRING_TODAY"
  ).length;
  const expiredItems = foods.filter((f) => f.freshness?.status === "EXPIRED").length;

  if (loading) {
    return <div className="status-container">Loading your PantryPulse dashboard...</div>;
  }

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Smart Food Dashboard</h1>
        <p className="dashboard-subtitle">Track freshness, prevent waste, and use items in optimal order.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* 4 StatCards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          color="#3B82F6"
          bgColor="rgba(59, 130, 246, 0.15)"
        />
        <StatCard
          title="Fresh Items"
          value={freshItems}
          icon={CheckCircle2}
          color="#10B981"
          bgColor="rgba(16, 185, 129, 0.15)"
        />
        <StatCard
          title="Use Soon / Today"
          value={useSoonItems}
          icon={AlertTriangle}
          color="#F59E0B"
          bgColor="rgba(245, 158, 11, 0.15)"
        />
        <StatCard
          title="Expired Items"
          value={expiredItems}
          icon={XCircle}
          color="#EF4444"
          bgColor="rgba(239, 68, 68, 0.15)"
        />
      </div>

      {/* Empty State */}
      {totalItems === 0 && !loading && !error ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Package size={32} />
          </div>
          <h3 className="empty-title">Your pantry is empty</h3>
          <p className="empty-text">
            Add your first food item and PantryPulse will help you use it before it goes to waste.
          </p>
          <Link to="/add-food" className="primary-btn">
            <PlusCircle size={18} /> Add First Food Item
          </Link>
        </div>
      ) : (
        /* USE FIRST Section */
        <section style={{ marginTop: "2rem" }}>
          <div className="section-header">
            <h2 className="section-title">
              <Flame color="#F59E0B" fill="#F59E0B" size={22} />
              USE FIRST (Top Priority)
            </h2>
          </div>

          <div className="use-first-grid">
            {useFirstFoods.map((food) => (
              <UseFirstCard key={food._id} food={food} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
