# Online Exam & Evaluation System

## 1. Project Overview

The Online Exam & Evaluation System is a full-stack application designed to conduct, manage, and evaluate examinations in a structured and scalable way.

The primary focus of this project is the backend architecture, which will follow proper software engineering practices including OOP principles, layered architecture, and clean separation of concerns.

The system enables administrators to create and manage exams, and allows students to attempt exams within a controlled and timed environment. The system automatically evaluates responses (for supported question types) and stores results for analysis.

---

## 2. Problem Statement

Traditional exam systems are either manual or poorly structured, leading to issues such as:

- Lack of structured evaluation logic  
- Poor separation between business logic and data access  
- No proper role-based control  
- Limited analytics and performance tracking  

This project aims to design a clean, modular, and scalable backend system that models an examination workflow from exam creation to result generation.

---

## 3. Scope of the Project

The scope of the project includes:

- User authentication and role-based access control  
- Exam creation and management  
- Question management  
- Timed exam attempts  
- Automated evaluation logic  
- Result storage and analytics  
- Clean backend architecture using OOP  

The frontend will provide dashboards for students and administrators, but backend implementation will be the primary focus.

### Out of Scope

- AI-based proctoring  
- Real-time video monitoring  
- Distributed microservices architecture  

The system will follow a monolithic but modular backend design.

---

## 4. Core Functionalities

### 4.1 User Management

- User registration and login  
- Role-based access (Admin / Student)  
- Secure authentication using JWT  
- Authorization middleware to restrict access  

---

### 4.2 Exam Management (Admin)

Admin can:

- Create exams  
- Set exam duration  
- Add questions to exams  
- Publish or deactivate exams  
- View student attempts and results  

Each exam will contain:

- Title  
- Description  
- Duration  
- Question set  
- Status (Draft / Published)  

---

### 4.3 Question Management

The system will support multiple question types:

- Multiple Choice Questions (MCQ)  
- Descriptive questions (manual evaluation placeholder)  

Each question will contain:

- Question text  
- Options (for MCQ)  
- Correct answer (for auto-evaluation)  
- Marks allocation  

Evaluation logic will be separated from question storage logic.

---

### 4.4 Exam Attempt System (Student)

Students can:

- View available exams  
- Start an exam attempt  
- Submit answers  
- Auto-submit when duration expires  

The system will:

- Track start time  
- Enforce time limit  
- Prevent multiple attempts (if restricted)  

---

### 4.5 Evaluation and Result Generation

The system will:

- Automatically evaluate objective questions  
- Calculate total score  
- Compute percentage  
- Store attempt history  
- Generate result summary  

Evaluation logic will follow a modular design to allow extension for new question types.

---

### 4.6 Analytics and Reporting

Admin can:

- View all student attempts  
- View exam-wise performance  
- View score distribution  
- Analyze participation  

Students can:

- View their attempt history  
- View score details  

---

## 5. Backend Architecture Focus

The backend will follow a layered architecture:

- Controllers → Handle HTTP requests and responses  
- Services → Business logic and evaluation rules  
- Repositories → Database interaction layer  
- Models → Class-based domain entities  

The project will implement OOP principles including:

- Encapsulation (Data + behavior in classes)  
- Abstraction (Hidden internal logic)  
- Inheritance (User hierarchy)  
- Polymorphism (Different evaluation strategies)  

---

## 6. Technology Stack

### Backend

- Node.js  
- Express.js  
- PostgreSQL  
- Prisma ORM  
- JWT Authentication  

### Frontend

- React.js (Role-based dashboard UI)  

---

## 7. Expected Outcome

By the end of the semester, the project will deliver:

- A fully functional exam management system  
- Clean, modular backend code  
- Proper OOP implementation  
- Structured database design  
- Complete UML and ER diagrams  
- Clear separation of responsibilities across layers  

The final system will demonstrate strong backend engineering concepts and system design fundamentals suitable for academic evaluation.
