import React, { useRef, useContext, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "../style.css"; 
import { CategoryContext }  from "../context//CategoryContext"; 

const PhotoCarousel = () => {
  const slideRef = useRef();
  const { photos } = useContext(CategoryContext); // get photos from context

  const handleNext = () => {
    const items = slideRef.current.querySelectorAll(".item");
    if (items.length > 0) slideRef.current.appendChild(items[0]); // move first to end
  };

  const handlePrev = () => {
    const items = slideRef.current.querySelectorAll(".item");
    if (items.length > 0) slideRef.current.prepend(items[items.length - 1]); // move last to start
  };

  const [mainPhoto, setMainPhoto] = useState(
    photos && photos.length > 0 ? photos[0] : null
  );

  if (!photos || photos.length === 0) {
    return <div>No photos available.</div>;
  }

   


  return (
    <div className="carousel"> 
      <div className="slide" ref={slideRef}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="item"
            style={{
              backgroundImage: `url(${photo.image})`, // use image URL from context
            }}
          ></div>
        ))}
      </div>

      <div className="button">
        <button className="prev" onClick={handlePrev}>
          Prev
        </button>
        <button className="next" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PhotoCarousel;

   
