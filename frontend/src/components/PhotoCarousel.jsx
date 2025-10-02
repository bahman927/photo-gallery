import React, { useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "../style.css"; // Optional CSS file for additional styling

const PhotoCarousel = () => {
  const slideRef = useRef();

  const handleNext = () => {
    const items = slideRef.current.querySelectorAll(".item");
    slideRef.current.appendChild(items[0]); // Move the first item to the end
  };

  const handlePrev = () => {
    const items = slideRef.current.querySelectorAll(".item");
    slideRef.current.prepend(items[items.length - 1]); // Move the last item to the start
  };

  return (
    // <div className="container">
    <div className="carousel">
      <div className="slide" ref={slideRef}>
      
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img1.JPG')",
          }}
        >
        </div>
        
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img2.JPG')",
          }}
        ></div>
        
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img3.JPG')",
          }}
        ></div>
        
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img4.JPG')",
          }}
        ></div>
        
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img5.JPG')",
          }}
        ></div>
        
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img6.JPG')",
          }}
        ></div>
      
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img8.JPG')",
          }}
        ></div>
    
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img9.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img10.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img11.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img12.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img13.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img14.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img15.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img16.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img17.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img18.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img19.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img20.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img21.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img22.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img23.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img24.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img25.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img26.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img27.JPG')",
          }}
        ></div>
        <div
          className="item"
          style={{
            backgroundImage: "url('Hana-img28.JPG')",
          }}
        ></div>
        
      </div>

      <div className="button">
        <button className="prev" onClick={handlePrev}>prev
          {/* <i className="fa-solid fa-arrow-left"></i> */}
        </button>
        <button className="next" onClick={handleNext}>next
          {/* <i className="fa-solid fa-arrow-right"></i> */}
        </button>
      </div>
    </div>
  );
};

export default PhotoCarousel;
