import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/env";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/api/contact`);
    setMessages(data);
  };

  return (
    <div>
      <h2>Customer Messages</h2>

      {messages.map((msg) => (
        <div key={msg._id} className="message-card">
          <h4>{msg.subject}</h4>
          <p><b>Name:</b> {msg.name}</p>
          <p><b>Email:</b> {msg.email}</p>
          <p>{msg.message}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
