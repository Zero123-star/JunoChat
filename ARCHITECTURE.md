# JunoChat Architecture

## System Context Diagram (C1)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────┐                    ┌──────────────────┐  │
│  │   User/      │                    │   JunoChat       │  │
│  │   Developer  │◄─────────Browser──────┤   System         │  │
│  │              │                    │                  │  │
│  └──────────────┘                    └────────┬─────────┘  │
│                                               │             │
│                                      ┌────────▼─────────┐  │
│                                      │ OpenRouter API   │  │
│                                      │ (AI Responses)   │  │
│                                      └──────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Container Diagram (C2)

```
┌────────────────────────────────────────────────────────────────┐
│                    JunoChat System                             │
│                                                                │
│  ┌──────────────────────────────┐  ┌──────────────────────┐  │
│  │   Web Browser                │  │  Mobile Browser      │  │
│  │  (React/Vite Frontend)       │  │ (React/Vite Frontend)│  │
│  │  - User Authentication       │  │ - Same Features      │  │
│  │  - Character Display         │  │ - Responsive UI      │  │
│  │  - Character Creation        │  │                      │  │
│  │  - Chat Interface            │  │                      │  │
│  │  - Profile Management        │  │                      │  │
│  └──────────────┬───────────────┘  └──────────┬───────────┘  │
│                 │                             │               │
│                 └─────────────┬────────────────┘               │
│                               │                               │
│                    ┌──────────▼──────────────┐               │
│                    │  API Gateway / Load    │               │
│                    │  Balancer (Railway)    │               │
│                    └──────────┬──────────────┘               │
│                               │                               │
│              ┌────────────────▼──────────────────┐            │
│              │  Django REST Backend              │            │
│              │  (Python 3.10, Gunicorn)         │            │
│              │  - Authentication & Authorization │            │
│              │  - Character Management           │            │
│              │  - Chat/Message Handling          │            │
│              │  - User Management                │            │
│              │  - Social Features (Follow/Like)  │            │
│              │  - API Endpoints                  │            │
│              │  - Media File Serving             │            │
│              └────────────────┬──────────────────┘            │
│                               │                               │
│              ┌────────────────▼──────────────────┐            │
│              │  PostgreSQL Database              │            │
│              │  (Railway Managed)                │            │
│              │  - Users (Authentication)         │            │
│              │  - Characters                     │            │
│              │  - Messages & Chats               │            │
│              │  - Social Relationships           │            │
│              │  - Media Metadata                 │            │
│              └───────────────────────────────────┘            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   OpenRouter API       │
                    │   (AI LLM Service)     │
                    └───────────────────────┘
```

## Component Diagram (C3)

### Backend Components

```
┌─────────────────────────────────────────────────────────┐
│           Django REST Framework Backend                 │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              API Layer                           │  │
│  │  ┌─────────────────┐  ┌──────────────────────┐  │  │
│  │  │  User Views     │  │  Character Views     │  │  │
│  │  │  - Login/Signup │  │  - List Characters   │  │  │
│  │  │  - Profile CRUD │  │  - Create Character  │  │  │
│  │  │  - Follow User  │  │  - Edit Character    │  │  │
│  │  │  - Search Users │  │  - Delete Character  │  │  │
│  │  └────────┬────────┘  │  - Favorite Char     │  │  │
│  │           │           └──────────┬───────────┘  │  │
│  │  ┌────────▼───────────────────────┴──────────┐  │  │
│  │  │  Message/Chat Views                      │  │  │
│  │  │  - Send Message                          │  │  │
│  │  │  - Get Chat History                      │  │  │
│  │  │  - Create Chat Session                   │  │  │
│  │  └──────────────┬───────────────────────────┘  │  │
│  │                 │                              │  │
│  │  ┌──────────────▼────────────────────────────┐  │  │
│  │  │  Serializers                             │  │  │
│  │  │  - UserSerializer                        │  │  │
│  │  │  - CharacterSerializer (w/ avatar URL)   │  │  │
│  │  │  - MessageSerializer                     │  │  │
│  │  └──────────────┬────────────────────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
│                   │                                 │
│  ┌────────────────▼────────────────────────────┐   │
│  │         Authentication Layer               │   │
│  │  - Token Authentication (DRF)              │   │
│  │  - Permission Classes                      │   │
│  │  - CORS Middleware                         │   │
│  │  - JWT/Token Validation                    │   │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                 │
│  ┌────────────────▼──────────────────────────┐     │
│  │       Middleware & Settings               │     │
│  │  - WhiteNoise (Static Files)              │     │
│  │  - CORS Headers                           │     │
│  │  - Proxy Headers (HTTPS)                  │     │
│  │  - Database Configuration                 │     │
│  │  - Media File Serving                     │     │
│  └────────────────┬──────────────────────────┘     │
│                   │                                 │
│  ┌────────────────▼──────────────────────────┐     │
│  │       Models & ORM                        │     │
│  │  - CustomUser                             │     │
│  │  - Character                              │     │
│  │  - Message/Chat                           │     │
│  │  - Follow/Relationship                    │     │
│  │  - Tags                                   │     │
│  └────────────────┬──────────────────────────┘     │
│                   │                                 │
└───────────────────▼─────────────────────────────────┘
                    │
          ┌─────────▼─────────┐
          │   PostgreSQL      │
          │   Database        │
          └───────────────────┘
```

### Frontend Components

```
┌─────────────────────────────────────────────────────────┐
│           React/Vite Frontend                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Pages & Views                       │  │
│  │  ┌─────────────┐  ┌─────────────────────────┐   │  │
│  │  │  Auth Pages │  │  Character Pages        │   │  │
│  │  │  - Login    │  │  - CharactersPage       │   │  │
│  │  │  - Signup   │  │  - AddCharacterPage     │   │  │
│  │  └────┬────────┘  │  - EditCharacterPage    │   │  │
│  │       │           │  - CharacterDetails     │   │  │
│  │  ┌────▼──────────┬┴─────────────────────┐   │  │
│  │  │  Social Pages │  Chat Pages          │   │  │
│  │  │  - HomePage   │  - ChatPage          │   │  │
│  │  │  - UserList   │  - CharacterChat     │   │  │
│  │  │  - UserProfile│  - MessageDisplay    │   │  │
│  │  └────────────────┴──────────────────────┘   │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
│  ┌──────────────▼───────────────────────────────┐  │
│  │         Reusable Components                  │  │
│  │  - CharacterCard                             │  │
│  │  - CharacterCarousel                         │  │
│  │  - AvatarCard                                │  │
│  │  - UserList                                  │  │
│  │  - Button, Input, Label (UI Library)         │  │
│  │  - Navbar                                    │  │
│  │  - GlassmorphicContainer                     │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
│  ┌──────────────▼───────────────────────────────┐  │
│  │        API Integration Layer                 │  │
│  │  ┌───────────────────────────────────────┐   │  │
│  │  │  api.ts                               │   │  │
│  │  │  - Character API calls                │   │  │
│  │  │  - User API calls                     │   │  │
│  │  │  - Message API calls                  │   │  │
│  │  │  - Auth interceptor                   │   │  │
│  │  │  - Token management                   │   │  │
│  │  └───────────────────────────────────────┘   │  │
│  │  ┌───────────────────────────────────────┐   │  │
│  │  │  config.ts                            │   │  │
│  │  │  - API_BASE_URL (environment aware)   │   │  │
│  │  └───────────────────────────────────────┘   │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
│  ┌──────────────▼───────────────────────────────┐  │
│  │        State Management                      │  │
│  │  - React Context (AuthContext)               │  │
│  │  - Local Storage (Token, User ID)            │  │
│  │  - Component State (useState)                │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
│  ┌──────────────▼───────────────────────────────┐  │
│  │        Styling & UI                          │  │
│  │  - Tailwind CSS                              │  │
│  │  - CSS Modules                               │  │
│  │  - Framer Motion (Animations)                │  │
│  │  - Lucide Icons                              │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
└─────────────────▼───────────────────────────────────┘
                  │
      ┌───────────▼──────────────┐
      │   Backend API            │
      │   (Django REST)          │
      └──────────────────────────┘
```

---

## Data Flow Diagrams

### Character Display Flow

```
┌─────────────────┐
│  User Visits    │
│  Characters     │
│  Page           │
└────────┬────────┘
         │
         ▼
┌────────────────────────────┐
│ Frontend loads             │
│ CharacterCard component    │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ api.ts calls               │
│ GET /api/characters/       │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Django CharacterViewSet    │
│ returns serialized data    │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Serializer.get_avatar()    │
│ builds full absolute URL   │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Returns JSON:              │
│ {                          │
│  "avatar":                 │
│  "https://.../media/..."   │
│ }                          │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Frontend <img src={url}>   │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Browser requests image at  │
│ /media/avatars/...         │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Django URL route matches   │
│ re_path media pattern      │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ serve() view delivers file │
│ from media/ directory      │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Browser displays image     │
│ in CharacterCard           │
└────────────────────────────┘
```

### Authentication Flow

```
┌──────────────┐
│ User enters  │
│ credentials  │
└──────┬───────┘
       │
       ▼
┌────────────────────────────┐
│ POST /api/auth/login/      │
│ {username, password}       │
└────────┬───────────────────┘
       │
       ▼
┌────────────────────────────┐
│ Django validates           │
│ credentials                │
└────────┬───────────────────┘
       │
       ▼
┌────────────────────────────┐
│ Returns DRF Token          │
│ {token: "abc123..."}       │
└────────┬───────────────────┘
       │
       ▼
┌────────────────────────────┐
│ Frontend stores in         │
│ localStorage               │
└────────┬───────────────────┘
       │
       ▼
┌────────────────────────────┐
│ Axios interceptor adds     │
│ Authorization header       │
└────────┬───────────────────┘
       │
       ▼
┌────────────────────────────┐
│ Protected endpoints        │
│ authenticate with token    │
└────────────────────────────┘
```

---

## Technology Stack

### Backend
- **Language**: Python 3.10
- **Framework**: Django 5.1.7
- **API**: Django REST Framework (DRF)
- **Database**: PostgreSQL 12+
- **Server**: Gunicorn WSGI
- **Authentication**: Token-based (DRF)
- **Static Files**: WhiteNoise
- **CORS**: django-cors-headers

### Frontend
- **Language**: TypeScript/JavaScript
- **Framework**: React 18
- **Build Tool**: Vite 6.3.4
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **UI Library**: Custom + Lucide Icons
- **State Management**: React Context + localStorage

### Infrastructure
- **Hosting**: Railway.app
- **Database Hosting**: Railway Managed PostgreSQL
- **CI/CD**: Git push → Railway auto-deploy
- **Domain**: railway.app subdomain
- **SSL/TLS**: Railway provided

---

## Non-Functional Characteristics

### Security
- Token-based authentication
- CORS properly configured
- HTTPS enforced in production
- SQL injection prevention (ORM)
- XSS protection (React auto-escaping)

### Scalability
- Stateless backend (can scale horizontally)
- Database connection pooling
- Static files served via WhiteNoise
- CDN-ready architecture

### Performance
- JSON API responses
- Media files cached by browser
- Lazy loading components
- Optimized database queries

### Maintainability
- Clean separation of concerns
- Reusable components
- Comprehensive error handling
- Proper logging

### Reliability
- Database transactions for data consistency
- Error handling and fallbacks
- Graceful degradation
- Automated migrations on deploy
