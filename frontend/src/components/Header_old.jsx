
import React, { useRef, useState, useEffect, useContext } from "react";
import { useCategory } from "../context/CategoryContext";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../utils/api";  // adjust path
import "../style.css"

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const aboutMeRef = useRef(null);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const {category, setCategory, photos, setPhotos} = useCategory();
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Step 1: Open file picker
  const handleInsertPhoto = () => {
    fileInputRef.current.click();  
   };

  // Step 2: Store selected file and show form
  const handleFileChange = async  (e) => {
    const file = e.target.files[0];
    console.log('file:', file)
    if (file) {
      setSelectedFile(file);
      setShowForm(true); // 👈 show the modal form after selecting a file
    } else {
      return
    }
      // await handleUpload(file);
  };

  // Step 3: Submit form (send to backend)
  const handleUpload = async (e) => {
     e.preventDefault();
    if (!selectedFile) return;
    
    if (!title || !category) {
    alert("Please enter title and category before uploading");
    return;
    }
     
   try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", "Uploaded from frontend");
      formData.append("name", username);
      formData.append("category_id", category); // ✅ use selected category
      formData.append("image", selectedFile);
      setShowForm(false)
      setUploading(true);

      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
    //  }

      const response = await apiRequest("/photos/", {
        method: "POST",
        body: formData,
      });
      
      console.log("Uploaded:", response);
      alert("Photo uploaded successfully!");
      setShowForm(false);
      setSelectedFile(null);
      setTitle("");
      setCategory("");
    } catch (err) {
      // console.error("Upload failed", err);
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

  const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };
  
    // Close modal when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target) && 
            aboutMeRef.current && !aboutMeRef.current.contains(event.target)) {
          setIsModalOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  return (
  <header className="flex items-center justify-between px-6 py-4 text-white bg-gray-800 shadow-md">
    <div className="mr-64 text-2xl font-bold">Hannah PhotoGallery</div>
    <div>
  <label htmlFor="category" className="mr-2 font-bold">
    Category:
  </label>
  <select
    id="category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="px-2 py-1 text-black rounded"
  >
    <option value="">Select Category</option>
    <option value="1">Portrait</option>
    <option value="2">Family</option>
    <option value="3">Nature</option>
    <option value="4">SkyScraper</option>
  </select>
</div>

<div className="flex items-center gap-8">
  {username && (
    <div>
      <button
        onClick={handleInsertPhoto}
        className="px-4 py-4 pt-20 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>

      <input
        type="file"
        id="file-name"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  )}

  <div style={styles.menuItem}>
    <button
      style={{
        ...styles.menuButton,
        ...(showForm ? styles.activeButton : {}),
      }}
      onClick={() => setShowForm(!showForm)}
    >
      Delete Photo
    </button>

    {showForm && (
      <div
        style={{
          ...styles.modal,
          ...(showForm ? styles.modalOpen : styles.modalClosed),
        }}
      >
        <div style={styles.modalContent}>
          <h3 style={styles.modalTitle}>Manage Photos</h3>

          {/* Photo list */}
          <div className="space-y-3">
            {photos.length === 0 ? (
              <p className="text-gray-600">No photos available.</p>
            ) : (
              photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  {/* Thumbnail */}
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="object-cover w-16 h-16 mr-4 rounded"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h4 className="font-semibold">{photo.title}</h4>
                    <p className="text-sm text-gray-600">
                      {photo.category?.name}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Close button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  <div>
      <nav style={styles.nav}>
          
          <div style={styles.menuItem} ref={aboutMeRef}>
            <button 
              style={{
                ...styles.menuButton,
                ...(isModalOpen ? styles.activeButton : {})
              }} 
              onClick={toggleModal}
            >
              About Me
            </button>
            {/* Modal */}
            <div
              style={{
                ...styles.modal,
                ...(isModalOpen ? styles.modalOpen : styles.modalClosed)
              }}
              ref={modalRef}
            >
              <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>About Me</h3>
                <p style={styles.modalText}>
                  Hello! I'm a passionate developer with expertise in React, 
                  JavaScript, and modern web technologies. I love creating 
                  intuitive user interfaces and solving complex problems.
                </p>
                <p style={styles.modalText}>
                  When I'm not coding, you can find me hiking, reading, or 
                  experimenting with new recipes in the kitchen.
                </p>
                <button style={styles.closeButton} onClick={toggleModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        
      </nav>
 </div>
 <div>
    {username ? (
        <>
          <span className="font-bold text-blue-400">Welcome, {username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
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
     
</header>

  );
}
const styles = {
   
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  menu: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '1rem',
  },
  menuItem: {
    position: 'relative',
  },
  menuButton: {
    backgroundColor: 'white',
    color: 'black',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  activeButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  modal: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '300px',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    zIndex: 1001,
    transition: 'all 0.3s ease',
  },
  modalOpen: {
    opacity: 1,
    transform: 'translateY(10px)',
    visibility: 'visible',
  },
  modalClosed: {
    opacity: 0,
    transform: 'translateY(-20px)',
    visibility: 'hidden',
  },
  modalContent: {
    padding: '1.5rem',
  },
  modalTitle: {
    fontWeight: 'bold',   
    fontSize: '1.25rem',  
    marginTop: 0,
    marginBottom: '1rem',
    color: '#2c3e50',
  },
  modalText: {
    color: '#34495e',
    lineHeight: 1.5,
    marginBottom: '1rem',
  },
  closeButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};



//  {showForm && (
//         <div className="fixed inset-0 flex justify-center bg-black bg-opacity-50">
//         <div className="p-6 bg-white shadow-xl rounded-t-xl">
       
//         <form
//             onSubmit={handleUpload}
//             className="p-6 bg-white rounded-lg shadow-lg w-96"
//         >
//           <h2 className="mb-4 text-xl font-bold text-gray-800">
//             Upload Photo
//           </h2>

//           <p className="mb-2 text-gray-700">
//             File: <strong>{selectedFile?.name}</strong>
//           </p>

//           <input
//             type="text"
//             id="photo-title"
//             name="title"
//             placeholder="Enter title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-3 py-2 mb-3 border rounded"
//           />

//         <select
//           id="category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="px-2 py-1 text-black rounded"
//         >
//           <option value="">Select Category</option>
//           <option value="1">Portrait</option>
//           <option value="2">Family</option>
//           <option value="3">Work</option>
//          </select>
  

//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={() => setShowForm(false)}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
//             >
//               Upload
//             </button>
//           </div>
// )}


 