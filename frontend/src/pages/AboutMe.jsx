import React, { useState, useRef, useEffect } from 'react';

const AboutMe = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const aboutMeRef = useRef(null);

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
  );
};

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '0.5rem 1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 1000,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
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
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
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

export default AboutMe;



// import { motion, AnimatePresence } from "framer-motion";
// import React from "react";

// export default function AboutMe({ isOpen, onClose }) {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.4 }}
//           className="absolute w-1/3 p-4 bg-white rounded-lg shadow-lg right-4 top-16"
//         >
//           <h2 className="mb-2 text-xl font-bold">About Me</h2>
//           <p className="text-gray-700">This is the About Me modal content.</p>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
//           >
//             Close
//           </button>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
