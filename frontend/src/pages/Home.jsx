
import React from "react";
import PhotoGallery from "../components/PhotoGallery";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Welcome to Hannah PhotoGallery
      </h1>
      <PhotoGallery />
    </div>
  );
}


// // src/pages/Home.jsx
// import React, { useState, useEffect } from "react";
//  import { useCategory } from "../context/CategoryContext";

// export default function Home() {
//   const [photos, setPhotos] = useState([]);
//   const { category } = useCategory(); // from Header dropdown

//   // Fetch photos from backend API
//   useEffect(() => {
//     const fetchPhotos = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/photos/");
//         const data = await response.json();
//         setPhotos(data);
//       } catch (error) {
//         console.error("Error fetching photos:", error);
//       }
//     };
//     fetchPhotos();
//   }, []);

//   // Filter photos by category
//   const filteredPhotos =
//     category === "All"
//       ? photos
//       : photos.filter((photo) => photo.category === category);

//   return (
//     <div className="p-6">
//       <h2 className="mb-4 text-2xl font-bold">
//         {category === "All" ? "All Photos" : `${category} Photos`}
//       </h2>
//       {filteredPhotos.length === 0 ? (
//         <p className="text-gray-500">No photos found for this category.</p>
//       ) : (
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//           {filteredPhotos.map((photo) => (
//             <div
//               key={photo.id}
//               className="overflow-hidden bg-white rounded-lg shadow-md"
//             >
//               <img
//                 src={photo.image_url} // adjust field if backend sends a different key
//                 alt={photo.title}
//                 className="object-cover w-full h-48"
//               />
//               <div className="p-2">
//                 <h3 className="text-sm font-semibold">{photo.title}</h3>
//                 <p className="text-xs text-gray-500">{photo.category}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// // import React from "react";
// // import PhotoCarousel from "../components/PhotoCarousel";

// // const Home = () => {
// //   return (
// //     <div className="w-full h-full">
// //       <PhotoCarousel />
// //     </div>
// //   );
// // };

// // export default Home;

// // import React, { useState } from "react";
// // import Header from "./Header";
// // import FormData from "../components/FormData";
// // import PhotoCarousel from "../components/PhotoCarousel";

// // const Home = () => {
// //   const [showForm, setShowForm] = useState(false);

// //   return (
// //     <div>
// //       <Header onInsertClick={() => setShowForm(true)} />

// //       {/* ✅ Normal page flow */}
// //       {showForm && (
// //         <div className="p-6 bg-blue-200 border border-gray-400 rounded shadow-md mt-6 mx-auto w-[500px]">
// //           <FormData onSuccess={() => setShowForm(false)} />
// //         </div>
// //       )}

// //       {/* Background photo carousel */}
// //       <PhotoCarousel />
// //     </div>
// //   );
// // };

// // export default Home;
