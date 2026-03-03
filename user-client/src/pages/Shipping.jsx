import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/env";

export default function Shipping() {
  const [shipping, setShipping] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/shipping`)
      .then((res) => setShipping(res.data))
      .catch((err) => console.error("SHIPPING ERROR:", err));
  }, []);

  if (!shipping) return <p>Loading...</p>;

  return (
    <div className="shipping-container">
      <h1>{shipping.title}</h1>

      <p>{shipping.overview}</p>

      <h3>Delivery Time</h3>
      <ul>
        {shipping.deliveryTime.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Shipping Charges</h3>
      <ul>
        {shipping.shippingCharges.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Packaging & Safety</h3>
      <p>{shipping.packaging}</p>

      <h3>Order Tracking</h3>
      <p>{shipping.tracking}</p>

      <h3>Delivery Partners</h3>
      <ul>
        {shipping.deliveryPartners.map((partner, index) => (
          <li key={index}>{partner}</li>
        ))}
      </ul>

      <h3>Important Notes</h3>
      <ul>
        {shipping.notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

