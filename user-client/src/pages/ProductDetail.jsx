import { useState, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaBolt,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorite } from "../context/FavoriteContext";
import QuantitySelector from "../components/QuantitySelector";
import "../styles/ProductDetail.css";
import { API_BASE_URL } from "../config/env";

const BACKEND_URL =
  API_BASE_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/products/${id}`
        );
        const data = await res.json();
        setProduct(data.product);

        // Fetch related products (same category)
        const relatedRes = await fetch(
  `${API_BASE_URL}/api/products?category=${data.product.category}`
);
        const relatedData = await relatedRes.json();

        const filtered = relatedData.products
          ?.filter((p) => p._id !== id)
          ?.slice(0, 3);

        setRelatedProducts(filtered || []);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  /* ================= IMAGES ================= */
  const images =
    product.images?.length > 0
      ? product.images.map((img) =>
          img.startsWith("http")
            ? img
            : `${BACKEND_URL}${img}`
        )
      : ["/placeholder.png"];

  const discount =
    product.discountPrice &&
    Math.round(
      ((product.price - product.discountPrice) /
        product.price) *
        100
    );

  const inStock = product.sizes?.some((s) => s.stock > 0);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    if (!selectedSize) return alert("Select size");

    addToCart({
      ...product,
      size: selectedSize,
      qty,
      image: images[0],
    });
  };

  /* ================= UI ================= */
  return (
    <div className="pd-wrapper">
      <div className="pd-top">

        {/* ===== LEFT: IMAGE GALLERY ===== */}
        <div className="pd-gallery">
          <div className="pd-main-img">
            <img src={images[activeImg]} alt={product.name} />
          </div>

          <div className="pd-thumbs">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                className={i === activeImg ? "active" : ""}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        </div>

        {/* ===== RIGHT: PRODUCT INFO ===== */}
        <div className="pd-details">
          <h1>{product.name}</h1>

          <p className="pd-brand">
            Brand: {product.brand || "KidsWear"}
          </p>

          <div className="pd-rating">
            <FaStar /><FaStar /><FaStar /><FaStar />
            <FaStar className="dim" />
            <span>4.5 (128 reviews)</span>
          </div>

          {/* PRICE */}
          <div className="pd-price">
            {product.discountPrice ? (
              <>
                <span className="new-price">
                  ₹{product.discountPrice}
                </span>
                <span className="old-price">
                  ₹{product.price}
                </span>
                <span className="discount">
                  {discount}% OFF
                </span>
              </>
            ) : (
              <span>₹{product.price}</span>
            )}
          </div>

          {/* STOCK */}
          <p className={inStock ? "stock-ok" : "stock-out"}>
            {inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* SIZE */}
          <div className="pd-section">
            <label>Select Size</label>
            <div className="pd-sizes">
              {product.sizes?.map((s) => (
                <button
                  key={s.label}
                  disabled={s.stock === 0}
                  className={
                    selectedSize === s.label ? "active" : ""
                  }
                  onClick={() => setSelectedSize(s.label)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="pd-section">
            <label>Quantity</label>
            <QuantitySelector value={qty} onChange={setQty} />
          </div>

          {/* ACTIONS */}
          <div className="pd-actions">
            <button onClick={handleAddToCart}>
              <FaShoppingCart /> Add to Cart
            </button>

            <button className="buy-now">
              <FaBolt /> Buy Now
            </button>

            <button
              className="wishlist"
              onClick={() => toggleFavorite(product)}
            >
              {isFavorite(product._id) ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}
            </button>
          </div>

          <div className="pd-delivery">
            <p>🚚 Free Delivery by 20 Feb</p>
            <p>💳 Cash on Delivery Available</p>
            <p>🔁 7-Day Easy Return</p>
          </div>
        </div>
      </div>

      {/* ================= BELOW ================= */}
      <div className="pd-bottom">

        {/* DESCRIPTION */}
        <div className="pd-desc">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>

        {/* SPECIFICATIONS */}
        <div className="pd-specs">
          <h2>Specifications</h2>
          <ul>
            <li>Fabric: {product.fabric || "Cotton"}</li>
            <li>Gender: {product.gender}</li>
            <li>Category: {product.category}</li>
            <li>SKU: {product.productCode}</li>
          </ul>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="pd-related">
          <h2>Related Products</h2>

          <div className="pd-related-grid">
            {relatedProducts.map((p) => {
              const img =
                p.images?.[0]?.startsWith("http")
                  ? p.images[0]
                  : `${BACKEND_URL}${p.images?.[0]}`;

              return (
                <div
                  key={p._id}
                  className="pd-related-card"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <img src={img} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>₹{p.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
