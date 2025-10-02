import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      console.log("Login successful:", data);

      // Store tokens in localStorage
      localStorage.setItem("access_Token", data.access);
      localStorage.setItem("refresh_Token", data.refresh);
      localStorage.setItem("username", username);
      
      setError("");
      window.location.href = "/"; // redirect to home
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
   <div className="flex flex-col items-center justify-center h-screen bg-gray-100 "> 
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleLogin} className="mb-6 font-bold rounded-lg shadow-lg text-centerbg-white " >
      
        {error && <p className="text-red-500">{error}</p>}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ height: "35px" }}
         className="w-full px-4 mt-2 border rounded h-14"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ height: "35px" }}
           className="w-full px-4 mt-2 border rounded "
        />
        <button
          type="submit"
          style={{ height: "30px" }}
          className="w-full p-2 mt-2 text-white rounded bg-2-blue-500 hover:bg-blue-600"
        >
          Submit
        </button>
        
      </form>
    </div>
  );
}
