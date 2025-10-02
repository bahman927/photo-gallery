import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorMessage({ message, duration = 5000, redirectTo = null }) {
 const [visible, setVisible] = useState(true);
 const navigate = useNavigate();
 
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  },  [message, duration, redirectTo, navigate]);

  if (!visible || !message) return null;

  return (
    <div className="mt-4 text-center">
      <div className="inline-block px-6 py-3 bg-red-100 text-red-700 rounded-lg shadow-md transition-opacity duration-700">
        {message}
      </div>
    </div>
  );
}
