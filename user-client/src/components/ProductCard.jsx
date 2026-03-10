import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../context/FavoriteContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "../styles/ProductCard.css";
import { API_BASE_URL } from "../config/env";

const BACKEND_URL =
  API_BASE_URL;

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorite();
  const { addToCart } = useCart();

  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  /* ================= IMAGE HANDLING ================= */

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith("http")
            ? img
            : `${BACKEND_URL}${img}`
        )
      : ["/placeholder.png"];

  const fav = isFavorite(product._id);

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImg((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  /* ================= UI ================= */

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* IMAGE WRAPPER */}
      <div className="card-image-wrapper">
        <img
          src={images[activeImg]}
          alt={product?.name || "Product"}
        />

        {/* Slider Arrows */}
        {images.length > 1 && (
          <>
            <button className="img-arrow left" onClick={prevImage}>
              <FaChevronLeft />
            </button>
            <button className="img-arrow right" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Wishlist Floating */}
        <button
          className="wishlist-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
        >
          {fav ? (
            <FaHeart className="active-heart" />
          ) : (
            <FaRegHeart />
          )}
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="product-info">
        <h3>{product.name}</h3>

        <div className="rating">
          <FaStar /> {product.rating || 4.5}
        </div>

        <p className="price">₹{product.price}</p>

        <div className="card-actions">
          <button
            className="buy-now"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...product, image: images[0] });
              navigate("/checkout");
            }}
          >
            Buy Now
          </button>

          <button
            className="add-cart"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...product, image: images[0] });
            }}
          >
            <FaShoppingCart /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
