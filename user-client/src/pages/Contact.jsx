import { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";
import { API_BASE_URL } from "../config/env";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await axios.post(`${API_BASE_URL}/api/contact`, form);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
}

