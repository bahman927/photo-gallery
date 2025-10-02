// src/utils/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import { refreshToken }  from './auth'
import { getValidAccessToken } from "./tokenCheck";

const API_URL = "http://127.0.0.1:8000/api";

export const saveTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};


export const getTokens = () => ({
  access: localStorage.getItem("access_token"),
  refresh: localStorage.getItem("refresh_token"),
});


export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getUserFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null; // No token saved → Not logged in

  try {
    const decoded = jwtDecode(token); // Decode JWT payload
    const now = Date.now() / 1000;    // Current time in seconds

    if (decoded.exp < now) {
      // Token expired → remove and deny access
      localStorage.removeItem("access_token");
      return null;
    }

    // Token is valid → return user info
    return {
      username: decoded.username,
      id: decoded.user_id
    };

  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};


export async function getBooks() {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get(`${API_URL}/books/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

   if (response.status === 401) {
    console.log("Access token expired. Refreshing...");
    accessToken = await refreshToken();

    if (!accessToken) {
      throw new Error("Unable to refresh token. Please log in again.");
    }

    // Retry the request with new token
    response = await fetch("http://localhost:8000/api/books/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }


    return response.data;

  } catch (err) {
    throw err; // handle in component
  }
}


export async function createBook(bookData) {
  try {
    const accessToken = await getValidAccessToken();
    const response = await axios.post(`${API_URL}/books/`, bookData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (err) {
    throw err; // handle in component
  }
}


// Login function
export async function login(username, password) {
  try {
    const response = await axios.post(`${API_URL}/token/`, {
      username,
      password,
    });
    
    // Save tokens
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("username", username);
    console.log('response.data = ', response.data)
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { detail: "Network error" };
  }
}


// Logout function
export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
  window.location.href = "/";
}


// Register a new user
export const register = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    // Throw error so the component can handle it
    throw error;
  }
};


// Refresh access token using refresh token
// export const refreshToken = async () => {
//   const { refresh } = getTokens();
//   if (!refresh) return null;
//   try {
//     const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
//     localStorage.setItem("access_token", res.data.access);
//     return res.data.access;
//   } catch {
//     logout();
//     return null;
//   }
// };
