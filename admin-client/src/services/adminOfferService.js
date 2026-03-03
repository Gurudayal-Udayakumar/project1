import axios from "axios";
import { API_BASE_URL } from "../config/env";

const API_BASE =
  API_BASE_URL;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

export const getAdminOffers = async () => {
  const res = await axios.get(`${API_BASE}/api/offers/admin`, {
    headers: authHeader(),
  });
  return res.data.offers;
};

export const createOffer = async (data) => {
  const res = await axios.post(`${API_BASE}/api/offers`, data, {
    headers: authHeader(),
  });
  return res.data;
};

export const updateOffer = async (id, data) => {
  const res = await axios.put(`${API_BASE}/api/offers/${id}`, data, {
    headers: authHeader(),
  });
  return res.data;
};

export const deleteOffer = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/offers/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};
