import axios from "axios";
import { API_BASE_URL } from "../config/env";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

/* ==========================
   REQUEST INTERCEPTOR
========================== */
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("adminToken"); // ✅ FIXED

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

/* ==========================
   RESPONSE INTERCEPTOR
========================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
