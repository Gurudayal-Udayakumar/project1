import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminOffers.css";
import { API_BASE_URL } from "../config/env";

const API_BASE = `${API_BASE_URL}/api`;

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: "",
  });

  const token = localStorage.getItem("adminToken");

  /* ======================
     FETCH OFFERS
  ====================== */
  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_BASE}/offers`);

      // supports both [] and { offers: [] }
      const list = Array.isArray(res.data)
        ? res.data
        : res.data.offers || [];

      setOffers(list);
    } catch (err) {
      console.error("FETCH OFFERS ERROR:", err);
      setError("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  /* ======================
     CREATE OFFER
  ====================== */
  const submit = async () => {
    if (!form.title || !form.discountPercent) {
      alert("Title & discount are required");
      return;
    }

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

      alert("✅ Offer created");
      setForm({ title: "", description: "", discountPercent: "" });
      fetchOffers();
    } catch (err) {
      console.error("CREATE OFFER ERROR:", err);
      alert("❌ Failed to create offer");
    }
  };

  /* ======================
     TOGGLE OFFER
  ====================== */
  const toggleOffer = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/offers/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOffers();
    } catch (err) {
      console.error("TOGGLE OFFER ERROR:", err);
      alert("❌ Toggle failed");
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div style={{ padding: 40 }}>
      <h2>🎁 Create Offer</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Discount %"
        value={form.discountPercent}
        onChange={(e) =>
          setForm({ ...form, discountPercent: e.target.value })
        }
      />

      <button onClick={submit}>Create Offer</button>

      <hr />

      <h3>📋 Offers</h3>

      {loading && <p>Loading...</p>}

      {!loading && offers.length === 0 && (
        <p>No offers found</p>
      )}

      {offers.map((o) => (
        <div
          key={o._id}
          style={{
            padding: 12,
            marginBottom: 10,
            border: "1px solid #ccc",
          }}
        >
          <strong>{o.title}</strong> — {o.discountPercent}%
          <br />
          Status: {o.isActive ? "🟢 Active" : "🔴 Disabled"}
          <br />
          <button onClick={() => toggleOffer(o._id)}>
            Toggle
          </button>
        </div>
      ))}
    </div>
  );
}
