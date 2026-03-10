import { useEffect, useState } from "react";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import socket from "../services/socket";
import "../styles/GirlsProducts.css";
import { API_BASE_URL } from "../config/env";

const categories = [
  "All",
  "T-Shirts",
  "Shirts",
  "Shorts",
  "Jeans",
  "Jackets",
];

export default function GirlsProducts() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
      INITIAL FETCH
  ========================= */
  useEffect(() => {
    fetchProducts();

    socket.on("product-added", (product) => {
      setProducts((prev) => [product, ...prev]);
    });

    return () => socket.off("product-added");
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      FILTER LOGIC (FIXED)
  ========================= */

  // ✅ Filter only girls products (case safe)
  const girlsOnly = products.filter(
    (p) => p.gender?.toLowerCase() === "girls"
  );

  // ✅ Category filter (case safe)
  const filteredProducts =
    activeCategory === "All"
      ? girlsOnly
      : girlsOnly.filter(
          (p) =>
            p.category?.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  return (
    <div className="girls-page">
      <h1 className="girls-title">Girls Collection</h1>

      <CategoryTabs
        categories={categories}
        active={activeCategory}
        setActive={setActiveCategory}
      />

      <div className="girls-grid">
        {loading ? (
          <div
            style={{
              color: "white",
              width: "100%",
              textAlign: "center",
              marginTop: "50px",
            }}
          >
            <h2>Loading collection...</h2>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              width: "100%",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            No products found for {activeCategory}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

