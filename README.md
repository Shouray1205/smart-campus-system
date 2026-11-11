# 🎓 Smart Campus Management System

**Full Stack Project — React.js + Spring Boot + H2 Database (Development Mode)**

---

## ✅ Requirements — Install These First

| Tool | Version | Download |
|---|---|---|
| **Java JDK** | 17 or 21 | [https://adoptium.net](https://adoptium.net) |
| **Maven** | 3.8+ | [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi) |
| **Node.js** | 18+ | [https://nodejs.org](https://nodejs.org) |

Check whether the tools are installed by running these commands:

```powershell
java -version
mvn -version
node -version
```

---

## 🚀 How to Run the Project

### Step 1 — Start the Backend (Spring Boot)

```powershell
cd backend
mvn spring-boot:run
```

- Backend will start at: **http://localhost:8088**
- The H2 database will be created automatically (no MySQL installation required).
- Seed data will be loaded automatically, including students, faculty members, and courses.

### Step 2 — Start the Frontend (React)

**For the first run:**

```powershell
cd frontend
npm install
npm run dev
```

**For subsequent runs:**

```powershell
cd frontend
npm run dev
```

- Frontend will start at: **http://localhost:5173**

---

## 🌐 Open the Project in Your Browser

```text
http://localhost:5173
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@campus.edu | Admin@123 |
| **Faculty** | smith@campus.edu | Faculty@123 |
| **Faculty** | mehra@campus.edu | Faculty@123 |
| **Student** | alex@student.campus.edu | Student@123 |
| **Student** | arjun@student.campus.edu | Student@123 |

You can also register your own account through the Login page using the **"New Student"** or **"New Faculty"** tabs.

---

## 📁 Project Structure

```text
smart-campus-system/
├── backend/          ← Spring Boot (Java)
│   ├── src/
│   └── pom.xml
├── frontend/         ← React + Vite
│   ├── src/
│   └── package.json
└── README.md
```

---

## 🏫 Project Modules

| Module | Admin | Faculty | Student |
|---|---|---|---|
| Dashboard | Full Access | View | View |
| Student Management | CRUD | View | View |
| Faculty Management | CRUD | View | View |
| Courses | CRUD | View | View |
| Attendance | Mark Attendance | Own Records | Own Records |
| Timetable | CRUD | View | View |
| Fees | All Students | No Access | Own Fees |
| Notices | CRUD | View/Post | View |

---

## 🏢 Departments

- Computer Science (Section A & B)
- Information Technology (Section A & B)
- Electronics & Communication (Section A & B)
- Mechanical Engineering (Section A & B)

---

## ⚠️ Common Issues

**Backend is not starting?**

- Check the Java version using `java -version` (Java 17 or 21 is required).
- If port 8088 is already occupied, change the port in `application.yml`.

**Frontend errors?**

- Make sure to run `npm install` before the first run.
- Check the Node.js version using `node -version` (Node.js 18 or later is required).

**Unable to log in?**

- Start the backend before starting the frontend.
- Wait until the terminal displays `Started SmartCampusApplication`.

---

## 💻 Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Axios
- **Backend:** Java 17+, Spring Boot 3, Spring Security, JWT
- **Database:** H2 (in-memory, development mode) — data resets when the application restarts.
- **Authentication:** JWT-based token authentication