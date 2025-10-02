import React, { useRef, useState, useEffect } from "react";
import { useCategory } from "../context/CategoryContext";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import "../style.css";

export default function Header() {
  
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  
  const aboutMeRef = useRef(null);
  const uploadRef = useRef(null);
  const manageModalRef = useRef(null);
  const aboutModalRef = useRef(null);

  const username = localStorage.getItem("username");
  const isLoggedIn = !!username
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const { category, setCategory, photos, setPhotos } = useCategory();

  // ---------------- Upload photo ----------------
  const handleInsertPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    if (!title || !category) {
      alert("Please enter title and category before uploading");
      return;
    }

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

      console.log("Uploaded:", response);
      alert("Photo uploaded successfully!");
      setPhotos([...photos, response.data]); // update context
      setSelectedFile(null);
      setTitle("");
      setCategory("All");
      
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      
    }
  };
// ---------------- Toggle Modal ----------------
const toggleModal = () => {
    setIsUploadOpen(!isUploadOpen);
    // Reset form when closing modal
    if (isUploadOpen) {
      setTitle('');
      setSelectedFile(null);
    }
  };

  
  
  // ---------------- Delete photo ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    console.log('photo id : ',id)
    try {
      await apiRequest(`/photos/${id}/`, { method: "DELETE" });
      setPhotos(photos.filter((p) => p.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  
//------------set handleEdit----------
const handleEdit = (photo) => {
  setEditingPhoto(photo);
  setEditTitle(photo.title);
  setEditDescription(photo.description);
  setEditCategory(photo.category?.id || "");
};

  
  // ---------------- Update photo ----------------
  const handleUpdate = async () => {
    
    const id = editingPhoto.id
    try {
      await apiRequest(`/photos/${id}/`, {
         method: "PATCH",
         body: JSON.stringify({
             title: editTitle,
             description: editDescription,
             category_id: editCategory
             }),
         headers: {
          "Content-Type": "application/json"
         }
        });
      
    setPhotos((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
      setEditingPhoto(null)
    
    } catch (err) {
      alert("update failed: " + err.message);
    }
  };

 
  // ---------------- Logout ----------------
  const handleLogout = () => {
    localStorage.removeItem("access_Token");
    localStorage.removeItem("refresh_Token");
    localStorage.removeItem("username");
    navigate("/");
  };

  // ---------------- Modal toggles ----------------
  const toggleAbout = () => setIsAboutOpen(!isAboutOpen);
   const toggleManage = () => {
    setIsManageOpen((prev) => !prev);
  };
  const toggleUpload = () => setIsUploadOpen(!isUploadOpen);

  // ---------------- Close modal on outside click ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        aboutModalRef.current &&
        !aboutModalRef.current.contains(event.target) &&
        aboutMeRef.current &&
        !aboutMeRef.current.contains(event.target)
      ) {
        setIsAboutOpen(false);
      }

      if (
        manageModalRef.current &&
        !manageModalRef.current.contains(event.target)
      ) {
        setIsManageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  return (
    <header className="flex items-center justify-between px-6 py-4 text-white bg-sky-50 shadow-md md:items-center">
   
      <div className="mr-64 text-2xl font-bold animate-wave">Hannah PhotoGallery</div> 
       
        <div>
          <label htmlFor="category" className="mr-2 font-bold text-black">
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          
            className="px-2 py-1 text-black rounded"
          >
            {/* <option value="select Category"></option> */}
            <option value="All">All</option>
            <option value="5">Outdoor</option>
            <option value="1">Portrait</option>
            <option value="2">Family</option>
            <option value="3">Nature</option>
            <option value="4">Skyscraper</option>
            <option value="6">People</option>
            
          </select>
        </div>
         <div style={{ display: "flex", gap: "10px" }}> 
         
          <div style={styles.menuItem}> 
              <button style={{ ...styles.menuButton2, ...(isManageOpen ? styles.activeButton : {}), }}
                onClick={toggleManage} >
                Manage Photos
              </button>      
         
     
        {isManageOpen && ( 
            <div ref={manageModalRef} 
                style={{ ...styles.modal, ...(isManageOpen ? styles.modalOpen : styles.modalClosed),
                width: "500px", }} >
                <div style={styles.modalContent}> 
                  <h3 style={styles.modalTitle}>Manage Photos</h3> 
                  <div style={styles.photoList}>
                  {photos.length === 0 ?
                  ( <p style={styles.noPhotosText}>No photos available.</p> ) 
                  : 
                  ( photos.map((photo) => (
                    <div key={photo.id} style={styles.photoItem} > 
                
                  {/* Fixed-size Thumbnail */} 
                  <img src={photo.image} alt={photo.title} style={styles.photoThumbnail} /> 
                  <div style={styles.photoInfo}> 
                    <h4 style={styles.photoTitle}>{photo.title}</h4>
                    <p style={styles.photoCategory}> {photo.category?.name} </p> 
                  </div> 
                  <button onClick={() => handleEdit(photo)} 
                  style={{...styles.editButton,
                   ...(isLoggedIn ? {} : { opacity: 0.3, cursor: "not-allowed" })  }}
                    disabled={!isLoggedIn}
                    >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(photo.id)}
                   style={{
                           ...styles.deleteButton,
                           ...(isLoggedIn ? {} : { opacity: 0.5, cursor: "not-allowed" })
                          }} 
                         disabled={!isLoggedIn}
                    >
                    Delete 
                  </button>
                  </div> )) )}
                </div> 
                  <div style={styles.modalActions}>
                  <button onClick={() => setIsManageOpen(false)} style={styles.closeButton} > Close 
                  </button> 
                  </div> 
                </div>
            </div> 
            )}
          </div> 
          
          {/* SECOND MODAL – Edit Photo (appears beneath first modal) */}
          {editingPhoto &&  (
            <div style={{ ...styles.modal, top: "120px", width: "400px", left: "40%", transform: "translatX(-70%", position:"absolute"}}>
              <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>Edit Photo</h3>

                <form
                  onSubmit={handleUpdate}
                  style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                >
                  <label style={styles.label}>Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={styles.input}
                  />

                  {/* <label style={styles.label}>Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={styles.textarea}
                  /> */}

                  <label style={styles.label}>Category</label>
                <div>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    style={styles.input}
                    required
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
                   

                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button type="submit" style={styles.saveButton}>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPhoto(null)}   // 👈 close 2nd modal
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )} 
          
          {/* {isLoggedIn && */}
          <button style={{ ...styles.menuButton2, ...(isUploadOpen ?    styles.activeButton2: {}),  }}
           onClick={toggleModal} > 
           <i className="fas fa-cloud-upload-alt"></i>
           Upload Photos 
          </button>
           {/* } */}
          
          <div style={{ ...styles.modalOverlay, opacity: isUploadOpen ? 1 : 0, visibility: isUploadOpen ? "visible"   : "hidden", }}
             onClick={toggleModal}>
            <div style={{...styles.modal2, transform: isUploadOpen ? 'translateY(0)' : 'translateY(30px)' }} 
              onClick={(e) => e.stopPropagation()}> 
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle2}> 
                <i className="fas fa-cloud-upload-alt"></i> 
                Upload Photo 
                </h2> 
                <button style={styles.closeButton2} onClick={toggleModal}>
                <i className="fas fa-times"></i> 
                </button>
              </div>
              <form onSubmit={handleUpload} style={styles.uploadForm}> 
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="photoTitle">
                    Photo Title 
                   </label> 
                 <input 
                   type="text" 
                   id="photoTitle"
                   placeholder="Enter a title for your photo"
                   value={title} 
                   onChange={(e) => setTitle(e.target.value)} 
                   style={styles.input} 
                   required /> 
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="photoCategory">
                    Category
                  </label>
                  <select
                    id="photoCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.input} // you can reuse input styles
                    required
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
                
                <div style={styles.formGroup}> 
                   <label style={styles.label} htmlFor="photoFile">
                     Select Photo 
                   </label>
                  <input
                    type="file"
                    id="photoFile"
                    ref={fileInputRef}
                    onChange={handleFileChange} style={{ display: 'none' }} 
                    accept="image/*"
                    required />
                  
                  <div style={styles.fileInfo}>
                      {selectedFile ?
                      `Selected: ${selectedFile.name} 
                      (${(selectedFile.size / 1024).toFixed(1)} KB)` 
                      : 'No file selected' } 
                  </div> 
                </div> 
                <div style={styles.formButtons}>
                   <button type="button" onClick={handleInsertPhoto} 
                      style={{
                          ...styles.deleteButton,
                          ...styles.chooseButton2,
                          ...(isLoggedIn ? {} : { opacity: 0.5, cursor: "not-allowed" }),
                          ...(uploading ? styles.disabledButton : {})
                        }}
                        disabled={!isLoggedIn || uploading}
                                        > 
                     <i className="fas fa-file-image"></i>
                     Choose File 
                   </button>
                   <button type="submit" 
                    style={{ ...styles.uploadButton,
                      ...(isLoggedIn ? {} : { opacity: 0.5, cursor: "not-allowed" }),        
                      ...(uploading ? styles.   disabledButton :  {}) 
                    }}
                    disabled={uploading} >
                        
                        {uploading ? (
                           <> 
                            
                        <i className="fas fa-spinner fa-spin"></i> 
                           Uploading... 
                        </> )
                        : ( <> <i className="fas fa-cloud-upload-alt"></i>
                         Upload Photo 
                          </> 
                         )}
                   </button> 
                </div>
             </form> 
            </div>
           </div>
          </div>

       
      {/* About Me button + modal */}
      <div style={styles.menuItem} ref={aboutMeRef}>
        <button
          style={{
            ...styles.menuButton2,
            ...(isAboutOpen ? styles.activeButton : {}),
          }}
          onClick={toggleAbout}
        >
          About Me
        </button>
        {isAboutOpen && (
          <div
            ref={aboutModalRef}
            style={{
              ...styles.modal,
              ...(isAboutOpen ? styles.modalOpen : styles.modalClosed),
              width: "350px",
            }}
          >
            <div style={styles.modalContent}>
              <h3 style={styles.modalTitle}>About Me</h3>
              <p style={styles.modalText}>
                Hello! I'm a passionate developer with expertise in React,
                JavaScript, and modern web technologies.
              </p>
              <p style={styles.modalText}>
                When I'm not coding, you can find me hiking, reading, or
                experimenting with new recipes in the kitchen.
              </p>
              <button
                style={styles.closeButton}
                onClick={() => setIsAboutOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        {username ? (
          <>
            <span className="font-bold text-blue-400">
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 ml-3 font-semibold text-black bg-blue-800 rounded-lg hover:bg-blue-600"
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
  )}
const styles = {
  menuItem: { 
    position: "relative",
  },
  menuButton: {
    backgroundColor: "white",
    color: "black",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    border: "none",
  },
  activeButton: {
    backgroundColor: "rgba(255,255,255,0.8)",
  },
   menuButton2: {
     padding: '.5rem .5rem',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'black',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    activeButton2: {
      backgroundColor: 'linear-gradient(45deg, #4facfe, #00f2fe)',
      boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
    },
  
  modal: {
    position: "absolute",
    top: "100%",
    right: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    overflow: "hidden",
    zIndex: 1001,
    transition: "all 0.3s ease",
    marginTop: "18px",
  },
  modalOpen: {
    opacity: 1,
    transform: "translateY(0)",
    visibility: "visible",
  },
  modalClosed: {
    opacity: 0,
    transform: "translateY(-10px)",
    visibility: "hidden",
  },
  modalContent: { 
    padding: "1.5rem",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    marginTop: 0,
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  modalText: {
    color: "#34495e",
    lineHeight: 1.5,
    marginBottom: "1rem",
  },
  photoList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxHeight: "500px",
    overflowY: "auto",
    padding: "0.25rem",
  },
  photoItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
  },
  photoThumbnail: {
    width: "48px",
    height: "48px",
    objectFit: "cover",
    borderRadius: "4px",
    flexShrink: 0,
  },
  photoInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginLeft: "0.75rem",
    minWidth: 0, // Prevents flex item from overflowing
  },
  photoTitle: {
    fontWeight: "500",
    fontSize: "0.875rem",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  photoCategory: {
    color: "#64748b",
    fontSize: "0.75rem",
    margin: 0,
  },
  deleteButton: {
    flexShrink: 0,
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
      saveButton: {
      padding: '8px 15px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    cancelButton: {
      padding: '8px 15px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
    },
  
  editButton: {
    flexShrink: 0,
    padding: "0.25rem 1rem",
    marginRight: "10px",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "#0000FF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  noPhotosText: {
    color: "#64748b",
    textAlign: "center",
    padding: "1rem",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e2e8f0",
  },
  closeButton: {
    backgroundColor: "#94a3b8",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
  },


  

    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      transition: 'all 0.3s ease',
    },
    modal2: {
      background: 'white',
      borderRadius: '15px',
      width: '90%',
      maxWidth: '500px',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      transition: 'transform 0.4s ease',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #eee',
    },
    modalTitle2: {
      fontSize: '1.5rem',
      color: '#2c3e50',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    closeButton2: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#999',
    },
    uploadForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      color: '#333',
      fontSize: '1rem',
    },
    fileInfo: {
      marginTop: '0.5rem',
      padding: '0.75rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      fontSize: '0.9rem',
      color: '#495057',
    },
    formButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    chooseButton2: {
      padding: '0.75rem 1.5rem',
      background: '#40c057',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    uploadButton: {
      padding: '0.75rem 1.5rem',
      background: '#4facfe',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    disabledButton: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  
  
};




 