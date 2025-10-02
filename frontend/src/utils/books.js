// books.js
import api from "../utils/api";   // use your interceptor-enabled axios instance
const API_URL = "http://localhost:8000/api";
// CREATE BOOK
export const createBook = async (bookData) => {
  try {
    // Ensure published_date is in YYYY-MM-DD format
    const formattedDate = new Date(bookData.published_date)
      .toISOString()
      .slice(0, 10);

    const payload = {
      ...bookData,
      published_date: formattedDate,
    };

    const response = await api.post("books/create/", payload); // token auto-injected
    return response.data;
  } catch (error) {
    console.error("Error creating book:", error.response?.data || error.message);
    throw error;
  }
};

// GET BOOKS
export const getBooks = async () => {
  try {
    const response = await api.get(`books/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.response?.data || error.message);
    throw error;
  }
};

// DELETE BOOK
export const deleteBook = async (id) => {
  try {
    await api.delete(`books/${id}/delete/`);
    return true;
  } catch (error) {
    console.error("Error deleting book:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch single book by ID
export const getBookById = async (id) => {
  const response = await api.get(`books/${id}/`);
  return response.data;
};

// UPDATE BOOK
export const updateBook1 = async (id, bookData) => {
  try {
    // const formattedDate = new Date(bookData.published_date)
    //   .toISOString()
    //   .slice(0, 10);

    // const payload = {
    //   bookData,
    // };
    console.log("📡 Sending update request with payload:", bookData);
    const response = await api.put(`books/${id}/update/`, bookData);
    console.log("response.data = ", response.data)
    return response.data;
  } catch (error) {
    console.error("Error updating book:", error.response?.data || error.message);
    throw error;
  }
};
