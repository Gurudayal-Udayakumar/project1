import axios from "axios";
import { API_BASE_URL } from "../config/env";

const API_BASE =
  API_BASE_URL;

export const getOffers = async () => {
  const res = await axios.get(`${API_BASE}/api/offers`);
  return res.data;
};
