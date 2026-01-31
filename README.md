# 🎓 College Management System

A backend-based **College Management System** built using **Node.js, Express.js, MongoDB, and Mongoose** with role-based access control.

---

## 📌 Project Overview

This system manages academic entities like:

- Departments
- Courses
- Subjects
- Faculty
- Students  

with proper **authentication and authorization**.

---

## 👥 User Roles

| Role     | Permissions |
|---------|-------------|
| Admin   | Full access |
| Faculty | View assigned subjects |
| Student | View subjects of own course & semester |

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## 📁 Folder Structure

```
College-Management-System/
│
├── Backend/
│ │
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ ├── subject.controller.js
│ │ ├── faculty.controller.js
│ │ ├── student.controller.js
│ │ ├── course.controller.js
│ │ └── department.controller.js
│ │
│ ├── models/
│ │ ├── user.model.js
│ │ ├── faculty.model.js
│ │ ├── student.model.js
│ │ ├── subject.model.js
│ │ ├── course.model.js
│ │ └── department.model.js
│ │
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── subject.routes.js
│ │ ├── faculty.routes.js
│ │ ├── student.routes.js
│ │ ├── course.routes.js
│ │ └── department.routes.js
│ │
│ ├── middlewares/
│ │ ├── isAuthenticated.js
│ │ └── roleMiddleware.js
│ │
│ ├── config/
│ │ └── db.js
│ │
│ ├── utils/
│ │ └── generateToken.js
│ │
│ ├── app.js
│ └── server.js
│
├── .env
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in root directory:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


---

## ▶️ Run Project

```npm install```

```npm run dev```


Server will start at:

http://localhost:8000


---


## 🧠 Access Logic

- **Admin**: Can create, update, delete, assign
- **Faculty**: Can view assigned subjects
- **Student**: Can view subjects based on course & semester

---

## 🚀 Future Modules (Planned)

- Attendance Management
- Exam & Result System
- Fees & Payment Module
- Timetable Management
- Notifications
- React Frontend

---

## 👨‍💻 Author

**Kush**  
B.Tech Computer Science

---

## ⭐ Support

If this project helps you, give it a ⭐ on GitHub.