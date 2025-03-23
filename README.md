# 📝 NestJS To-Do App

A simple task management API built with **NestJS** and **MongoDB**, designed with clean architecture and easy extensibility in mind. Includes enhanced features like marking todos complete, handling deadlines, and generating reports by day/month/year.

---

## 📦 Tech Stack

- **NestJS** - Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Docker (optional)** - For containerization
- **ELK Stack (optional)** - For structured logging and visualization

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nestjs-todo-app.git
cd nestjs-todo-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/todo-db
PORT=3000
```

Or use your cloud MongoDB:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=3000
```

### 4. Run the application

```bash
npm run start
```

Access at: `http://localhost:3000`

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

---

### 📋 Health Check

- `GET /`  
Returns a simple message to confirm the server is running.

---

### 📘 To-Do Endpoints

#### ✅ Create To-Do
- `POST /todos`
- Body:

```json
{
  "title": "Build backend",
  "description": "Using NestJS",
  "deadline": "2025-04-01T00:00:00Z"
}
```

#### 📥 Get All To-Dos
- `GET /todos`

#### 📄 Get To-Do by ID
- `GET /todos/:id`

#### 📝 Update To-Do
- `PUT /todos/:id`
- Body:

```json
{
  "title": "Updated title",
  "completed": false
}
```

#### ❌ Delete To-Do
- `DELETE /todos/:id`

---

### ✅ Mark as Complete

#### Single Task
- `PATCH /todos/:id/complete`

#### Multiple Tasks
- `POST /todos/complete`
- Body:

```json
{
  "ids": ["id1", "id2", "id3"]
}
```

---

### 📊 Reporting

Get a report on task status within a given time period:

- `GET /todos/report?period=day`
- `GET /todos/report?period=month`
- `GET /todos/report?period=year`

Returns:

```json
{
  "period": "month",
  "startDate": "2025-03-01T00:00:00.000Z",
  "completed": 5,
  "notCompleted": 2,
  "late": 1
}
```

---

## 📁 Project Structure

```
src/
├── todo/
│   ├── todo.controller.ts
│   ├── todo.service.ts
│   ├── todo.module.ts
│   └── todo.schema.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
```

---

## 🐳 Docker (Optional)

Coming soon in the next section.

---

## 📈 Logging & ELK (Optional)

Structured JSON logging to be implemented with Logstash/Filebeat + Kibana.

---

## ✅ To-Do Features Recap

- [x] CRUD for tasks
- [x] Complete task individually or in batch
- [x] Optional `deadline` for each task
- [x] Report by day, month, year (completed, not completed, late)
- [ ] JSON Logging
- [ ] Docker + ELK Stack

---

## 🧑‍💻 Author

Built by hphun9 — DevOps | SRE | Backend Enthusiast.

---
