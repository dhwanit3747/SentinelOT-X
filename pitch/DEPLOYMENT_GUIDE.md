# SentinelOT X - Deployment Guide

Production-ready deployment instructions for local development, Docker Compose, and cloud environments.

---

## 🚀 Quick Start (Local Standalone Mode)

### 1. Run Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000` (or `http://localhost:3001`).

### 2. Run Backend Server (Zero-Dependency Mode)
```bash
cd backend
py app/main.py
```
> **Note**: `py app/main.py` uses standard library modules and requires **zero external pip installations**!

### 3. Run FastAPI Backend (Optional Uvicorn Mode)
```bash
cd backend
pip install -r requirements.txt
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The OpenAPI docs will be available at `http://localhost:8000/docs`.

---

## 🐳 Docker Compose Deployment (Full Stack)

To run the complete stack including MongoDB:

```bash
docker-compose up --build -d
```

### Services Started:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **OpenAPI Swagger**: http://localhost:8000/docs
- **MongoDB**: mongodb://localhost:27017

---

## ⚙️ Environment Variables

### Backend (`.env` / Environment)
- `MONGODB_URL`: MongoDB connection string (default: `mongodb://localhost:27017/sentinelotx`)
- `SECRET_KEY`: JWT Signing Key
- `ENVIRONMENT`: `production` / `development`

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend REST API endpoint (default: `http://localhost:8000/api/v1`)
