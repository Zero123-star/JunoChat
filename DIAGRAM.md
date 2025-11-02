# JunoChat Architecture Diagrams

## System Overview

JunoChat is a Character AI-like platform built with React (frontend), Django (backend), and PostgreSQL (database). Users can chat with AI-powered characters, create their own characters, and use creative features like the Photobooth.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TB
    A[React Frontend]
    B[Django Backend]
    C[(PostgreSQL)]
    D[OpenRouter AI]
    E[Media Storage]
    
    A -->|REST API| B
    B -->|SQL| C
    B -->|AI Requests| D
    B -->|Images| E
    
    style A fill:#61dafb,stroke:#333,stroke-width:3px
    style B fill:#092e20,stroke:#333,stroke-width:3px,color:#fff
    style C fill:#336791,stroke:#333,stroke-width:3px,color:#fff
    style D fill:#f39c12,stroke:#333,stroke-width:3px
    style E fill:#95a5a6,stroke:#333,stroke-width:3px
```

---

## 2. Database Schema (Entity Relationship Diagram)

```mermaid
erDiagram
    User ||--o{ Character : creates
    User ||--o{ Chat : has
    User ||--o{ Follow : follows
    
    Character ||--o{ Chat : participates
    Character }o--o{ Tag : tagged
    
    Chat ||--o{ Message : contains
    
    User {
        int id
        string username
        string email
        image profile_picture
    }
    
    Character {
        uuid id
        string name
        image avatar
        text description
    }
    
    Chat {
        int id
        int user_id
        uuid character_id
    }
    
    Message {
        int id
        text content
        datetime timestamp
        int chat_id
    }
    
    Tag {
        int id
        string name
    }
    
    Follow {
        int follower_id
        int followed_id
    }
```

---

## 3. Backend Models (Simplified)

```mermaid
classDiagram
    class User {
        +username
        +email
        +profile_picture
        +follow()
        +unfollow()
    }
    
    class Character {
        +name
        +avatar
        +description
        +tags
    }
    
    class Chat {
        +user
        +character
    }
    
    class Message {
        +content
        +timestamp
        +sender
    }
    
    class Tag {
        +name
    }
    
    User "1" -- "*" Character : creates
    User "1" -- "*" Chat : has
    Character "1" -- "*" Chat : participates
    Chat "1" -- "*" Message : contains
    Character "*" -- "*" Tag : tagged
```

---

## 4. Frontend Component Structure

```mermaid
graph TD
    A[App] --> B[Navbar]
    A --> C[Pages]
    
    C --> D[Home]
    C --> E[Characters]
    C --> F[Chat]
    C --> G[Profile]
    C --> H[Photobooth]
    
    E --> I[CharacterCard]
    F --> J[Messages]
    H --> K[ImageUpload]
    
    style A fill:#61dafb,stroke:#333,stroke-width:3px
    style B fill:#9b59b6,stroke:#333,stroke-width:3px
    style H fill:#f39c12,stroke:#333,stroke-width:3px
```

---

## 5. Chat Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant AI
    
    User->>Frontend: Send message
    Frontend->>Backend: POST /api/messages
    Backend->>Database: Save message
    Backend->>AI: Request response
    AI-->>Backend: AI reply
    Backend->>Database: Save reply
    Backend-->>Frontend: Return conversation
    Frontend-->>User: Display messages
```

---

## 6. User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/login
    Backend->>Database: Validate user
    Database-->>Backend: User data
    Backend-->>Frontend: Token
    Frontend->>Frontend: Store token
    Frontend-->>User: Redirect to home
```

---

## 7. User Journey Flow

```mermaid
stateDiagram-v2
    [*] --> Login
    Login --> Home
    Home --> Characters
    Home --> Profile
    Characters --> Chat
    Chat --> Messages
    Home --> Photobooth
    Profile --> EditProfile
```

---

## 8. Technology Stack

```mermaid
graph TB
    A[Frontend]
    B[Backend]
    C[Database]
    D[AI Service]
    
    A --> A1[React]
    A --> A2[TypeScript]
    A --> A3[TailwindCSS]
    
    B --> B1[Django]
    B --> B2[REST Framework]
    B --> B3[Python]
    
    C --> C1[PostgreSQL]
    
    D --> D1[OpenRouter]
    
    style A fill:#61dafb,stroke:#333,stroke-width:3px
    style B fill:#092e20,stroke:#333,stroke-width:3px,color:#fff
    style C fill:#336791,stroke:#333,stroke-width:3px,color:#fff
    style D fill:#f39c12,stroke:#333,stroke-width:3px
```

---

## 9. System Layers

```mermaid
graph TD
    A[Presentation Layer]
    B[Application Layer]
    C[Data Layer]
    
    A --> A1[React UI]
    A --> A2[Components]
    
    B --> B1[REST API]
    B --> B2[Business Logic]
    
    C --> C1[PostgreSQL]
    C --> C2[Media Files]
    
    A1 --> B1
    B2 --> C1
    B2 --> C2
    
    style A fill:#61dafb,stroke:#333,stroke-width:3px
    style B fill:#092e20,stroke:#333,stroke-width:3px,color:#fff
    style C fill:#336791,stroke:#333,stroke-width:3px,color:#fff
```

---

## 10. Core Features

```mermaid
graph TB
    A[JunoChat]
    
    A --> B[Users]
    A --> C[Characters]
    A --> D[Chats]
    A --> E[Photobooth]
    
    B --> B1[Login/Signup]
    B --> B2[Profile]
    B --> B3[Follow System]
    
    C --> C1[Create]
    C --> C2[Browse]
    C --> C3[Edit]
    
    D --> D1[AI Messages]
    D --> D2[History]
    
    E --> E1[Image Blend]
    E --> E2[Export]
    
    style A fill:#9b59b6,stroke:#333,stroke-width:3px,color:#fff
    style B fill:#3498db,stroke:#333,stroke-width:2px
    style C fill:#e74c3c,stroke:#333,stroke-width:2px
    style D fill:#2ecc71,stroke:#333,stroke-width:2px
    style E fill:#f39c12,stroke:#333,stroke-width:2px
```

---

## API Endpoints Overview

### Authentication
- `POST /api/login/` - User login
- `POST /api/signup/` - User registration
- `POST /api/logout/` - User logout

### Users
- `GET /api/users/` - List users
- `GET /api/users/{id}/` - User detail
- `PUT /api/users/{id}/` - Update user
- `GET /api/users/search/` - Search users
- `POST /api/users/{id}/follow/` - Follow user
- `POST /api/users/{id}/unfollow/` - Unfollow user

### Characters
- `GET /api/characters/` - List characters
- `POST /api/characters/` - Create character
- `GET /api/characters/{id}/` - Character detail
- `PUT /api/characters/{id}/` - Update character
- `DELETE /api/characters/{id}/` - Delete character

### Chats
- `GET /api/chats/` - List user chats
- `POST /api/chats/` - Create chat
- `GET /api/chats/{id}/` - Chat detail
- `POST /api/chats/{id}/messages/` - Send message
- `GET /api/chats/{id}/messages/` - Get messages

### Tags
- `GET /api/tags/` - List tags
- `POST /api/tags/` - Create tag

---

## Key Design Patterns Used

1. **MVC/MVT Pattern** - Django follows Model-View-Template (adapted to REST API)
2. **Repository Pattern** - Django ORM acts as repository layer
3. **Component-Based Architecture** - React components for reusability
4. **RESTful API Design** - Standard HTTP methods and status codes
5. **Token-Based Authentication** - Django REST Framework tokens
6. **Middleware Pattern** - CORS, Authentication, Error handling
7. **Observer Pattern** - React state management and re-rendering
8. **Factory Pattern** - Django model managers and querysets

---

## Security Features

- Token-based authentication
- CSRF protection
- CORS configuration
- Password hashing (Django default)
- SQL injection protection (ORM)
- XSS protection (React escaping)
- Input validation (serializers)
- File upload validation

---

## Performance Optimizations

- Database indexing on foreign keys
- React code splitting with lazy loading
- Image optimization (Pillow)
- API response caching (potential)
- Database connection pooling
- Static file serving
- Pagination for large datasets

---

*Generated: November 2, 2025*  
*Version: 1.0*  
*Branch: photobooth*
