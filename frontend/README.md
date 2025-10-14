# 📸 Photo Gallery App

A full-stack photo gallery web application built with **React (frontend)** and **Django (backend)**.  
Users can upload, view, and manage images in a responsive gallery interface.  
Authentication is handled with JWT tokens, and user-specific photo storage is supported.
All vistors of the website can see photos based on their categgoris. But only superuser 
can edit and upload photo.

🌐 **Live Demo:** [(https://photo-gallery-frontend-iyvv.onrender.com)]

---

## 🚀 Features

- 🧑‍💻 **User Authentication** – JWT-based login and registration.
- 🖼️ **Image Uploads** – Users can upload, view, and delete their own photos.
- 📂 **User-Specific Storage** – Each user's photos are stored securely under their profile.
- 🎨 **Responsive UI** – Built with React and Tailwind CSS for modern design.
- ⚙️ **RESTful API** – Django REST Framework backend.
- 🧾 **PostgreSQL Integration** – Used as the main database.
- 🌍 **Deployed on Render** – Both frontend (React) and backend (Django) hosted on Render.

---

## 🧰 Tech Stack

**Frontend:**
- React (Vite or CRA)
- Tailwind CSS
- JWT Authentication
- Fetch API / Axios

**Backend:**
- Django & Django REST Framework
- PostgreSQL
- Pillow (for image processing)
- CORS Headers
- AWS S3 as photos resource

---

## 🛠️ Setup Instructions (Local)

### 1️⃣ Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver