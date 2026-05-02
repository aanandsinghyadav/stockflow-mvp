# 🚀 StockFlow MVP

A minimal multi-tenant SaaS inventory management system built as part of a technical assessment.

🌐 **Live Demo:** https://stockflow-mvp.netlify.app  
🔗 **GitHub Repository:** https://github.com/aanandsinghyadav/stockflow-mvp  

---

## 📌 Overview

StockFlow is a simple inventory management application where users can:

- Sign up and create their own organization
- Manage products with stock quantities and pricing
- View a dashboard with inventory summary and low-stock alerts

Each user's data is **isolated by organization**, ensuring multi-tenant safety.

---

## ✨ Features

### 🔐 Authentication
- User signup & login
- JWT-based authentication
- Secure API access

### 📦 Product Management
- Create, update, delete products
- SKU uniqueness per organization
- Adjust stock levels (+/-)

### 📊 Dashboard
- Total number of products
- Total inventory quantity
- Low stock items based on threshold

### ⚙️ Settings
- Configurable low stock threshold (global default)

---

## 🧠 Key Design Decisions

- **Multi-tenancy:** All data scoped by `organization_id`
- **Security:** JWT-based authentication with protected routes
- **Scalability:** Clean separation of backend and frontend
- **MVP-first approach:** Focused on core features for fast delivery

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | NestJS + Prisma + MySQL             |
| Frontend | React + Vite + TypeScript + Tailwind |
| Auth     | JWT (Bearer token)                  |
| Hosting  | Railway (Backend), Netlify (Frontend) |

---

## 📦 API Endpoints

| Method | Route                            | Auth | Description              |
|--------|----------------------------------|------|--------------------------|
| POST   | /api/auth/signup                 | ❌   | Create account           |
| POST   | /api/auth/login                  | ❌   | Login, get JWT           |
| GET    | /api/dashboard                   | ✅   | Summary + low stock list |
| GET    | /api/products                    | ✅   | List all products        |
| POST   | /api/products                    | ✅   | Create product           |
| GET    | /api/products/:id                | ✅   | Get single product       |
| PUT    | /api/products/:id                | ✅   | Update product           |
| DELETE | /api/products/:id                | ✅   | Delete product           |
| PATCH  | /api/products/:id/adjust-stock   | ✅   | Adjust quantity +/-      |
| GET    | /api/settings                    | ✅   | Get org settings         |
| PUT    | /api/settings                    | ✅   | Update low stock default |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MySQL running on `localhost:3306`

### Backend

```bash
cd stockflow_mvp_backend
npm install
npm run prisma:migrate
npm run start:dev