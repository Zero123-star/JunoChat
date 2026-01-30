# JunoChat Deployment Guide

## Production Deployment on Railway

JunoChat is currently deployed on **Railway.app** - a free, credit-card-free deployment platform.

### Live Application

**Production URL**: https://talented-spontaneity-production.up.railway.app/

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Platform                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │   Backend        │         │   Frontend       │     │
│  │   (Gunicorn)     │◄────────┤   (Vite)         │     │
│  │   Port: 8000     │         │   Static Site    │     │
│  │                  │         │                  │     │
│  │  Django 5.1.7    │         │  React 18        │     │
│  │  Python 3.10     │         │  Vite 6.3.4      │     │
│  └────────┬─────────┘         └──────────────────┘     │
│           │                                             │
│           ▼                                             │
│  ┌──────────────────────────────────────────┐          │
│  │  PostgreSQL Database (Railway Managed)   │          │
│  │  - Characters, Users, Messages           │          │
│  │  - Profile Pictures & Avatars (media/)   │          │
│  └──────────────────────────────────────────┘          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Deployment Pipeline

#### 1. **Backend Deployment (Django)**

**Build Step** (`railway.json`):
```bash
pip install -r requirements.txt
python manage.py collectstatic --noinput
```

**Deploy Step**:
```bash
python manage.py migrate --noinput
python manage.py loaddata characters.json
gunicorn Django_MDS.wsgi:application --bind 0.0.0.0:8000
```

**Environment Variables**:
```
DATABASE_URL=postgresql://...  # Railway managed PostgreSQL
DJANGO_SECRET_KEY=<secret>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=.railway.app,.up.railway.app
FRONTEND_URL=https://talented-spontaneity-production.up.railway.app/
VITE_API_URL=https://talented-spontaneity-production.up.railway.app/
SITE_URL=https://talented-spontaneity-production.up.railway.app/
```

**Key Features**:
- WhiteNoise middleware for static file serving
- CORS configured for Railway domains
- Proxy headers configured for HTTPS
- Media files served via Django (avatars, profile pictures)
- Token-based authentication (DRF)
- Automatic database migrations on deploy

#### 2. **Frontend Deployment (React/Vite)**

**Build Command**:
```bash
npm install
npm run build  # Outputs to dist/
```

**Serve**: Static hosting via Railway

**Environment Variables**:
```
VITE_API_URL=https://talented-spontaneity-production.up.railway.app/
```

**Features**:
- Dynamic API_BASE_URL for development/production switching
- Vite preview mode with allowed hosts
- Token-based auth stored in localStorage
- CORS enabled for Railway API domains

---

## Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 12+ (local)

### Backend Setup

```bash
cd backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create database (local)
createdb Django_MDS
export DATABASE_URL="postgresql://postgres:mongo@localhost:5432/Django_MDS"

# Run migrations
python manage.py migrate
python manage.py loaddata characters.json

# Start dev server
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

```bash
cd JunoChat-frontend
npm install
npm run dev  # Vite dev server on :5173
```

**API Configuration** (`src/config.ts`):
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## Database Seeding

Characters are automatically loaded on deploy via:
1. **Source**: `backend/characters.json` (Git tracked)
2. **Trigger**: `railway.json` deploy step
3. **Command**: `python manage.py loaddata characters.json`

To update characters:
```bash
cd backend
python manage.py dumpdata api.Character > characters.json
git add characters.json && git commit -m "Update characters"
git push
```

---

## Media Files & Asset Serving

### Image Storage
- **Location**: `backend/media/`
- **Tracked in Git**: (removed from `.gitignore`)
- **Serving**: Django view-based serving (works in production)

### URL Pattern
```
/media/avatars/{filename}      # Character avatars
/media/pfp/{filename}          # User profile pictures
```

### API Response Example
Characters API returns full absolute URLs:
```json
{
  "id": "...",
  "name": "Naruto",
  "avatar": "https://talented-spontaneity-production.up.railway.app//media/avatars/naruto.webp",
  ...
}
```

---

## Troubleshooting

### Images Not Loading

1. **Check API returns full URLs**:
   ```bash
   curl https://api.railway.app/api/characters/
   # Should return: "avatar": "https://...railway.app/media/..."
   ```

2. **Verify media files exist**:
   ```bash
   ls -la backend/media/avatars/
   ```

3. **Test media endpoint**:
   ```bash
   curl -I https://api.railway.app/media/avatars/naruto.webp
   # Should return HTTP 200
   ```

### Database Connection Issues

1. **Check DATABASE_URL**:
   ```bash
   echo $DATABASE_URL
   ```

2. **Test connection**:
   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```

### CORS Errors

1. **Add domain to ALLOWED_HOSTS** in `settings.py`
2. **Add domain to CORS_ALLOWED_ORIGINS** in `settings.py`
3. **Redeploy backend**

---

## Monitoring

### Railway Dashboard
- [Logs](https://railway.app) - Real-time backend logs
- [Metrics](https://railway.app) - CPU, memory, request count
- [Deployments](https://railway.app) - Deploy history

### Manual Health Checks

```bash
# Backend health
curl https://api.railway.app/api/characters/

# Frontend accessible
curl https://talented-spontaneity-production.up.railway.app/

# Database migration status
# (Check Railway logs for "Applying..." messages)
```

---

## Cost & Limits

**Railway Free Plan**:
- $5/month free tier
- PostgreSQL (managed)
- Up to 100GB/month bandwidth
- No credit card required

---

## Git Workflow

### Deploy to Production
```bash
git add .
git commit -m "Feature/fix description"
git push origin photobooth
git push unibuc photobooth  # Push to both remotes
```

Railway automatically detects push and redeploys within 2-3 minutes.

### Branches
- `photobooth` - Main deployment branch (Railway)
- `develop` - Feature development
- Feature branches - Individual features

---

## Testing in Production

### Checklist
- [ ] Login/signup works
- [ ] Characters load with images
- [ ] Can create character
- [ ] Can chat with character
- [ ] Profile pictures display
- [ ] Search functionality works
- [ ] Follow/unfollow works
- [ ] Favorite characters works
