import React from 'react'
const FullScreenPhoto = ({ photo, onClose }) => {
    if (!photo) return null;
  
    return (
      <div
        className="relative flex justify-center flex-grow w-full item-center -z-1 bg-opacity-70 "
        onClick={onClose}
      >
        <img src={photo} alt="" className="object-contain w-3/4 mt-0 h-3/4" />
      </div>
    );
  };
  
  export default FullScreenPhoto;
  