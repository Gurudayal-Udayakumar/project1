import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";
import { API_BASE_URL } from "../config/env";

const API_BASE =
  API_BASE_URL;

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ======================
     FETCH USER PROFILE
  ====================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");

        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ FIXED ROUTE (users not user)
        const res = await axios.get(
          `${API_BASE}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("userToken");
          navigate("/login");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading profile...</p>
      </div>
    );
  }

  /* ======================
     ERROR STATE
  ====================== */
  if (error) {
    return (
      <div className="profile-page">
        <p className="profile-error">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  /* ======================
     FORMAT ADDRESS
  ====================== */
  const formattedAddress = user.address
    ? [
        user.address.street,
        user.address.city,
        user.address.state,
        user.address.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* AVATAR */}
        <div className="profile-avatar-lg">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <h2>My Profile</h2>

        {/* USER INFO */}
        <div className="profile-info">
          <div className="profile-row">
            <span>Name</span>
            <span>{user.name}</span>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <span>{user.email}</span>
          </div>

          {user.phone && (
            <div className="profile-row">
              <span>Phone</span>
              <span>{user.phone}</span>
            </div>
          )}

          {formattedAddress && (
            <div className="profile-row">
              <span>Address</span>
              <span>{formattedAddress}</span>
            </div>
          )}

          <div className="profile-row">
            <span>Account</span>
            <span>{user.role}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">
          <button
            className="edit-btn"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("userToken");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
