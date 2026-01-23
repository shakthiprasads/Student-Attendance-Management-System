# Student Attendance Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing student attendance.

## Features

- **Student Management**: Add, edit, delete, and view students
- **Class Management**: Create and manage classes with sections
- **Attendance Tracking**: Mark and track attendance for students
- **Filtering**: Filter attendance records by class and date
- **Real-time Status Updates**: Change attendance status directly from the table

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── attendanceController.js
│   │   ├── classController.js
│   │   └── studentController.js
│   ├── models/
│   │   ├── Attendance.js
│   │   ├── Class.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── attendanceRoutes.js
│   │   ├── classRoutes.js
│   │   └── studentRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Attendance.jsx
│   │   │   ├── Classes.jsx
│   │   │   └── Students.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd project
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Edit the `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_db
```

For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendance_db
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The API server will start on http://localhost:5000

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:3000

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a single student
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get a single class
- `POST /api/classes` - Create a new class
- `PUT /api/classes/:id` - Update a class
- `DELETE /api/classes/:id` - Delete a class

### Attendance
- `GET /api/attendance` - Get attendance records (with optional filters)
- `GET /api/attendance/:id` - Get a single attendance record
- `POST /api/attendance` - Create an attendance record
- `POST /api/attendance/bulk` - Mark attendance for multiple students
- `PUT /api/attendance/:id` - Update an attendance record
- `DELETE /api/attendance/:id` - Delete an attendance record
- `GET /api/attendance/report/:studentId` - Get attendance report for a student

## Usage

1. **Add Classes**: First, create classes (e.g., "Grade 10 - Section A")
2. **Add Students**: Add students and assign them to classes
3. **Mark Attendance**: Go to the Attendance page to mark daily attendance
4. **View Reports**: Filter attendance by class and date to view records

## License

MIT
