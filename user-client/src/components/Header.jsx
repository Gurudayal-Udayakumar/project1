import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSignOutAlt,
  FaBoxOpen,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useFavorite } from "../context/FavoriteContext";

import "../styles/Header.css";
import SearchBox from "./SearchBox";
import { API_BASE_URL } from "../config/env";

export default function Header() {
  const { cart } = useCart();
  const { favorites } = useFavorite();

  const [showMenu, setShowMenu] = useState(false);

  const userToken = localStorage.getItem("userToken");

  /* ======================
     CART COUNT
  ====================== */
  const totalQty = useMemo(() => {
    return Array.isArray(cart)
      ? cart.reduce((sum, item) => sum + item.qty, 0)
      : 0;
  }, [cart]);

  /* ======================
     FAVORITES COUNT
  ====================== */
  const totalFav = useMemo(() => {
    return Array.isArray(favorites) ? favorites.length : 0;
  }, [favorites]);

  /* ======================
     CLOSE MENU ON OUTSIDE CLICK
  ====================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-wrapper")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ======================
     LOGOUT (GOOGLE SAFE)
  ====================== */
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout request failed (safe to ignore)");
    }

    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");

    setShowMenu(false);

    window.location.href = "/";
  };

  return (
    <header className="header">
      {/* LOGO */}
      <Link to="/home" className="header-logo">
        Kids<span>Store</span>
      </Link>

      {/* SEARCH */}
      <SearchBox />

      {/* RIGHT SIDE ICONS */}
      <div className="header-right">
        {/* FAVORITES */}
        <Link to="/favorites" className="cart-icon" title="Favorites">
          <FaHeart />
          {totalFav > 0 && (
            <span className="cart-badge">{totalFav}</span>
          )}
        </Link>

        {/* CART */}
        <Link to="/cart" className="cart-icon" title="Cart">
          <FaShoppingCart />
          {totalQty > 0 && (
            <span className="cart-badge">{totalQty}</span>
          )}
        </Link>

        {/* PROFILE */}
        {userToken ? (
          <div className="profile-wrapper">
            <button
              className="profile-avatar"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              title="Profile"
            >
              <FaUser />
            </button>

            {showMenu && (
              <div
                className="profile-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to="/profile"
                  onClick={() => setShowMenu(false)}
                >
                  <FaUser /> My Profile
                </Link>

                <Link
                  to="/my-orders"
                  onClick={() => setShowMenu(false)}
                >
                  <FaBoxOpen /> My Orders
                </Link>

                <button
                  onClick={logout}
                  className="logout-btn"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/" className="profile-avatar">
            <FaUser />
          </Link>
        )}
      </div>
    </header>
  );
}

