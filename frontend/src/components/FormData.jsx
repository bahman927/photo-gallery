import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormData = ({ onSuccess }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    category: "",
    title: "",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormValues((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formValues.name);
    data.append("category", formValues.category);
    data.append("title", formValues.title);
    data.append("image", formValues.image);

    // uploaded_at can be auto-added by Django model
    data.append("uploaded_at", new Date().toISOString());

    try {
      const token = localStorage.getItem("access_Token");

      const response = await fetch("http://127.0.0.1:8000/photos/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      if (onSuccess) onSuccess();
      navigate("/"); // back to Home
    } catch (err) {
      console.error(err);
      alert("Error uploading photo");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-blue-200 border border-gray-400 rounded-lg shadow-md"
    >
      <h2 className="mb-2 text-xl font-bold">Upload New Photo</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formValues.name}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formValues.category}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formValues.title}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default FormData;
