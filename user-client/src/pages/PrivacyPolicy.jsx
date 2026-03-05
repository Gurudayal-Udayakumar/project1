import "../styles/Policy.css";

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <h1>Privacy Policy</h1>
      <p>
        At KidsStore, we respect your privacy and handle personal information responsibly.
        This policy explains what data we collect, why we collect it, and how we protect it.
      </p>

      <h3>1. Information We Collect</h3>
      <ul>
        <li>Account details such as name and email address.</li>
        <li>Authentication details including JWT session tokens.</li>
        <li>Google OAuth profile data (name, email, and Google account identifier) when you sign in with Google.</li>
        <li>Order, cart, and customer support communication data necessary to fulfill purchases and provide support.</li>
      </ul>

      <h3>2. How We Use Your Data</h3>
      <ul>
        <li>To create and maintain your account.</li>
        <li>To authenticate users and secure sessions with JWT-based authorization.</li>
        <li>To process orders, coordinate delivery, and provide post-purchase support.</li>
        <li>To respond to inquiries and improve service quality.</li>
      </ul>

      <h3>3. Google OAuth and Authentication</h3>
      <p>
        If you choose Google sign-in, we use Google OAuth to verify identity and create or access your account securely.
        We do not access your Google password.
      </p>

      <h3>4. Data Sharing and Sale of Data</h3>
      <p>
        We do not sell your personal data. Information is shared only with trusted service providers required to operate the store,
        such as payment, hosting, and communication infrastructure.
      </p>

      <h3>5. Hosting and Storage</h3>
      <p>
        Our application services are hosted on Render and data is stored in MongoDB Atlas with standard access controls and encryption
        practices provided by these platforms.
      </p>

      <h3>6. Contact</h3>
      <p>
        For privacy requests or questions, contact us at
        <a href="mailto:privacy@kidsstore.com"> privacy@kidsstore.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
