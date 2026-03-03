import { useState } from "react";
import axios from "axios";
import "../styles/AdminOffers.css";
import { API_BASE_URL } from "../config/env";

const API_BASE = `${API_BASE_URL}/api`;

const AddOffer = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.discountPercent) {
      alert("Title & Discount are required");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE}/offers`,
        {
          ...form,
          discountPercent: Number(form.discountPercent),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Offer created successfully");
      setForm({ title: "", description: "", discountPercent: "" });
    } catch (err) {
      console.error("CREATE OFFER ERROR:", err);
      alert("❌ Failed to create offer");
    }

    setLoading(false);
  };

  return (
    <div className="create-offer-container">
      <h2>🎁 Create New Offer</h2>

      <form onSubmit={handleSubmit} className="offer-form">
        <label>Offer Title</label>
        <input
          type="text"
          placeholder="Offer Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <label>Discount Percentage</label>
        <input
          type="number"
          placeholder="Discount %"
          value={form.discountPercent}
          onChange={(e) =>
            setForm({
              ...form,
              discountPercent: e.target.value,
            })
          }
        />

        <label>Description</label>
        <textarea
          placeholder="Write offer details..."
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="submit-offer-btn"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Offer"}
        </button>
      </form>
    </div>
  );
};

export default AddOffer;
