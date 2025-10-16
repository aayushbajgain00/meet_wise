import axios from "axios";
import { createRef } from "react";

export const toastRef = createRef(); 

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE || "http://localhost:8000").replace(/\/$/, ""),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Global error toast
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || "Network error";
    toastRef.current?.push?.(`Error: ${msg}`, "error");
    return Promise.reject(err);
  }
);

export default api;


