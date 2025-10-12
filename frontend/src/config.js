let apiUrl;

if (import.meta.env.PROD) {
  apiUrl = import.meta.env.VITE_API_URL || "https://photo-gallery-c9s4.onrender.com";
} else {
  apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
}

//  apiUrl =   "http://localhost:8000";

console.log("Using API URL:", apiUrl);
export default apiUrl;
