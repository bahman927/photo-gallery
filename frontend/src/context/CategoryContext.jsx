import React, { createContext, useState, useContext, useEffect } from "react";
import { getPhotos } from "../utils/api"; // centralized API call

export const CategoryContext = createContext();

export function CategoryProvider({ children }) {
   const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState("All"); // optional for filtering

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos(); 
        const filtered = (category !== "All")
        // ? data.filter((photo) => photo.category.name === category) // match by name
        ? data.filter((photo) => photo.category.id === Number(category)) // match by id
        : data; 
        setPhotos(filtered);  

        if (category && filtered.length > 0) {
          category !== 'All' ?
           setCategory(filtered[0].category.id)
           :
           setCategory(category)
        }

       // console.log("category after setCategory() : ", category)

      } catch (err) {
        console.error("Failed to fetch photos:", err.message);
      }
    };

    fetchPhotos();
  }, [category]);
  return (
    <CategoryContext.Provider value={{ photos, setPhotos, category, setCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  return useContext(CategoryContext);
}
