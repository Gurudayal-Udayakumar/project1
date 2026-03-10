import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/NewArrivals.css";
import { API_BASE_URL } from "../config/env";

const API_BASE =
  API_BASE_URL;

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("boys");
  const [loading, setLoading] = useState(true);

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
        console.error("FETCH PRODUCTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ======================
     SAFE FILTER
  ====================== */
  const filtered = products.filter(
  (p) =>
    p.category &&
    p.category.toLowerCase().trim() === active
);


  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading products...</p>;
  }

  return (
    <section className="new-arrivals">
      <h2>New Arrivals</h2>

      <div className="collection-tabs">
        <button
          className={active === "boys" ? "active" : ""}
          onClick={() => setActive("boys")}
        >
          👕 Boys
        </button>

        <button
          className={active === "girls" ? "active" : ""}
          onClick={() => setActive("girls")}
        >
          👗 Girls
        </button>

        <button
          className={active === "toddlers" ? "active" : ""}
          onClick={() => setActive("toddlers")}
        >
          🧸 Toddlers
        </button>
      </div>

      <div className="product-grid">
        {filtered.length === 0 ? (
          <p>No products found</p>
        ) : (
          filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}
