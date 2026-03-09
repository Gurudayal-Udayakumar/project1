import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";
import "../styles/ProductDetail.css";
import { API_BASE_URL } from "../config/env";

const API_BASE =
  API_BASE_URL;

export default function RelatedProducts({ currentProduct }) {
  const [products, setProducts] = useState([]);
  const [start, setStart] = useState(0);

  /* ======================
     FETCH PRODUCTS
  ====================== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("RELATED PRODUCTS ERROR:", err);
      }
    };

    fetchProducts();
  }, []);

  /* ======================
     FILTER RELATED
  ====================== */
  const related = products.filter(
    (p) =>
      p._id !== currentProduct._id &&
      p.category &&
      currentProduct.category &&
      p.category.toLowerCase().trim() ===
        currentProduct.category.toLowerCase().trim()
  );

  const visible = related.slice(start, start + 3);

  const prev = () =>
    setStart(start === 0 ? Math.max(related.length - 3, 0) : start - 1);

  const next = () =>
    setStart(start + 3 >= related.length ? 0 : start + 1);

  if (related.length === 0) return null;

  return (
    <div className="pd-related">
      <h2>You may also like</h2>

      <div className="pd-related-slider">
        <button className="pd-slide-btn" onClick={prev}>
          <FaChevronLeft />
        </button>

        <div className="pd-related-grid">
          {visible.map((p) => (
            <div key={p._id} className="pd-related-card">
              <img src={p.images?.[0]} alt={p.name} />

              <h4>{p.name}</h4>
              <p className="price">₹{p.price}</p>

              <div className="rating">
                {Array.from({ length: p.rating || 4 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              <button className="pd-related-cart">
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          ))}
        </div>

        <button className="pd-slide-btn" onClick={next}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
