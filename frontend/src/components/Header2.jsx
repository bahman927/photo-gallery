import React, { useRef, useState, useEffect } from "react";
import { useCategory } from "../context/CategoryContext";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Header() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const aboutMeRef = useRef(null);
  const manageModalRef = useRef(null);

  const username = localStorage.getItem("username");
  const isLoggedIn = !!username;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const { category, setCategory, photos, setPhotos } = useCategory();
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger

  // ---------------- Handlers ----------------
  const handleInsertPhoto = () => fileInputRef.current.click();
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title || !category) return alert("Please fill all fields");
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
      setCategory("");
      setIsUploadOpen(false);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_Token");
    localStorage.removeItem("refresh_Token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const toggleAbout = () => setIsAboutOpen(!isAboutOpen);
  const toggleManage = () => setIsManageOpen(!isManageOpen);
  const toggleUpload = () => setIsUploadOpen(!isUploadOpen);

  // ---------------- Close modal on outside click ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        aboutMeRef.current &&
        !aboutMeRef.current.contains(event.target)
      ) setIsAboutOpen(false);

      if (
        manageModalRef.current &&
        !manageModalRef.current.contains(event.target)
      ) setIsManageOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="px-4 py-3 text-white bg-gray-800">
      {/* Top bar: logo + hamburger + desktop menu */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        {/* Logo */}
        <div className="text-2xl font-bold">Hannah PhotoGallery</div>

        {/* Category dropdown */}
        <select
          className="w-full px-2 py-1 text-black rounded md:w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Portrait">Portrait</option>
          <option value="Family">Family</option>
          <option value="Nature">Nature</option>
          <option value="Skyscraper">Skyscraper</option>
          <option value="People">People</option>
        </select>

        {/* Desktop menu */}
        <nav className="items-center hidden gap-4 md:flex">
          <button
            className="px-3 py-1 bg-blue-600 rounded"
            onClick={toggleManage}
          >
            Manage Photos
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded"
            onClick={toggleUpload}
          >
            <i className="fas fa-cloud-upload-alt"></i> Upload
          </button>
          <button
            className="px-3 py-1 bg-gray-600 rounded"
            onClick={toggleAbout}
          >
            About Me
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="self-end text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="flex flex-col gap-2 mt-2 md:hidden">
            <button
              className="px-3 py-1 bg-blue-600 rounded"
              onClick={toggleManage}
            >
              Manage Photos
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded"
              onClick={toggleUpload}
            >
              <i className="fas fa-cloud-upload-alt"></i> Upload
            </button>
            <button
              className="px-3 py-1 bg-gray-600 rounded"
              onClick={toggleAbout}
            >
              About Me
            </button>
          </nav>
        )}
      </div>

      {/* Login / Logout */}
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        {username ? (
          <>
            <span className="font-bold text-blue-400">Welcome, {username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="font-bold hover:text-gray-400">
            Login
          </Link>
        )}
      </div>

      {/* About Me Modal */}
      {isAboutOpen && (
        <div className="absolute z-50 p-4 bg-white rounded shadow top-16 right-4 w-80">
          <h3 className="mb-2 text-lg font-bold">About Me</h3>
          <p>Hello! I'm a passionate developer with React & JS expertise.</p>
          <p>When I'm not coding, I hike, read, or cook new recipes.</p>
          <button
            className="px-3 py-1 mt-2 text-white bg-gray-500 rounded"
            onClick={toggleAbout}
          >
            Close
          </button>
        </div>
      )}

      {/* Manage Photos & Upload modals can be added similarly */}
    </header>
  );
}
