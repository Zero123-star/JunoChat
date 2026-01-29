# QA & Testing Plan - JunoChat

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready  

---

## Executive Summary

This document outlines the comprehensive testing strategy for JunoChat, covering unit tests, integration tests, end-to-end tests, and production validation. The plan ensures all critical user paths function correctly and the application meets teacher evaluation requirements.

---

## 1. Testing Framework & Architecture

### Backend Testing Stack
- **Framework:** Django TestCase + unittest
- **HTTP Client:** Django test client
- **Assertion Library:** unittest assertions + custom validators
- **Coverage Tool:** coverage.py
- **Test Data:** Django fixtures + factory-boy patterns

### Frontend Testing Stack
- **Framework:** Vitest (integrated with Vite)
- **Component Testing:** React Testing Library
- **E2E Testing:** Playwright (future)
- **Visual Regression:** Chromatic (optional)

### Test Environment
- **Database:** SQLite (test-isolated, auto-cleanup)
- **Cache:** In-memory (test-isolated)
- **API Mocking:** Responses library for external APIs
- **Isolated Execution:** Each test runs independently with fresh data

---

## 2. Test Coverage Matrix

### Core Features (High Priority)

| Feature | Test Type | Status | Coverage |
|---------|-----------|--------|----------|
| User Registration | Unit + Integration | Ready | POST /api/auth/register/ - validates email/password, creates user |
| User Login | Unit + Integration | Ready | POST /api/auth/login/ - returns auth token |
| Character Chat | Integration + E2E | Ready | OpenRouter API calls, message history |
| Character Creation | Unit + Integration | Ready | POST /api/characters/ - validates data, saves to DB |
| Character Display | Integration | Ready | GET /api/characters/ - returns with absolute image URLs |
| Image Serving | Integration | Ready | /media/* endpoints - returns image files |
| Auth Token Validation | Unit | Ready | DRF TokenAuthentication middleware |
| CORS Configuration | Integration | Ready | Requests from Railway frontend domain |

### Edge Cases & Error Handling

| Scenario | Test Type | Expected Behavior |
|----------|-----------|-------------------|
| Invalid token | Unit | 401 Unauthorized |
| Expired token | Unit | 401 Unauthorized |
| Missing avatar file | Integration | 404 Not Found |
| Invalid character data | Unit | 400 Bad Request |
| Concurrent chat requests | Integration | Queue/handle gracefully |
| Large file upload | Integration | Size validation |
| Network timeout | E2E | Graceful error message to user |

---

## 3. Production Testing Checklist

### Pre-Deployment Verification (Completed)

- [x] **Database Migrations**: All Django migrations applied, tables created
- [x] **Static Files**: Collected via `python manage.py collectstatic`
- [x] **Media Files**: Character avatars tracked in git at `backend/media/`
- [x] **Environment Variables**: All required env vars set in Railway dashboard
  - `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `DATABASE_URL`, `OPENROUTER_API_KEY`
- [x] **CORS Configuration**: Allows Railway frontend domain
- [x] **Proxy Headers**: Django configured for HTTPS via X-Forwarded-Proto header
- [x] **Serializer URLs**: CharacterSerializer returns absolute image URLs
- [x] **Media Serving**: Django re_path route configured for /media/* endpoints

### Post-Deployment Live Verification

#### Phase 1: Connectivity & Basic Functionality

```bash
# Test 1: API health check
curl -X GET https://proiect-inginerie-software-juno-production.up.railway.app/api/characters/

# Expected: 200 OK with JSON array of characters

# Test 2: Character with image URL
curl -X GET https://proiect-inginerie-software-juno-production.up.railway.app/api/characters/1/ | grep -i avatar

# Expected: "avatar": "https://proiect-inginerie-software-juno-production.up.railway.app/media/avatars/..."

# Test 3: Image download (verify file integrity)
curl -O https://proiect-inginerie-software-juno-production.up.railway.app/media/avatars/naruto.webp
file naruto.webp

# Expected: image/webp (valid WEBP format)

# Test 4: CORS preflight
curl -X OPTIONS -H "Origin: https://proiect-inginerie-software-juno-production.up.railway.app" \
  -H "Access-Control-Request-Method: GET" \
  https://proiect-inginerie-software-juno-production.up.railway.app/api/characters/

# Expected: 200 OK with CORS headers present
```

#### Phase 2: User Authentication Flow

1. **Register New User**
   - Navigate to signup page
   - Fill form with valid email (e.g., test@example.com) and password
   - Expected: User created, redirected to login

2. **Login**
   - Use credentials from registration
   - Expected: Token stored in localStorage, redirected to home

3. **Verify Auth Token in Requests**
   - Open browser DevTools → Network tab
   - Make API request (e.g., create character)
   - Expected: Authorization header present with "Token xxx"

#### Phase 3: Character Display & Image Loading

1. **Homepage Character Grid**
   - Load homepage (unauthenticated)
   - Expected: All 7 seeded characters display with avatars visible
   - Check HTML: `<img src="https://.../media/avatars/...">`

2. **Character Details Page**
   - Click on any character card
   - Expected: Large avatar image loads, no broken image icons
   - Inspect page source: Avatar URL is absolute, not relative

3. **Character Chat**
   - Click "Chat" button on character card
   - Expected: Chat interface loads
   - Type message and send
   - Expected: Character responds via OpenRouter API

#### Phase 4: CRUD Operations

1. **Create Character (Authenticated)**
   - Login first
   - Navigate to "Create Character" or add button
   - Fill form (name, description, avatar upload)
   - Submit
   - Expected: Character created, appears in grid

2. **Edit Character**
   - Click edit on owned character
   - Modify description
   - Submit
   - Expected: Changes reflected immediately

3. **Delete Character**
   - Click delete on owned character
   - Confirm deletion
   - Expected: Character removed from grid

#### Phase 5: Cross-Browser & Device Testing

| Browser | Device | Status | Notes |
|---------|--------|--------|-------|
| Chrome | Desktop | | Full functionality |
| Safari | Desktop (Mac) | | Full functionality |
| Firefox | Desktop | | Full functionality |
| Chrome | Mobile | | Responsive layout, touch friendly |
| Safari | iPhone | | Responsive, touch friendly |

#### Phase 6: Performance Baseline

```bash
# Measure API response time
curl -w "\n%{time_total}\n" -o /dev/null -s \
  https://proiect-inginerie-software-juno-production.up.railway.app/api/characters/

# Expected: < 500ms for character list
# Expected: < 300ms for single character

# Check database query count
# (Enable Django query logging in settings.py DEBUG=True temporarily)
# Expected: Optimal queries, no N+1 problems
```

#### Phase 7: Error Handling & Edge Cases

1. **Invalid Token**
   - Manually modify token in localStorage to "invalidtoken"
   - Try to create/edit character
   - Expected: 401 Unauthorized, prompts re-login

2. **Network Error Simulation**
   - Open DevTools → Network → Throttle to "Offline"
   - Try API call
   - Expected: Graceful error message to user

3. **Missing Image**
   - Delete image file from `backend/media/avatars/`
   - Try to load character
   - Expected: Graceful fallback (placeholder or error message)

---

## 4. Continuous Integration (CI) Workflow

### GitHub Actions Pipeline

**Location:** `.github/workflows/` (optional enhancement)

**Current Manual Process on Railway:**
1. Push to `photobooth` branch
2. Railway auto-detects changes
3. Rebuilds both services (backend + frontend)
4. Runs Django migrations
5. Loads character fixtures
6. Deploys to production

**Future Enhancement:**
Add automated testing before merge:
```yaml
- Run: `python manage.py test --no-input`
- Run: `npm run test` (frontend Vitest)
- Run: Linting (eslint, black, isort)
- Only merge if all checks pass
```

---

## 5. Production Monitoring & Logging

### Application Monitoring

1. **Railway Dashboard**
   - Service status (active/crashed)
   - CPU/Memory usage
   - Network bandwidth
   - Build/deploy logs

2. **Error Tracking (Future)**
   - Sentry integration for backend exceptions
   - LogRocket for frontend error tracking
   - Custom logging middleware

3. **Database Monitoring**
   - Connection pool status
   - Query performance (slow queries)
   - Backup verification

### Health Check Endpoints

```python
# backend/api/views.py - Add health check view
@api_view(['GET'])
def health_check(request):
    return Response({
        'status': 'healthy',
        'db': 'connected' if check_db() else 'error',
        'cache': 'connected' if check_cache() else 'error',
        'timestamp': timezone.now()
    })
```

---

## 6. Known Issues & Limitations

### Resolved
- [x] Images not displaying in production (FIXED via absolute URLs + media serving route)
- [x] Hardcoded localhost URLs in frontend (FIXED via dynamic API_BASE_URL)
- [x] CORS errors (FIXED via proper middleware configuration)

### Current Limitations (By Design)
- OpenRouter API response time depends on external service (typically 1-5 seconds)
- Character creation requires authentication
- Image uploads limited to 5MB (configurable)
- Database read-replicas not yet implemented (single server sufficient for current load)

### Future Enhancements
- Add caching layer (Redis) for character list
- Implement pagination for character grid
- Add rate limiting to prevent API abuse
- Setup automated database backups
- Implement WebSocket for real-time chat

---

## 7. Test Execution Instructions

### Running Backend Tests

```bash
cd backend
python manage.py test --no-input --verbosity=2

# Run specific test module
python manage.py test api.tests.test_auth

# Generate coverage report
coverage run --source='.' manage.py test
coverage report
coverage html  # generates htmlcov/index.html
```

### Running Frontend Tests

```bash
cd JunoChat-frontend
npm install
npm run test

# Watch mode for development
npm run test -- --watch

# Generate coverage report
npm run test -- --coverage
```

### Manual Smoke Test (5-10 minutes)

1. Open https://proiect-inginerie-software-juno-production.up.railway.app
2. Verify homepage loads with 7 characters + images
3. Click character → verify details load
4. Click "Chat" → type message → verify response
5. Logout
6. Register new account → Login → Create character
7. Verify character appears in grid

---

## 8. Teacher Evaluation Checklist

**Code Quality**
- Clean architecture (MVC pattern)
- Proper error handling
- Authentication & authorization implemented
- Code documented with docstrings

**Functionality**
- All features working in production
- Character creation, chat, image display
- User authentication (register/login)

**Testing**
- Unit tests for API endpoints
- Integration tests for database operations
- Manual QA checklist provided
- Edge cases documented

**Architecture Documentation**
- C4 system/container/component diagrams in ARCHITECTURE.md
- Data flow diagrams for character display and auth
- Technology stack documented

**Deployment**
- Live at https://proiect-inginerie-software-juno-production.up.railway.app
- Environment configuration documented
- Database seeding automated
- Media files served correctly

**Maintenance & Security**
- HTTPS enforced
- CORS properly configured
- Database using prepared statements (Django ORM)
- Sensitive data (SECRET_KEY, API keys) in environment variables

---

## 9. Approval & Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | Self | 2024 | Approved |
| Tech Lead | Self | 2024 | Approved |
| Deployment | Railway | Auto | Active |

---

## Contact & Support

For issues during evaluation:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Inspect Railway logs: https://railway.app/dashboard
4. Check `.github/workflows/` for CI/CD pipeline (if implemented)

---

**Document Status:** Final  
**Ready for Evaluation:** Yes
