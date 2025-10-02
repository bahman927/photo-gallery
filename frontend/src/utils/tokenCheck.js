// src/utils/tokenHelper.js
import axios from "axios";
import ErrorMessage from '../components/ErrorMessage'

const API_URL = "http://localhost:8000/api"; // adjust to your backend

// Decode token to check expiry
function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  const now = Date.now() / 1000; // in seconds
  // console.log('decodec.exp =', decoded.exp, "now = ", now)
  return decoded.exp < now;
}

export async function getValidAccessToken() {
  let accessToken    = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
   console.log("accessToken=", accessToken, "refreshToken=", refreshToken)
   ;
  
  // if (!refreshToken) {
  //     throw { detail: "Token Expired, logout and login again!!" }
  //    }
  if  (isTokenExpired(accessToken)) {
    
    try {
      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken,
      });
      accessToken = response.data.access;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    } catch (err) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw { detail: "Session expired. Please login again." };
    }
  }

  return accessToken;
}
