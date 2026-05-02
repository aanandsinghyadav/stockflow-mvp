# StockFlow MVP

A minimal multi-tenant SaaS inventory management app.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | NestJS + Prisma + MySQL             |
| Frontend | React + Vite + TypeScript + Tailwind |
| Auth     | JWT (Bearer token)                  |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL running on `localhost:3306`

### Backend

```bash
cd stockflow_mvp_backend

# 1. Install dependencies
npm install

# 2. Configure environment
# Edit .env — set DATABASE_URL, JWT_SECRET

# 3. Run database migration
npm run prisma:migrate

# 4. Start dev server (http://localhost:3000)
npm run start:dev
```

### Frontend

```bash
cd stockflow_mvp_frontend

# 1. Install dependencies
npm install

# 2. Start dev server (http://localhost:5173)
npm run dev
```

The frontend proxies `/api` requests to `http://localhost:3000` automatically.

---

## API Endpoints

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
