# CI/CD Documentation - JunoChat

## Table of Contents
1. [Overview](#1-overview)
2. [Environment Description](#2-environment-description)
3. [Environment Differences](#3-environment-differences)
4. [Specific Configurations](#4-specific-configurations)
5. [CI/CD Pipeline](#5-cicd-pipeline)
6. [Deployment Flow](#6-deployment-flow)

---

## 1. Overview

JunoChat uses **GitHub Actions** for automating Continuous Integration (CI) and Continuous Deployment (CD) processes. Our pipeline ensures:

- Automatic code testing on every push/PR
- Code quality verification (linting, type checking)
- Dependency security scanning
- Automatic production builds
- Automated deployment to multiple environments

### Technologies Used

| Component | Technology | Version |
|-----------|------------|---------|
| CI/CD Platform | GitHub Actions | v4 |
| Frontend Runtime | Node.js | 20.x |
| Backend Runtime | Python | 3.11 |
| Database | PostgreSQL | 15 |
| Test Framework (FE) | Vitest | 3.2.2 |
| Test Framework (BE) | Django Test / pytest | latest |

---

## 2. Environment Description

### 2.1 Development Environment (Local)

**Purpose:** Local development and manual testing

```
+-----------------------------------------------------------+
|                   LOCAL DEVELOPMENT                        |
+-----------------------------------------------------------+
|  Frontend (Vite Dev Server)  |  http://localhost:5173     |
|  Backend (Django)            |  http://localhost:8000     |
|  Database (PostgreSQL)       |  localhost:5432            |
+-----------------------------------------------------------+
```

**Features:**
- Hot Module Replacement (HMR) for frontend
- Debug mode enabled
- Complete source maps
- Detailed console logs
- Local database with test data

### 2.2 Staging Environment

**Purpose:** Integrated testing and pre-production validation

```
+-----------------------------------------------------------+
|                   STAGING ENVIRONMENT                      |
+-----------------------------------------------------------+
|  Frontend URL      |  https://staging.junochat.app        |
|  Backend/API URL   |  https://api-staging.junochat.app    |
|  Database          |  PostgreSQL (cloud instance)         |
|  Triggered by      |  Push to main branch                 |
+-----------------------------------------------------------+
```

**Features:**
- Configuration similar to production
- Realistic test data (not production data)
- Allows manual QA testing
- Automatic deployment after tests pass

### 2.3 Production Environment

**Purpose:** Live application for real users

```
+-----------------------------------------------------------+
|                  PRODUCTION ENVIRONMENT                    |
+-----------------------------------------------------------+
|  Frontend URL      |  https://junochat.app                |
|  Backend/API URL   |  https://api.junochat.app            |
|  Database          |  PostgreSQL (managed, replicated)    |
|  Triggered by      |  Manual approval + main branch       |
+-----------------------------------------------------------+
```

**Features:**
- Maximum performance optimizations
- Complete minification and bundling
- CDN for static assets
- Active monitoring and alerting
- Automatic database backup
- Zero-downtime deployments

---

## 3. Environment Differences

### 3.1 Comparison Matrix

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Debug Mode** | Enabled | Limited | Disabled |
| **Source Maps** | Complete | Complete | Hidden |
| **Minification** | No | Yes | Yes |
| **Hot Reload** | Yes | No | No |
| **Logging Level** | DEBUG | INFO | WARNING |
| **Error Reporting** | Console | Console + Logs | Sentry/External |
| **SSL/HTTPS** | Optional | Required | Required |
| **Rate Limiting** | No | Relaxed | Strict |
| **Database** | Local | Cloud (test) | Cloud (prod) |
| **API Keys** | Test keys | Test keys | Production keys |

### 3.2 Environment Variables

#### Development (.env.development)
```env
VITE_API_URL=http://localhost:8000/api/
VITE_DEBUG=true
VITE_ENVIRONMENT=development
```

#### Staging (.env.staging)
```env
VITE_API_URL=https://api-staging.junochat.app/api/
VITE_DEBUG=false
VITE_ENVIRONMENT=staging
```

#### Production (.env.production)
```env
VITE_API_URL=https://api.junochat.app/api/
VITE_DEBUG=false
VITE_ENVIRONMENT=production
```

### 3.3 Backend Configuration

#### Django Settings per Environment

```python
# settings/base.py - Common configuration

# settings/development.py
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOW_ALL_ORIGINS = True

# settings/staging.py
DEBUG = False
ALLOWED_HOSTS = ['api-staging.junochat.app']
CORS_ALLOWED_ORIGINS = ['https://staging.junochat.app']

# settings/production.py
DEBUG = False
ALLOWED_HOSTS = ['api.junochat.app']
CORS_ALLOWED_ORIGINS = ['https://junochat.app']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## 4. Specific Configurations

### 4.1 GitHub Actions Secrets

Required secrets configured in GitHub Repository Settings:

| Secret Name | Environment | Description |
|-------------|-------------|-------------|
| `DATABASE_URL` | Staging/Prod | PostgreSQL connection string |
| `SECRET_KEY` | Staging/Prod | Django secret key |
| `OPENROUTER_API_KEY` | Staging/Prod | API key for AI chat |
| `DEPLOY_SSH_KEY` | Staging/Prod | SSH key for deployment |
| `SENTRY_DSN` | Production | Error tracking DSN |

### 4.2 GitHub Environments

We configure environments in GitHub Settings - Environments:

**Staging Environment:**
- No protection rules (auto-deploy)
- Environment secrets for staging DB

**Production Environment:**
- Required reviewers (min. 1 approval)
- Wait timer: 5 minutes
- Branch restrictions: only `main`

### 4.3 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENVIRONMENT),
    },
    build: {
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['framer-motion', 'lucide-react'],
          }
        }
      }
    }
  }
})
```

---

## 5. CI/CD Pipeline

### 5.1 Pipeline Diagram

```
+-------------------------------------------------------------------+
|                        GITHUB ACTIONS PIPELINE                     |
+-------------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------------+
|  TRIGGER: Push to main/frontend/backend or Pull Request           |
+-------------------------------------------------------------------+
                              |
              +---------------+---------------+
              v               v               v
     +----------------+ +--------------+ +----------------+
     | Frontend Tests | | Backend Tests| | Code Quality   |
     | - npm ci       | | - pip install| | - TypeScript   |
     | - npm lint     | | - migrations | |   type check   |
     | - npm test     | | - django test| |                |
     | - coverage     | |              | |                |
     +----------------+ +--------------+ +----------------+
              |               |               |
              +---------------+---------------+
                              v
                    +------------------+
                    |  Frontend Build  |
                    |  - npm run build |
                    |  - artifacts     |
                    +------------------+
                              |
                              v
                    +------------------+
                    |  Security Scan   |
                    |  - npm audit     |
                    |  - safety check  |
                    +------------------+
                              |
              +---------------+---------------+
              v                               v
     +----------------+              +----------------+
     | Deploy Staging |              | Deploy Prod    |
     | (Automatic)    |--------------| (Manual Appr.) |
     +----------------+              +----------------+
```

### 5.2 Job Descriptions

#### Frontend Tests Job
```yaml
- Checkout code
- Setup Node.js 20.x with npm cache
- Install dependencies (npm ci)
- Run ESLint for code style
- Run Vitest unit tests
- Generate coverage report
- Upload coverage artifacts
```

#### Backend Tests Job
```yaml
- Checkout code
- Setup Python 3.11 with pip cache
- Start PostgreSQL service container
- Install Python dependencies
- Run Django system checks
- Apply database migrations
- Execute Django test suite
```

#### Security Scan Job
```yaml
- Run npm audit for frontend vulnerabilities
- Run safety check for Python packages
- Report findings (non-blocking)
```

---

## 6. Deployment Flow

### 6.1 Development to Staging

```
Developer pushes to main branch
           |
           v
    CI Pipeline runs
           |
           v
    All tests pass? --- No --> Pipeline fails, notify developer
           |
          Yes
           |
           v
    Build artifacts created
           |
           v
    Auto-deploy to Staging
           |
           v
    Staging URL available for QA
```

### 6.2 Staging to Production

```
    Staging validated by QA
           |
           v
    Create production deployment
           |
           v
    Required reviewer approves --- No --> Deployment blocked
           |
          Yes
           |
           v
    5-minute wait timer
           |
           v
    Deploy to Production
           |
           v
    Health checks pass? --- No --> Auto-rollback
           |
          Yes
           |
           v
    Production live!
```

### 6.3 Rollback Strategy

In case of production issues:

1. **Automatic Rollback**: If health checks fail
2. **Manual Rollback**: Re-run previous successful deployment
3. **Emergency**: Revert commit and push to trigger new pipeline

```bash
# Manual rollback command
git revert HEAD
git push origin main
```

---

## 7. Monitoring and Alerting

### 7.1 Monitored Metrics

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Error Rate | Sentry | > 1% |
| Response Time | Datadog/Custom | > 2s |
| CPU Usage | Cloud Monitoring | > 80% |
| Memory Usage | Cloud Monitoring | > 85% |
| Database Connections | PostgreSQL | > 90% pool |

### 7.2 Notifications

- **Slack**: Build failures, deployment status
- **Email**: Security vulnerabilities, critical errors
- **PagerDuty**: Production incidents (future)

---

## 8. Implemented Best Practices

1. **Immutable Artifacts**: Build once, deploy everywhere
2. **Environment Parity**: Staging mirrors production
3. **Secrets Management**: GitHub Secrets, not in code
4. **Automated Testing**: No manual testing gates
5. **Gradual Rollout**: Staging before production
6. **Rollback Capability**: Quick recovery from failures
7. **Audit Trail**: Full deployment history in GitHub

---

*Document generated for JunoChat - Software Engineering Final Deliverable*
*Last updated: January 2026*
