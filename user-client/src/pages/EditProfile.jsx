import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";
import { API_BASE_URL } from "../config/env";

const API_BASE =
  API_BASE_URL;

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* ======================
     LOAD CURRENT PROFILE
  ====================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");

        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ FIXED HERE (users not user)
        const res = await axios.get(
          `${API_BASE}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const u = res.data.user;

        setForm({
          name: u.name || "",
          phone: u.phone || "",
          street: u.address?.street || "",
          city: u.address?.city || "",
          state: u.address?.state || "",
          pincode: u.address?.pincode || "",
        });
      } catch (err) {
        console.error("EDIT PROFILE LOAD ERROR:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("userToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ======================
     SUBMIT
  ====================== */
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("userToken");

      // ✅ FIXED HERE ALSO
      await axios.put(
        `${API_BASE}/api/users/profile`,
        {
          name: form.name,
          phone: form.phone,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/profile");
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <form className="profile-card" onSubmit={submitHandler}>
        <h2>Edit Profile</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Street"
          value={form.street}
          onChange={(e) =>
            setForm({ ...form, street: e.target.value })
          }
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        <input
          placeholder="State"
          value={form.state}
          onChange={(e) =>
            setForm({ ...form, state: e.target.value })
          }
        />

        <input
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) =>
            setForm({ ...form, pincode: e.target.value })
          }
        />

        <div className="profile-actions">
          <button className="edit-btn" type="submit">
            Save Changes
          </button>

          <button
            type="button"
            className="logout-btn"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
