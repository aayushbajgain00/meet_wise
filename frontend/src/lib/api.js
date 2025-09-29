import axios from "axios";
import { createRef } from "react";

export const toastRef = createRef(); // set by ToastProvider

// const api = axios.create({
//   baseURL: "http://localhost:3000",
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const msg = err?.response?.data?.message || err.message || "Network error";
//     toastRef.current?.push?.(`Error: ${msg}`, "error");
//     return Promise.reject(err);
//   }
// );

// src/lib/api.js


const api = axios.create({
<<<<<<< Updated upstream
  baseURL: "http://localhost:5000",
=======
  baseURL: (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, ""),
>>>>>>> Stashed changes
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


