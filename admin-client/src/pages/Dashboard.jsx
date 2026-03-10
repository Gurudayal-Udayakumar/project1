import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../services/socket";
import "../styles/Dashboard.css";
import { API_BASE_URL } from "../config/env";

const API_BASE = `${API_BASE_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    unreadOrders: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });

  const adminToken = localStorage.getItem("adminToken");

  /* ======================
      LOGOUT
  ====================== */
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  /* ======================
      FETCH DASHBOARD DATA
  ====================== */
const fetchDashboardStats = async () => {
  try {
    if (!adminToken) {
      logout();
      return;
    }

    const res = await axios.get(`${API_BASE}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });


    // ✅ API returns flat object — USE IT DIRECTLY
    const statsData = res.data;

    setStats({
      unreadOrders: statsData.unreadOrders ?? 0,
      totalOrders: statsData.totalOrders ?? 0,
      monthlyRevenue: statsData.monthlyRevenue ?? 0,
      pendingOrders: statsData.pendingOrders ?? 0,
      totalProducts: statsData.totalProducts ?? 0,
    });
  } catch (err) {
    console.error("❌ Dashboard fetch failed", err);
  }
};



  /* ======================
      SOCKET + INITIAL LOAD
  ====================== */
  useEffect(() => {
    fetchDashboardStats();

    socket.on("new-order", fetchDashboardStats);

    return () => {
      socket.off("new-order");
    };
  }, []);

  return (
    <div className="admin-dashboard">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <h1>🧵 Kids Textile Admin Dashboard</h1>

        <div className="header-actions">
          {stats.unreadOrders > 0 && (
            <div className="order-alert">
              🔔 {stats.unreadOrders} New Order
              {stats.unreadOrders > 1 && "s"}
            </div>
          )}

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ================= STATS ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📦 Orders</h3>
          <p>{stats.totalOrders}</p>
          <span>Total Orders</span>
        </div>

        <div className="stat-card">
          <h3>💳 Revenue</h3>
          <p>₹{stats.monthlyRevenue.toLocaleString()}</p>
          <span>This Month</span>
        </div>

        <div className="stat-card">
          <h3>🚚 Pending</h3>
          <p>{stats.pendingOrders}</p>
          <span>To be Shipped</span>
        </div>

        <div className="stat-card">
          <h3>🛍 Products</h3>
          <p>{stats.totalProducts}</p>
          <span>Active Items</span>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="action-section">
        <h2>Admin Actions</h2>

        <div className="action-grid">
          <button className="action-card" onClick={() => navigate("/admin-orders")}>
            📦 Track Orders
          </button>

          <button className="action-card" onClick={() => navigate("/admin-payments")}>
            💳 Payment Status
          </button>

          <button className="action-card" onClick={() => navigate("/add-product")}>
            ➕ Add Product
          </button>

          <button className="action-card" onClick={() => navigate("/admin-offers")}>
            🎁 Create Offer
          </button>

          <button className="action-card" onClick={() => navigate("/admin-users")}>
            👥 Customers
          </button>

          <button className="action-card" onClick={() => navigate("/admin-reports")}>
            📊 Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;