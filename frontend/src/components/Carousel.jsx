import React, { useRef, useContext, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "../style.css"; 
import { CategoryContext }  from "../context/CategoryContext"; 

const PhotoCarousel = () => {
   const { photos } = useContext(CategoryContext)
  const [mainPhoto, setMainPhoto] = useState(
    photos && photos.length > 0 ? photos[0] : null
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();

  // const handleNext = () => {
  //   const items = slideRef.current.querySelectorAll(".item");
  //   if (items.length > 0) slideRef.current.appendChild(items[0]); // move first to end
  // };

  const handleNext = () => {
  if (!photos || photos.length === 0) return;

     setCurrentIndex((prevIndex) => {
       const newIndex = (prevIndex + 1) % photos.length;

    // console.log("Next photo is:", photos[newIndex].image);

    return newIndex;  // <--- this updates currentIndex
  });
};

  // const handlePrev = () => {
  //   const items = slideRef.current.querySelectorAll(".item");
  //   if (items.length > 0) slideRef.current.prepend(items[items.length - 1]); // move last to start
  // };
  const handlePrev = () => {
  if (!photos || photos.length === 0) return;

      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex - 1 + photos.length) % photos.length;

    // console.log("Prev Photo:", photos[newIndex].image);

    return newIndex;
  });
};
 

  const currentPhoto =
    Array.isArray(photos) && photos.length > 0
      ? photos[Math.min(currentIndex, photos.length - 1)]
      : null;

 return (
 <div  className="gallery">
      {/* Main Display */}
   <div className="main-display">
      {photos.length > 0 && (
        <img
          src={currentPhoto.image}  
          alt="Selected"
          className="main-image"
        />
      )}
    {!currentPhoto && <p>No photo available</p>}
  </div>

      {/* Thumbnails */}
  <div className="slide" 
       ref={slideRef} 
       style={{ display: "flex", 
       justifyContent:"center",
      //  marginTop:   "1px",   gap: "5px",   }}>
       marginTop:   "1px", 
       gap: "5px",   }}>
       {Array.isArray(photos) &&
          photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`item ${index === currentIndex ? "active" : ""}`}
              style={{
                width: "120px",
                height: "80px",
                margin: "5px",
                borderRadius: "6px",
                backgroundImage: `url(${photo.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                border:
                  index === currentIndex
                    ? "3px solid #007bff"
                    : "2px solid #ccc",
              }}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
  </div>
  {/* buttons  */}
  <div className="nav-buttons">
        <button className="prev" onClick={handlePrev}>
          Prev
        </button>
        <button className="next" onClick={handleNext}>
          Next
        </button>
  </div>
</div>
);
}
export default PhotoCarousel;

   
