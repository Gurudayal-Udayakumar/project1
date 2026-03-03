import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/env";

export default function Returns() {
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/returns`)
      .then((res) => setPolicy(res.data))
      .catch((err) => console.error("RETURNS ERROR:", err));
  }, []);

  if (!policy) return <p>Loading...</p>;

  return (
    <div className="returns-container">
      <h1>{policy.title}</h1>

      <p>{policy.overview}</p>

      <h3>Return Eligibility</h3>
      <ul>
        {policy.returnEligibility.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Non-Returnable Items</h3>
      <ul>
        {policy.nonReturnableItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Refund Process</h3>
      <p>{policy.refundProcess}</p>

      <h3>Refund Mode</h3>
      <ul>
        {policy.refundMode.map((mode, index) => (
          <li key={index}>{mode}</li>
        ))}
      </ul>

      <h3>Exchange Policy</h3>
      <p>{policy.exchangePolicy}</p>

      <h3>Important Notes</h3>
      <ul>
        {policy.notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

