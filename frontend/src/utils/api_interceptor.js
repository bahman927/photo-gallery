// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Attach access token before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  // console.log("🔹 Interceptor fired for:", config.method, config.url);
  if (token) {
    // console.log("🔹 Attaching token:", token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("⚠️ No token found in localStorage");
  }
  return config;
});

// Handle expired tokens automatically
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken }
        );

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/"; // redirect to login
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
