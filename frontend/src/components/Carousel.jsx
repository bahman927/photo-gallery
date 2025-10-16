import React, { useRef, useContext, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../style.css";
import { CategoryContext } from "../context/CategoryContext";

const PhotoCarousel = () => {
  const { photos } = useContext(CategoryContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();

  if (!photos || photos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-600">
        Loading photos...
        takes few seconds
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div className="w-full flex flex-col items-center">
      {/* --- Main Display --- */}
      <div className="relative w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 aspect-video mb-4">
        <img
          src={currentPhoto.image}
          alt={currentPhoto.title || "Photo"}
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800/50 hover:bg-gray-900/70 text-white p-2 rounded-full transition"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800/50 hover:bg-gray-900/70 text-white p-2 rounded-full transition"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* --- Thumbnails --- */}
      <div
        ref={slideRef}
        className="flex flex-wrap justify-center gap-2 px-2 w-full sm:w-4/5 md:w-3/4 lg:w-2/3"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setCurrentIndex(index)}
            className={`cursor-pointer rounded-md overflow-hidden border-2 ${
              index === currentIndex
                ? "border-blue-500 scale-105"
                : "border-gray-300 hover:border-gray-400"
            } transition transform duration-200`}
          >
            <img
              src={photo.image}
              alt={photo.title || "Thumbnail"}
              className="w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-20 object-cover"
            />
          </div>
        ))}
      </div>

      {/* --- Navigation Buttons (Mobile) --- */}
      <div className="flex justify-center gap-4 mt-4 sm:hidden">
        <button
          onClick={handlePrev}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PhotoCarousel;

 