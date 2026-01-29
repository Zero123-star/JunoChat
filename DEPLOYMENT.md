# JunoChat Deployment Guide

## Quick Deploy to Render (Free)

### Option 1: One-Click Deploy (Blueprint)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up/login
3. Click **"New"** → **"Blueprint"**
4. Connect your GitHub repo
5. Render will detect the `render.yaml` and create:
   - PostgreSQL database (free for 90 days)
   - Backend API service (free)
   - Frontend static site (free forever)

### Option 2: Manual Setup

#### 1. Create PostgreSQL Database
- Go to Render Dashboard → **New** → **PostgreSQL**
- Name: `junochat-db`
- Plan: **Free**
- Copy the **Internal Database URL**

#### 2. Deploy Backend
- Go to **New** → **Web Service**
- Connect your GitHub repo
- Settings:
  - **Name**: `junochat-api`
  - **Root Directory**: `backend`
  - **Runtime**: Python 3
  - **Build Command**: `./build.sh`
  - **Start Command**: `gunicorn Django_MDS.wsgi:application`
- Environment Variables:
  ```
  DATABASE_URL=<paste internal database URL>
  DJANGO_SECRET_KEY=<generate a random string>
  DJANGO_DEBUG=False
  DJANGO_ALLOWED_HOSTS=.onrender.com,localhost
  FRONTEND_URL=https://junochat-frontend.onrender.com
  ```

#### 3. Deploy Frontend
- Go to **New** → **Static Site**
- Connect your GitHub repo
- Settings:
  - **Name**: `junochat-frontend`
  - **Root Directory**: `JunoChat-frontend`
  - **Build Command**: `npm install && npm run build`
  - **Publish Directory**: `dist`
- Environment Variables:
  ```
  VITE_API_URL=https://junochat-api.onrender.com
  ```

---

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd JunoChat-frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (Django)
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Local PostgreSQL |
| `DJANGO_SECRET_KEY` | Django secret key | Insecure default |
| `DJANGO_DEBUG` | Enable debug mode | `True` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hosts | `localhost,127.0.0.1` |
| `FRONTEND_URL` | Frontend URL for CORS | - |

### Frontend (Vite)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   PostgreSQL    │
│  (React/Vite)   │     │   (Django)      │     │   Database      │
│  Static Site    │     │   Web Service   │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  OpenRouter API │
                        │  (AI Responses) │
                        └─────────────────┘
```

---

## Troubleshooting

### Backend not starting
- Check `DATABASE_URL` is correct
- Ensure `build.sh` has execute permissions: `chmod +x build.sh`

### CORS errors
- Add your frontend URL to `FRONTEND_URL` env var
- Check `DJANGO_ALLOWED_HOSTS` includes your domain

### Frontend can't connect to backend
- Verify `VITE_API_URL` points to your backend URL
- Rebuild frontend after changing env vars
