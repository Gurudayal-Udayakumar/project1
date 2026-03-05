import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/env";

/*
  ✅ Admin socket
  ✅ Uses adminToken
  ✅ No auto-connect
  ✅ Safe logout handling
*/
const adminSocket = io(API_BASE_URL, {
  autoConnect: false, // 🔴 IMPORTANT
  transports: ["websocket", "polling"],
  withCredentials: true,
});

/* =========================
   CONNECT SOCKET (AFTER ADMIN LOGIN)
========================= */
export const connectAdminSocket = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) return;

  adminSocket.auth = { token };
  adminSocket.connect();
};

/* =========================
   DISCONNECT SOCKET (ON ADMIN LOGOUT)
========================= */
export const disconnectAdminSocket = () => {
  if (adminSocket.connected) {
    adminSocket.disconnect();
  }
};

/* =========================
   ERROR HANDLING
========================= */
adminSocket.on("connect_error", (err) => {

  if (err.message === "Authentication failed") {
    disconnectAdminSocket();
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }
});

export default adminSocket;
