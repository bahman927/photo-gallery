// utils/auth.js
export async function refreshToken() {
  const refresh = localStorage.getItem("refresh_Token");

  if (!refresh) {
    console.error("No refresh token found");
    return null;
  }

  try {
    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token");
      return null;
    }

    const data = await response.json();

    // Save new tokens (rotation enabled → refresh will also update)
    if (data.access) {
      localStorage.setItem("access_Token", data.access);
    }
    if (data.refresh) {
      localStorage.setItem("refresh_Token", data.refresh);
    }

    return data.access;
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
}
