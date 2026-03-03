import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";
import "../styles/AdminOrders.css";
import { API_BASE_URL } from "../config/env";

const API_BASE =
  API_BASE_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  /* =========================
     FETCH ALL ORDERS
  ========================= */
  const fetchOrders = async () => {
    if (!adminToken) {
      console.error("❌ No admin token found");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/api/orders`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      // ✅ FIX: backend returns { success, orders }
      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (error) {
      console.error(
        "❌ Error fetching orders:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MARK ORDERS AS VIEWED
  ========================= */
  const markOrdersViewed = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/orders/mark-viewed`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (error) {
      console.error("❌ Failed to mark orders viewed");
    }
  };

  /* =========================
     INITIAL LOAD + SOCKET
  ========================= */
  useEffect(() => {
    fetchOrders();
    markOrdersViewed();

    // 🔔 REAL-TIME UPDATE
    socket.on("new-order", () => {
      fetchOrders();
    });

    return () => {
      socket.off("new-order");
    };
  }, []);

  if (loading) return <p className="loading-text">Loading Orders...</p>;

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h2>📦 Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">No orders found.</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderId}</td>

                  <td>
                    {Array.isArray(o.items) && o.items.length > 0 ? (
                      o.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} × {item.quantity}
                        </div>
                      ))
                    ) : (
                      <span>No items</span>
                    )}
                  </td>

                  <td>₹{o.totalAmount}</td>

                  <td
                    className={`order-status status-${o.orderStatus.toLowerCase()}`}
                  >
                    {o.orderStatus}
                  </td>

                  <td>
                    {new Date(o.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td>
                    <button
                      className="order-btn btn-view"
                      onClick={() =>
                        navigate(`/orders/${o._id}/track`)
                      }
                    >
                      Track Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
