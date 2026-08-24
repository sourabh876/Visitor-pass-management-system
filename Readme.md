# Visitor Pass Management System

A full-stack MERN-based Visitor Pass Management System designed to digitize and streamline visitor registration, appointment management, pass generation, QR-based verification, and visitor check-in/check-out.

The system provides separate workflows for Administrators, Employees, Security Staff, and Visitors.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Secure login
- Role-based access control
- Protected routes
- Four user roles:
  - Admin
  - Employee
  - Security
  - Visitor
- Password hashing using bcrypt
- Automatic JWT authorization using Axios interceptors

---

## 👤 Visitor Management

Visitors can:

- Maintain their visitor profile
- Add personal information
- Add company information
- Provide ID proof details
- Upload visitor photo
- Update their profile
- View their profile

Visitor records use soft deletion to preserve historical information for auditing.

---

## 📅 Appointment Management

Visitors can:

- Select an employee/host
- Select department
- Enter visit purpose
- Select visit date
- Select visit time
- Book appointments
- View appointment status

Employees can:

- View appointment requests
- View visitor details
- Approve appointments
- Reject appointments
- Add remarks

Appointment statuses:

```text
Pending
Approved
Rejected

##Architecture

                    ┌──────────────────────┐
                    │      React Client    │
                    │                      │
                    │  React Router        │
                    │  Axios               │
                    │  Tailwind CSS        │
                    │  Protected Routes    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │                      │
                    │ Authentication       │
                    │ Authorization        │
                    │ Controllers          │
                    │ Routes               │
                    │ Middleware           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │                      │
                    │ Users                │
                    │ Visitors             │
                    │ Appointments         │
                    │ Passes               │
                    │ CheckLogs            │
                    └──────────────────────┘

##Project workflow

Visitor Registration
        │
        ▼
Visitor Profile
        │
        ▼
Book Appointment
        │
        ▼
Pending
        │
        ├───────────────┐
        ▼               ▼
    Approved         Rejected
        │
        ▼
Generate Visitor Pass
        │
        ▼
QR Code + PDF
        │
        ▼
Security Verification
        │
        ▼
Check-In
        │
        ▼
Visitor Inside
        │
        ▼
Check-Out
        │
        ▼
Pass Used

##🧰 Technology Stack

Frontend:-

React.js
React Router DOM
Axios
Tailwind CSS
HTML5 QR Code
QR Code
JavaScript ES6+

Backend:-

Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
Multer
QRCode
PDFKit
REST APIs

Development Tools :-

Vite
Git
GitHub
VS Code
MongoDB / MongoDB Atlas

## Project Structure
visitor-pass-management-system/
│
├── client/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   └── checkLogApi.js
│   │   │
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── QRScanner.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── employee/
│   │   │   ├── security/
│   │   │   └── visitor/
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── appointmentService.js
│   │   │   ├── authApi.js
│   │   │   ├── checkLogService.js
│   │   │   ├── passService.js
│   │   │   ├── userApi.js
│   │   │   └── visitorApi.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env
│
├── server/
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── config/
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md



##installation setup

1-- clone the repositary :- git clone https://github.com/sourabh876/Visitor-pass-management-system.git
2-- move into the project:- cd visitor-pass-management-system


backend setup:-
1-- cd server (move into the backend directory)
2--install dependencies (npm install)
3-- add your credentials in your env file 
  ex. PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret

4-- start the backend (npm run dev)

frotend setup:-

1-- move into the client folder ( cd client)
2-- install dependencies (npm install)
3-- create .env file 
4-- add this in your file:-  VITE_API_BASE_URL=http://localhost:5000/api
5-- start the frontend ( npm run dev)
