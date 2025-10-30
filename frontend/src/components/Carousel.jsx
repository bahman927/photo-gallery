import React, { useContext, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../style.css"; // Your Tailwind + custom styles
import { CategoryContext } from "../context/CategoryContext";

const PhotoCarousel = () => {
  const { photos } = useContext(CategoryContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!photos || photos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-gray-600">
        Loading photos... takes a few seconds
      </div>
    );
  }
    const currentPhoto = photos[currentIndex];
   return (
  
    <div className="flex flex-col items-center justify-center rounded-xl shadow-lg border border-gray-200 bg-white p-2">

      {/* Main Photo */}
      <div className="relative w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-3/4 2xl:w-2/3 max-w-5xl aspect-[4/3] mb-6">
        <img
          src={currentPhoto.image}
          alt={currentPhoto.title || "Photo"}
          className="w-full h-full object-cover rounded-xl shadow-xl"
        />
      </div>

      {/* Carousel Thumbnails */}
<div className="relative flex justify-center mt-0">
  {/* This is your visible frame — 2/3 width of page */}
  <div className="w-3/5 overflow-hidden scrollbar-hide">
  
    
    
    {/* This is the animated strip of photos */}
    <div className="group inline-flex whitespace-nowrap  items-center gap-4 pr-2 animate-scroll-left ">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          onClick={() => setCurrentIndex(index)}
          // className="photo-card flex items-center justify-center h-[100px] w-[150px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer"
          className="photo-card inline-block h-[100px] w-[150px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer"
        >
          <img
            src={photo.image}
            alt={photo.title || 'Photo'}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
</div>


      {/* Carousel Thumbnails */}
      {/* <div className="group flex items-center gap-4  pr-2  animate-scroll-left motion-safe:animate-fade-in-up  ">
        <div className="flex gap-4 w-2/3 overflow-hidden">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className="photo-card flex items-center justify-center h-[100px] w-[150px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer"
            >
              <img
                src={photo.image}
                alt={photo.title || 'Photo'}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>

);

 
};

export default PhotoCarousel;




 