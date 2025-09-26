import axios from "axios";
import { createRef } from "react";

export const toastRef = createRef(); // set by ToastProvider

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || "Network error";
    toastRef.current?.push?.(`Error: ${msg}`, "error");
    return Promise.reject(err);
  }
);

export default api;
