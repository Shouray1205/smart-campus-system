# 🎓 Smart Campus Management System

Full Stack Project — React.js + Spring Boot + H2 Database (dev mode)

---

## ✅ Requirements — Pehle yeh install karo

| Tool | Version | Download |
|------|---------|----------|
| **Java JDK** | 17 ya 21 | https://adoptium.net |
| **Maven** | 3.8+ | https://maven.apache.org/download.cgi |
| **Node.js** | 18+ | https://nodejs.org |

> Check karo installed hai ya nahi:
> ```
> java -version
> mvn -version
> node -version
> ```

---

## 🚀 Project Chalane ke Steps

### Step 1 — Backend (Spring Boot)

```powershell
cd backend
mvn spring-boot:run
```

- Backend start hoga: **http://localhost:8088**
- H2 Database automatically create hoga (koi MySQL install nahi karna)
- Seed data automatically load hoga (students, faculty, courses sab)

### Step 2 — Frontend (React)

**Pehli baar:**
```powershell
cd frontend
npm install
npm run dev
```

**Dobara chalana ho toh:**
```powershell
cd frontend
npm run dev
```

- Frontend start hoga: **http://localhost:5173**

---

## 🌐 Browser mein open karo

```
http://localhost:5173
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@campus.edu | Admin@123 |
| **Faculty** | smith@campus.edu | Faculty@123 |
| **Faculty** | mehra@campus.edu | Faculty@123 |
| **Student** | alex@student.campus.edu | Student@123 |
| **Student** | arjun@student.campus.edu | Student@123 |

> Khud bhi register kar sakte ho Login page pe — "New Student" ya "New Faculty" tab se

---

## 📁 Project Structure

```
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

## 🏫 Modules

| Module | Admin | Faculty | Student |
|--------|-------|---------|---------|
| Dashboard | ✅ | ✅ | ✅ |
| Student Management | CRUD | View | View |
| Faculty Management | CRUD | View | View |
| Courses | CRUD | View | View |
| Attendance | Mark All | Own Records | Own Records |
| Timetable | CRUD | View | View |
| Fees | All Students | ❌ | Own Fees |
| Notices | CRUD | View/Post | View |

---

## 🏢 Departments

- Computer Science (Section A & B)
- Information Technology (Section A & B)
- Electronics & Communication (Section A & B)
- Mechanical Engineering (Section A & B)

---

## ⚠️ Common Issues

**Backend start nahi ho raha?**
- Java version check karo: `java -version` (17 ya 21 chahiye)
- Port 8088 occupied ho toh `application.yml` mein `port: 8088` change karo

**Frontend error aa rahi hai?**
- `npm install` zaroor chalao pehli baar
- Node.js version check karo: `node -version` (18+ chahiye)

**Login nahi ho raha?**
- Backend pehle start karo, phir frontend
- Wait karo jab tak terminal mein `Started SmartCampusApplication` dikhe

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: Java 17+, Spring Boot 3, Spring Security, JWT
- **Database**: H2 (in-memory, dev) — restart pe data reset hota hai
- **Auth**: JWT Token based authentication
