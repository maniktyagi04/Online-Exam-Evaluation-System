# ⚡ ExamFlow — Online Exam & Evaluation System

> A full-stack, production-ready exam platform built with a strong focus on backend architecture, OOP principles, and scalable system design.

---

## 🚀 Live Demo

- 🌐 Frontend: https://online-exam-evaluation-system.vercel.app/login 
- 🔗 Backend API: https://online-exam-backend-1dc3.onrender.com 

---

## 🧠 About The Project

ExamFlow is a full-stack web application designed to simulate a real-world online examination system.

It allows administrators to create and manage exams, while students can attempt exams in a timed environment and receive automatically evaluated results.

The project emphasizes:
- Clean architecture
- Modular backend design
- Real-world system workflows
- Strong use of OOP principles

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin / Student)
- Secure password hashing (bcrypt)
- Default role = STUDENT (no public admin registration)

---

### 👨‍🏫 Admin Capabilities
- Create and manage exams
- Add MCQ & descriptive questions
- Publish / deactivate exams
- View student attempts
- Analyze performance data

---

### 🎓 Student Experience
- Register & login
- View available exams
- Start / attempt exams
- Timer-based submissions
- View results & performance

---

### 📊 Evaluation System
- Automatic evaluation for MCQs
- Modular evaluation logic (polymorphism)
- Score + percentage calculation
- Result generation and storage

---

### 📈 Analytics
- Track student attempts
- View exam-wise performance
- Monitor score distribution

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

### Frontend
- React.js
- Responsive modern UI

---

## 📐 System Architecture

The backend follows a layered architecture:

Controllers → Services → Repositories → Database

### 🔥 OOP Concepts Used
- Encapsulation → Models + logic
- Abstraction → Service layer
- Inheritance → User → Admin / Student
- Polymorphism → Question evaluation strategies

---

## 🗄️ Database Design

### Core Entities
- User
- Exam
- Question
- Option
- Attempt
- Answer
- Result

### Relationships
- One Exam → Many Questions
- One Question → Many Options
- One User → Many Attempts
- One Attempt → Many Answers
- One Attempt → One Result

---

## 🔁 API Overview

| Method | Endpoint | Description |
|--------|--------|-------------|
| POST | /auth/register | Register as student |
| POST | /auth/login | Login user |
| GET | /exam/:id | Fetch exam questions |
| POST | /exam/start | Start exam |
| POST | /exam/submit | Submit answers |
| GET | /result/:id | Get result |

---

## 💻 Frontend Overview

### Student Dashboard
- Exam list with status (Not Started / In Progress / Completed)
- Performance stats (avg score, attempts)
- Result viewing

### Admin Dashboard
- Exam creation & management
- Question management
- Analytics view

---

## ⚙️ Getting Started

### 1️⃣ Clone Repository
git clone https://github.com/maniktyagi04/Online-Exam-Evaluation-System.git 
cd Online-Exam-Evaluation-System

---

### 2️⃣ Backend Setup
cd backend  
npm install  

Create `.env` file:
DATABASE_URL=your_database_url  
JWT_SECRET=your_secret_key  

Run migrations:
npx prisma migrate dev  

Start server:
npm start  

---

### 3️⃣ Frontend Setup
cd frontend  
npm install  
npm run dev  

---

## 🌐 Deployment

- Frontend → Vercel
- Backend → Render
- Database → PostgreSQL (Neon)

---

## 📁 Project Structure

/backend  
  /controllers  
  /services  
  /repositories  
  /models  
  /prisma  

/frontend  
  /components  
  /pages  
  /services  

---

## 🎯 Highlights

- Clean and modular backend architecture
- Strong implementation of OOP principles
- Real-world exam workflow simulation
- Scalable and maintainable code structure
- Separation of concerns across layers

---

## 🚀 Future Improvements

- Manual evaluation for descriptive answers
- Advanced analytics dashboard
- Real-time monitoring system
- AI-based proctoring (optional)
