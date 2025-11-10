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
<div className="relative flex justify-center mt-0 w-full">

  {/* For mobile (iPhone) — grid layout */}
  <div className="grid grid-cols-3 gap-3 sm:hidden w-full px-2">
    {photos.map((photo, index) => (
      <div
        key={photo.id}
        onClick={() => setCurrentIndex(index)}
        className="photo-card h-[70px] w-[90px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
      >
        <img
          src={photo.image}
          alt={photo.title || 'Photo'}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>

  {/* For tablet/desktop — horizontal carousel */}
  <div className="hidden sm:block w-full overflow-x-hidden">
    <div
      className={`inline-flex whitespace-nowrap items-center gap-4 pr-2 ${
        typeof window !== 'undefined' && window.innerWidth > 768
          ? 'animate-scroll-left'
          : ''
      }`}
    >
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          onClick={() => setCurrentIndex(index)}
          className="photo-card inline-flex h-[100px] w-[120px] rounded-md overflow-hidden transition-transform duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer"
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
  

 

</div>

);

 
};

export default PhotoCarousel;




//       {/* Carousel Thumbnails */}
// {/* <div className="relative flex justify-center mt-0">
//   {/* This is your visible frame — 2/3 width of page */}
//   {/* <div className="min-w-fit max-w-lvw overflow-hidden scrollbar-hide"> */}
//   <div className="scroll-container w-full overflow-x-auto scrolling-touch scrollbar-hide">
  
    
    
//     {/* This is the animated strip of photos */}
//     {/* <div className=" group inline-flex whitespace-nowrap  items-center gap-4 pr-2 animate-scroll-left "> */}
//      <div className={`group inline-flex whitespace-nowrap items-center gap-4 pr-2 ${
//       // Only animate on non-touch devices or larger screens
//       typeof window !== 'undefined' && window.innerWidth > 768 
//           ?  'animate-scroll-left' 
//         : ''
//     }`}>
//       {photos.map((photo, index) => (
//         <div
//           key={photo.id}
//           onClick={() => setCurrentIndex(index)}
//           className="photo-card inline-flex h-[80px] w-[100px]  md:h-[100px] md:w-[120px]  rounded-md overflow-hidden transition-transform duration-300  hover:scale-110 hover:shadow-2xl cursor-pointer  "
//         >
//           <img
//             src={photo.image}
//             alt={photo.title || 'Photo'}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       ))}
//     </div>
    
//   </div>
// </div> */}