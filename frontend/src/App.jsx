import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import Header from "./components/Header";
import Header2 from "./components/Header2";
import Footer from "./components/Footer";
import Login  from "./pages/Login";
import AboutMe  from "./pages/AboutMe";
 // import PhotoCarousel_new from "./components/PhotoCarousel_new";
 import Carousel from "./components/Carousel";

const App = () => {
    
  return (
    <Router>
     <CategoryProvider>
      <div className="flex flex-col h-screen">
        <Header /> 
        <div className="relative flex-grow h-full bg-gray-200">
          <Routes>
            <Route path="/"     element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Carousel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutMe />} /> 
          </Routes>
        </div>
        <Footer /> 
      </div>
     </CategoryProvider>
    </Router>
  );
};

export default App;










 


 