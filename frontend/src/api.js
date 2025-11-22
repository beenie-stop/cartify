
import axios from "axios";

const API = "http://localhost:5000";

const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage (frontend):", token); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
