import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const lang = localStorage.getItem("i18nextLng") || "en";
  const url = new URL(config.url, config.baseURL);
  url.searchParams.set("lang", lang);
  config.url = url.pathname + url.search;
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-change"));
    }
    return Promise.reject(err);
  }
);

export default api;
