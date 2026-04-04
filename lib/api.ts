import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://autopilotai-api.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("autopilot_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
