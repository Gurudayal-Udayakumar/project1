import "../styles/Policy.css";

const TermsAndConditions = () => {
  return (
    <div className="policy-page">
      <h1>Terms &amp; Conditions</h1>
      <p>
        These Terms govern your use of KidsStore services, website, and purchases.
        By creating an account or placing an order, you agree to these Terms.
      </p>

      <h3>1. User Responsibilities</h3>
      <ul>
        <li>Provide accurate account and delivery information.</li>
        <li>Keep account credentials secure and confidential.</li>
        <li>Use the platform lawfully and avoid fraudulent activity.</li>
      </ul>

      <h3>2. Account Usage Rules</h3>
      <ul>
        <li>Accounts are personal and must not be shared for unauthorized use.</li>
        <li>We may suspend or terminate accounts engaged in abuse, fraud, or policy violations.</li>
      </ul>

      <h3>3. Orders and Payments</h3>
      <p>
        Product availability, pricing, and delivery timelines are subject to change.
        We reserve the right to cancel or refuse orders in cases of pricing errors, fraud detection,
        or stock unavailability.
      </p>

      <h3>4. Limitation of Liability</h3>
      <p>
        To the extent permitted by law, KidsStore is not liable for indirect, incidental,
        or consequential damages arising from use of the service.
      </p>

      <h3>5. Governing Law</h3>
      <p>
        These Terms are governed by applicable laws of [Your State/Country].
      </p>
    </div>
  );
};

export default TermsAndConditions;
