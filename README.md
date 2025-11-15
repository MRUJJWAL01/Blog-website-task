# 📝 Full-Stack Blog Application  
A complete MERN-based Blog Platform with Authentication, Image Uploads, CRUD Posts, and User Profiles.

This project contains:
- **Backend (Node.js + Express + MongoDB)**
- **Frontend (React + Vite + Tailwind v4+)**
- **Image Uploads using ImageKit**
- **JWT Auth via HTTP-only Cookies**

---

## 🚀 Features

### 🔐 Authentication
- Register user
- Login user
- Logout user
- Secure Password Hashing (bcrypt)
- JWT Auth stored in **HTTP-only cookies**
- Get Profile (protected)
- Update Profile

### 📝 Blog Posts (CRUD)
- Create Post (with image)
- Update Post (with image replace + delete old image)
- Delete Post
- Get All Posts with:
  - Pagination
  - Search by title/username
- Get Single Post (via ID or slug)
- Access control: Only owner can edit/delete

### 🖼 Image Upload
- Separate uploads folder? ❌
- Uses **ImageKit** for:
  - Uploading images
  - Generating optimized URLs
  - Deleting old images on update/delete  
- Supports multipart/form-data

### 🖥 Frontend (React)
- Tailwind v4+ (latest)
- React Router pages:
  - Home Feed  
  - Post Detail  
  - Create Post  
  - Edit Post  
  - Login / Register  
  - Profile (My Posts)  
- Axios instance with credentials
- Clean UI components

---

## 📁 Project Structure

