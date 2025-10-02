// utils/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Refresh token helper
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_Token");
  if (!refreshToken) throw new Error("No refresh token found");

  try {
    const res = await axios.post(`${BASE_URL}/token/refresh/`, {
      refresh: refreshToken,
    });

    const data = res.data;
    localStorage.setItem("access_Token", data.access);
    return data.access;
  } catch (err) {
    localStorage.removeItem("access_Token");
    localStorage.removeItem("refresh_Token");
    localStorage.removeItem("username");
    throw new Error("Session expired. Please log in again.");
  }
}

// Generic API request
export async function apiRequest(endpoint, options = {}) {
  let token = localStorage.getItem("access_Token");
  const isFormData = options.body instanceof FormData;

  console.log('options:', options, "options.headers :", options.headers)
  let headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
     ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  try {
    const response = await axios({
      method: options.method || "GET",
      url: `${BASE_URL}${endpoint}`,
      data: options.body,
      headers,
    });

    return response.data;
  } catch (error) {
    // If unauthorized → try refresh
    if (error.response?.status === 401) {
      try {
        token = await refreshAccessToken();
        headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        };

        const retryResponse = await axios({
          method: options.method || "GET",
          url: `${BASE_URL}${endpoint}`,
          data: options.body,
          headers,
        });

        return retryResponse.data;
      } catch (err) {
        throw new Error("Unauthorized: please log in again.");
      }
    }

    console.error("Request failed:", error.response?.data || error.message);
    throw error;
  }
}

export async function getPhotos() {
  try {
    const url = `${BASE_URL}/photos/`;
    const response = await axios.get(url);
   // console.log("response : ", response)
    return response.data;
  } catch (error) {
    console.error("Failed to fetch photos:", error.response?.data || error.message);
    throw error;
  }
}