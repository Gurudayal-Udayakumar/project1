const rawApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (rawApiUrl || "").replace(/\/$/, "");

if (!API_BASE_URL) {
  throw new Error("Missing API base URL. Set VITE_API_URL.");
}
