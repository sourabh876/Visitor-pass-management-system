##Project architecture:-

                React Frontend
                      │
         Axios (HTTP Requests)
                      │
               Express API
                      │
       JWT Authentication Middleware
                      │
      Controllers → Services → Models
                      │
                 MongoDB Atlas


##Tech stack used :-

Frontend:
React
React Router
Axios
Tailwind CSS
React Hook Form
React QR Scanner
React Toastify
Chart.js / Recharts

Backend:
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
multer
qrcode
pdfkit
nodemailer
twilio (optional)
express-validator


##Folder Structure 


backend
│
├── config
│      db.js
│
├── controllers
│      authController.js
│      visitorController.js
│      passController.js
│      appointmentController.js
│      dashboardController.js
│
├── middleware
│      auth.js
│      role.js
│      upload.js
│
├── models
│      User.js
│      Visitor.js
│      Appointment.js
│      Pass.js
│      CheckLog.js
│
├── routes
│      authRoutes.js
│      visitorRoutes.js
│      passRoutes.js
│      appointmentRoutes.js
│      dashboardRoutes.js
│
├── services
│      emailService.js
│      qrService.js
│      pdfService.js
│
├── uploads
│
├── utils
│
├── app.js
└── server.js


 
frontend
│
├── components
│      Navbar
│      Sidebar
│      ProtectedRoute
│      QRScanner
│      VisitorCard
│
├── pages
│      Login
│      Register
│      Dashboard
│
│      Admin
│      Security
│      Employee
│      Visitor
│
├── context
│      AuthContext
│
├── services
│      api.js
│
├── hooks
│
├── layouts
│
└── App.jsx

##Database Design:-

Users
{
   _id
   name
   email
   password
   role

   roles:
   Admin
   Employee
   Security
}

Visitors
{
   _id
   name
   phone
   email
   company
   photo
   idProof
}

Appointments
{
   _id

   visitor

   employee

   purpose

   visitDate

   status

   pending
   approved
   rejected
}

Passes
{
   _id

   visitor

   appointment

   qrCode

   passNumber

   issuedBy

   issueDate

   expiry

   status
}

CheckLogs
{
   _id

   pass

   checkIn

   checkOut

   scannedBy
}


##User Flow

Visitor:-

Open Website

↓

Register

↓

Upload Photo

↓

Book Appointment

↓

Wait for Approval

↓

Receive Email

↓

Digital Pass

↓

Visit Office

↓

Security Scans QR

↓

Check In

↓

Check Out

Employee:-

Login

↓

View Requests

↓

Approve

↓

Pass Generated

Security:-

Login

↓

Scan QR

↓

Check In

↓

Check Out


Admin:-

Dashboard

↓

Manage Users

↓

Reports

↓

Analytics

↓

Export CSV


##APIs

Auth:-

POST /auth/register

POST /auth/login

GET /auth/profile

Visitors:-

GET /visitors

GET /visitors/:id

POST /visitors

PUT /visitors/:id

DELETE /visitors/:id

Appointments:-

POST /appointments

GET /appointments

PUT /appointments/:id/approve

PUT /appointments/:id/reject

Pass:-

POST /pass/generate

GET /pass/:id

GET /pass/download

GET /pass/verify/:qr

Logs:-

POST /checkin

POST /checkout

GET /logs

Dashboard:-

GET /dashboard/stats


##Authentication Flow

Login

↓

JWT Generated

↓

React Stores Token

↓

Axios Header

↓

Backend Middleware

↓

Role Check

↓

Controller

##Nice UI Pages

Login

Register

Forgot Password

Dashboard

Visitors

Appointments

Passes

QR Scanner

Reports

Profile

Settings