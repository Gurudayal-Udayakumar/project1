import { useState } from "react"
import axios from "axios"
import "../styles/TrackOrder.css"
import { API_BASE_URL } from "../config/env";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState(null)

  const trackOrder = async () => {
    try {
      const res = await axios.get(
       `${API_BASE_URL}/api/orders/track/${orderId}`
      )
      setOrder(res.data)
    } catch {
      alert("Order not found")
    }
  }

  return (
    <div className="track-order">
      <h2>📦 Track Your Order</h2>

      <input
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <button onClick={trackOrder}>Track</button>

      {order && (
        <div className="status-box">
          <p><b>Status:</b> {order.orderStatus}</p>
          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Ordered On:</b> {new Date(order.createdAt).toDateString()}</p>
        </div>
      )}
    </div>
  )
}

export default TrackOrder