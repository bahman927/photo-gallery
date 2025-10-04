let apiUrl;

// check the environment
if (process.env.NODE_ENV === "production") {
  // in production 
  apiUrl = process.env.REACT_APP_API_URL;
} else {
  // local development
  apiUrl = "http://localhost:8000";
}

export default apiUrl;


//  process.env.NODE_ENV is automatically set to:
//     "development" when running npm start or npm run dev
//     "production" when you build (npm run build on Render)