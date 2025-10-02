import React, { useState, useContext } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { apiRequest } from "../utils/api";

const EditPhotoForm = ({ photo, onClose, onUpdated }) => {
  const { categories } = useContext(CategoryContext); // ✅ assumes you already fetch categories
  const [title, setTitle] = useState(photo.title || "");
  const [description, setDescription] = useState(photo.description || "");
  const [category, setCategory] = useState(photo.category?.id || ""); // store ID

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {};
    if (title !== photo.title) updates.title = title;
    if (description !== photo.description) updates.description = description;
    if (category && category !== photo.category?.id) updates.category = category;

    try {
      const updatedPhoto = await apiRequest(`/photos/${photo.id}/`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: {
          "Content-Type": "application/json",
        },
      });

      onUpdated(updatedPhoto); // ✅ callback to refresh list
      onClose();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white shadow-lg rounded-xl w-96">
        <h2 className="mb-4 text-xl font-bold">Edit Photo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPhotoForm;
