# 🎓 ClassHub - Virtual Classroom Management System

![Java](https://img.shields.io/badge/Java-21-red)
![Spring Boot](https://img.shields.io/badge/SpringBoot-4.x-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

ClassHub is a **Microservices-based Learning Management System (LMS)** designed for educational institutions.

It allows teachers to create virtual classrooms, share learning resources, assign coursework, grade submissions, and track student performance through a live leaderboard.

The system follows a **Spring Boot Microservices Architecture** with **Docker**, **Spring Cloud Eureka**, **API Gateway**, **JWT Authentication**, and a **React + TypeScript** frontend.

---

# 🚀 Features

## 👨‍🏫 Teacher

- Register/Login using Email OTP Verification
- Create multiple classrooms
- Generate unique classroom join codes
- Upload learning resources (PDF, PPT, Images, Videos)
- Create assignments
- Grade student submissions
- View leaderboard
- Delete classrooms
- Receive email notifications

---

## 👨‍🎓 Student

- Register/Login
- Join classroom using unique code
- View uploaded resources
- Download learning materials
- Submit assignments
- View grades
- View leaderboard
- Receive email notifications

---

## 🔐 Authentication

- JWT Authentication
- Refresh Token
- Forgot Password
- Reset Password
- Email OTP Verification
- Role Based Access Control
- Password Encryption (BCrypt)

---

## 📧 Notification System

- Email Verification
- Assignment Created Notification
- Resource Upload Notification
- Assignment Grading Notification

---

## 📊 Leaderboard

- Workspace-wise leaderboard
- Student rankings
- Score tracking

---

# 🏗️ Architecture

```
                   React Frontend
                          │
                    API Gateway
                          │
                 Eureka Discovery Server
                          │
 ┌─────────────────────────────────────────────────────┐
 │                 Spring Boot Services                │
 ├─────────────────────────────────────────────────────┤
 │ Auth Service                                        │
 │ Workspace Service                                   │
 │ Resource Service                                    │
 │ Assignment Service                                 │
 │ Submission Service                                 │
 │ Leaderboard Service                                │
 │ Notification Service                               │
 └─────────────────────────────────────────────────────┘
                          │
                PostgreSQL (Neon Database)
                          │
                    Cloudinary Storage
```

---

# 🛠 Tech Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Cloud
- Spring Cloud Gateway
- Spring Cloud Eureka
- Spring Data JPA
- PostgreSQL
- Hibernate
- Maven
- JWT
- Feign Client
- Docker

---

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Framer Motion

---

## Database

- PostgreSQL (Neon DB)

---

## Cloud Storage

- Cloudinary

---

## DevOps

- Docker
- Docker Compose
- Git
- GitHub

---

# 📂 Project Structure

```
ClassHub
│
├── api-gateway
├── auth-service
├── discovery-server
├── workspace-service
├── resource-service
├── assignment-service
├── submission-service
├── leaderboard-service
├── notification-service
├── classhub-frontend
│
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Prerequisites

Install the following software before running the project.

- Java 21
- Maven
- Node.js 22+
- Docker Desktop
- Git

---

# 🔑 Environment Variables

Create a `.env` file in the project root.

Example:

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=

MAIL_USERNAME=
MAIL_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# ▶️ Running Locally (Without Docker)

## Backend

Start the services in the following order:

1. Discovery Server
2. Auth Service
3. Workspace Service
4. Resource Service
5. Assignment Service
6. Submission Service
7. Leaderboard Service
8. Notification Service
9. API Gateway

---

## Frontend

```bash
cd classhub-frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

# 🐳 Running with Docker

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ClassHub.git

cd ClassHub
```

Start all services

```bash
docker compose up --build
```

Run in detached mode

```bash
docker compose up -d
```

Stop all services

```bash
docker compose down
```

View logs

```bash
docker compose logs -f
```

---

# 🌐 Default Ports

| Service | Port |
|----------|------|
| Frontend | 3000 |
| API Gateway | 8080 |
| Auth Service | 8081 |
| Workspace Service | 8082 |
| Resource Service | 8083 |
| Assignment Service | 8084 |
| Submission Service | 8085 |
| Leaderboard Service | 8086 |
| Notification Service | 8087 |
| Eureka Server | 8761 |

---


# 🚀 Future Enhancements

- Online Coding Playground
- AI Assignment Evaluation
- Live Classroom Chat
- Video Meetings
- Attendance Management
- Admin Dashboard
- Course Analytics
- Mobile Application
- Real-time Notifications

---

# 👨‍💻 Author

**Kushagra Gupta**

PG-DAC, CDAC Hyderabad

GitHub: https://github.com/kush788

LinkedIn: [YOUR_LINKEDIN_PROFILE](https://www.linkedin.com/in/kushagra-gupta-040b0a26a/)

---

# ⭐ If you like this project

Give it a ⭐ on GitHub.
