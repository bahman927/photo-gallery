import React, { useRef, useState, useEffect } from "react";
import { useCategory } from "../context/CategoryContext";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Header() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const username = localStorage.getItem("username");
  const isLoggedIn = !!username;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { category, setCategory, photos, setPhotos } = useCategory();

  // ---------------- Upload photo ----------------
  const handleInsertPhoto = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title || !category) return alert("Please fill all fields.");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", "Uploaded from frontend");
      formData.append("name", username);
      formData.append("category_id", category);
      formData.append("image", selectedFile);

      const response = await apiRequest("/photos/", {
        method: "POST",
        body: formData,
      });

      setPhotos([...photos, response.data]);
      setSelectedFile(null);
      setTitle("");
      setCategory("All");
      setIsUploadOpen(false);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ---------------- Edit Photo ----------------
  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setEditTitle(photo.title);
    setEditCategory(photo.category?.id || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiRequest(`/photos/${editingPhoto.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle, category_id: editCategory }),
        headers: { "Content-Type": "application/json" },
      });
      setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPhoto(null);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // ---------------- Delete Photo ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await apiRequest(`/photos/${id}/`, { method: "DELETE" });
      setPhotos(photos.filter((p) => p.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // ---------------- Logout ----------------
  const handleLogout = () => {
    localStorage.removeItem("access_Token");
    localStorage.removeItem("refresh_Token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <header className="bg-sky-50 shadow-md px-4 py-3 relative md:flex md:items-center md:justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold animate-wave text-black">Hannah PhotoGallery</div>

      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden mt-2 text-black"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <i className="fas fa-bars fa-lg"></i>
      </button>

      {/* Menu Items */}
      <nav
        className={`flex flex-col md:flex-row md:items-center gap-2 mt-3 md:mt-0 ${
          mobileMenuOpen ? "block" : "hidden md:flex"
        }`}
      >
        {/* Category selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="category" className="font-bold text-black">
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2 py-1 text-black rounded"
          >
            <option value="All">All</option>
            <option value="5">Outdoor</option>
            <option value="1">Portrait</option>
            <option value="2">Family</option>
            <option value="3">Nature</option>
            <option value="4">Skyscraper</option>
            <option value="6">People</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-2 md:mt-0">
          <button
            className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500 transition"
            onClick={() => setIsManageOpen(!isManageOpen)}
          >
            Manage Photos
          </button>

          <button
            className="px-3 py-1 bg-green-400 text-white rounded hover:bg-green-500 transition"
            onClick={() => setIsUploadOpen(!isUploadOpen)}
          >
            Upload Photos
          </button>

          <button
            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
            onClick={() => setIsAboutOpen(!isAboutOpen)}
          >
            About Me
          </button>

          {username ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-500">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* About Me Modal */}
      {isAboutOpen && (
        <div className="absolute top-full right-0 mt-2 w-full max-w-xs bg-white rounded shadow p-4 z-50">
          <h3 className="font-bold mb-2">About Me</h3>
          <p>Hello! I'm a passionate photographer with expertise in different environments.</p>
          <p className="mt-1">When I'm not photographing, I enjoy hiking, reading, and cooking.</p>
          <button
            className="mt-2 w-full py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setIsAboutOpen(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* Manage Photos Modal */}
      {isManageOpen && (
        <div className="absolute top-full right-0 mt-2 w-full max-w-sm bg-white rounded shadow-lg z-50 p-4 md:max-w-md">
          <h3 className="font-bold text-lg mb-3">Manage Photos</h3>
          <div className="max-h-80 overflow-y-auto flex flex-col gap-2">
            {photos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No photos available.</p>
            ) : (
              photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center justify-between bg-gray-100 rounded p-2"
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 ml-2 min-w-0">
                    <h4 className="text-gray-700 text-sm truncate">{photo.title}</h4>
                    <p className="text-gray-500 text-xs">{photo.category?.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(photo)}
                      disabled={!isLoggedIn}
                      className={`px-2 py-1 text-xs rounded ${
                        isLoggedIn
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-blue-200 text-white opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      disabled={!isLoggedIn}
                      className={`px-2 py-1 text-xs rounded ${
                        isLoggedIn
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-red-200 text-white opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setIsManageOpen(false)}
            className="mt-3 w-full py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      )}

      {/* Upload Photo Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <i className="fas fa-cloud-upload-alt"></i> Upload Photo
              </h2>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-600 hover:text-gray-800">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="photoTitle" className="font-semibold mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  id="photoTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border rounded px-3 py-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="photoCategory" className="font-semibold mb-1">
                  Category
                </label>
                <select
                  id="photoCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="border rounded px-3 py-2"
                >
                  <option value="">-- Select Category --</option>
                  <option value="3">Nature</option>
                  <option value="4">Skyscraper</option>
                  <option value="1">Portrait</option>
                  <option value="2">Family</option>
                  <option value="6">People</option>
                  <option value="5">Outdoor</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-1">Select Photo</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mb-1"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <button
                  type="submit"
                  disabled={uploading || !isLoggedIn}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
