import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TrackOrder.css";
import { API_BASE_URL } from "../config/env";

/* ======================
   API BASE (SAFE)
====================== */
const API_BASE =
  API_BASE_URL;

const AdminTrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Placed");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const adminToken = localStorage.getItem("adminToken");

  /* =========================
     FETCH ORDER DETAILS
  ========================= */
  const fetchOrderDetails = async () => {
    try {
      if (!adminToken) {
        navigate("/");
        return;
      }

      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      // ✅ FIX: backend returns { success, order }
      setOrder(res.data.order);
      setStatus(res.data.order.orderStatus || "Placed");
    } catch (error) {
      console.error(
        "❌ Error loading order:",
        error.response?.data || error.message
      );
      alert("Failed to load order details");

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE ORDER STATUS
  ========================= */
  const updateStatus = async () => {
    if (!status) return;

    try {
      setUpdating(true);

      await axios.put(
        `${API_BASE}/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      alert("✅ Order status updated");
      fetchOrderDetails();
    } catch (error) {
      console.error(
        "❌ Failed to update status:",
        error.response?.data || error.message
      );
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  /* =========================
     LOAD ON MOUNT
  ========================= */
  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  if (loading) return <p className="loading-text">Loading Order...</p>;
  if (!order) return <p className="loading-text">Order not found.</p>;

  return (
    <div className="track-order">
      <h2>🚚 Track & Update Order</h2>

      {/* ================= ORDER INFO ================= */}
      <div className="status-box">
        <p>
          <strong>Order ID:</strong> {order.orderId}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>
        <p>
          <strong>Current Status:</strong>{" "}
          <span
            className={`status-${order.orderStatus.toLowerCase()}`}
          >
            {order.orderStatus}
          </span>
        </p>
        <p>
          <strong>Placed On:</strong>{" "}
          {new Date(order.createdAt).toLocaleString("en-IN")}
        </p>
      </div>

      {/* ================= STATUS UPDATE ================= */}
      <div className="status-update">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={updating}
        >
          <option value="Placed">Placed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button onClick={updateStatus} disabled={updating}>
          {updating ? "Updating..." : "Update Status"}
        </button>
      </div>

      {/* ================= ITEMS ================= */}
      <div className="status-box">
        <h4>Items</h4>
        {order.items?.length > 0 ? (
          order.items.map((item, index) => (
            <p key={index}>
              {item.name} — {item.quantity} × ₹{item.price}
            </p>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
};

export default AdminTrackOrder;
