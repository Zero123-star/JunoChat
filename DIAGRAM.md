# JunoChat Architecture Diagrams

## System Overview

JunoChat is a Character AI-like platform built with React (frontend), Django (backend), and PostgreSQL (database). Users can chat with AI-powered characters, create their own characters, and use creative features like the Photobooth.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Vite + TypeScript<br/>Port: 5173/5174]
    end
    
    subgraph "Application Layer"
        B[Django REST Framework<br/>Python Backend<br/>Port: 8000]
    end
    
    subgraph "Data Layer"
        C[(PostgreSQL Database<br/>Port: 5432)]
    end
    
    subgraph "External Services"
        D[OpenRouter API<br/>AI Chat Service]
        E[Image Storage<br/>Media Files]
    end
    
    A -->|HTTP/REST API| B
    B -->|ORM Queries| C
    B -->|AI Chat Requests| D
    B -->|File Upload/Retrieve| E
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style B fill:#092e20,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#f39c12,stroke:#333,stroke-width:2px
    style E fill:#95a5a6,stroke:#333,stroke-width:2px
```

---

## 2. Database Schema (Entity Relationship Diagram)

```mermaid
erDiagram
    CustomUser ||--o{ Follow : "follows/followed"
    CustomUser ||--o{ Character : "creates"
    CustomUser ||--o{ Chat : "participates"
    CustomUser ||--o{ Message : "sends"
    
    Character ||--o{ Chat : "chats_in"
    Character ||--o{ Message : "sends"
    Character }o--o{ Tag : "has"
    
    Chat ||--o{ Message : "contains"
    
    CustomUser {
        int id PK
        string username UK
        string email
        string password
        image profile_picture
        string code UK
        boolean confirmed_email
        boolean blocked
        datetime date_joined
    }
    
    Follow {
        int id PK
        int follower_id FK
        int followed_id FK
        datetime created_at
    }
    
    Character {
        uuid id PK
        string name
        image avatar
        string source
        text description
        int creator_id FK
    }
    
    Tag {
        int id PK
        string name UK
    }
    
    Chat {
        int id PK
        int user_id FK
        uuid chatbot_id FK
    }
    
    Message {
        int id PK
        text description
        datetime timestamp
        int chat_id FK
        int sender_user_id FK
        uuid sender_bot_id FK
        int number
    }
```

---

## 3. Backend Class Diagram (Django Models)

```mermaid
classDiagram
    class CustomUser {
        +int id
        +string username
        +string email
        +string password
        +ImageField profile_picture
        +string code
        +boolean confirmed_email
        +boolean blocked
        +ManyToMany followers
        +follow(user)
        +unfollow(user)
        +is_following(user)
        +get_followers_count()
        +get_following_count()
    }
    
    class Follow {
        +int id
        +ForeignKey follower
        +ForeignKey followed
        +datetime created_at
    }
    
    class Character {
        +UUID id
        +string name
        +ImageField avatar
        +string source
        +text description
        +ManyToMany tags
        +ForeignKey creator
    }
    
    class Tag {
        +int id
        +string name
    }
    
    class Chat {
        +int id
        +ForeignKey user
        +ForeignKey chatbot
    }
    
    class Message {
        +int id
        +text description
        +datetime timestamp
        +ForeignKey chat
        +ForeignKey sender_user
        +ForeignKey sender_bot
        +int number
        +save()
        +delete()
    }
    
    CustomUser "1" --> "*" Follow : follower
    CustomUser "1" --> "*" Follow : followed
    CustomUser "1" --> "*" Character : creates
    CustomUser "1" --> "*" Chat : participates
    CustomUser "1" --> "*" Message : sends
    
    Character "1" --> "*" Chat : chats_in
    Character "1" --> "*" Message : sends
    Character "*" --> "*" Tag : has
    
    Chat "1" --> "*" Message : contains
```

---

## 4. Frontend Architecture (Component Hierarchy)

```mermaid
graph TD
    A[App.tsx<br/>Root Component] --> B[Navbar]
    A --> C[Router]
    
    C --> D[HomePage]
    C --> E[LoginPage]
    C --> F[SignupPage]
    C --> G[CharactersPage]
    C --> H[ChatPage]
    C --> I[UserProfilePage]
    C --> J[ChatsHistoryPage]
    C --> K[PhotoboothPage]
    C --> L[AddCharacterPage]
    C --> M[EditCharacterPage]
    C --> N[UserSearchPage]
    
    G --> O[CharacterGrid]
    O --> P[CharacterCard]
    
    H --> Q[MessageList]
    H --> R[MessageInput]
    
    K --> S[ImageUpload]
    K --> T[ImageBlender]
    
    I --> U[AvatarCard]
    I --> V[UserList]
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style B fill:#9b59b6,stroke:#333,stroke-width:2px
    style C fill:#e74c3c,stroke:#333,stroke-width:2px
    style K fill:#f39c12,stroke:#333,stroke-width:2px
```

---

## 5. API Flow Diagram (Request/Response Cycle)

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant F as React Frontend
    participant D as Django Backend
    participant DB as PostgreSQL
    participant AI as OpenRouter API
    
    Note over U,AI: User Authentication Flow
    U->>F: Enter credentials
    F->>D: POST /api/login/
    D->>DB: Validate user
    DB-->>D: User data
    D-->>F: Token + User info
    F->>F: Store in localStorage
    F-->>U: Redirect to home
    
    Note over U,AI: Character Creation Flow
    U->>F: Fill character form
    F->>D: POST /api/characters/
    D->>DB: Create character record
    DB-->>D: Character created
    D-->>F: Character data
    F-->>U: Show success message
    
    Note over U,AI: Chat Flow
    U->>F: Select character & send message
    F->>D: POST /api/chats/{id}/messages/
    D->>DB: Save user message
    D->>AI: Send to AI service
    AI-->>D: AI response
    D->>DB: Save bot message
    DB-->>D: Message saved
    D-->>F: Chat history
    F-->>U: Display conversation
    
    Note over U,AI: Photobooth Flow
    U->>F: Upload 2 images
    F->>F: Blend images locally
    F-->>U: Display merged photo
```

---

## 6. Component Interaction Diagram

```mermaid
graph LR
    subgraph "Frontend Components"
        A[Pages] --> B[Components]
        B --> C[API Service]
        C --> D[Axios Instance]
    end
    
    subgraph "Backend Services"
        E[URLs/Routes] --> F[ViewSets]
        F --> G[Serializers]
        F --> H[Models]
        H --> I[Database]
    end
    
    subgraph "External"
        J[OpenRouter AI]
        K[Media Storage]
    end
    
    D -->|REST API Calls| E
    F -->|AI Requests| J
    H -->|File Operations| K
    
    style A fill:#61dafb
    style E fill:#092e20,color:#fff
    style I fill:#336791,color:#fff
    style J fill:#f39c12
```

---

## 7. Authentication & Authorization Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    
    Unauthenticated --> Authenticated: Login/Signup Success
    Authenticated --> Unauthenticated: Logout
    Authenticated --> Unauthenticated: Token Expired (401)
    
    state Authenticated {
        [*] --> BrowseCharacters
        BrowseCharacters --> ViewProfile
        BrowseCharacters --> StartChat
        BrowseCharacters --> CreateCharacter
        BrowseCharacters --> UsePhotobooth
        
        StartChat --> SendMessages
        SendMessages --> ReceiveResponses
        
        ViewProfile --> EditProfile
        ViewProfile --> FollowUsers
        
        CreateCharacter --> UploadAvatar
        CreateCharacter --> AddTags
    }
```

---

## 8. Technology Stack

```mermaid
graph TB
    subgraph "Frontend Stack"
        A1[React 18]
        A2[TypeScript]
        A3[Vite]
        A4[TailwindCSS]
        A5[React Router]
        A6[Axios]
        A7[Lucide Icons]
        A8[Sonner Toasts]
    end
    
    subgraph "Backend Stack"
        B1[Django 5.1.7]
        B2[Django REST Framework]
        B3[drf-yasg Swagger]
        B4[CORS Headers]
        B5[Pillow Image Processing]
        B6[psycopg2 PostgreSQL]
    end
    
    subgraph "Database"
        C1[(PostgreSQL 14+)]
    end
    
    subgraph "External APIs"
        D1[OpenRouter AI]
    end
    
    style A1 fill:#61dafb
    style B1 fill:#092e20,color:#fff
    style C1 fill:#336791,color:#fff
    style D1 fill:#f39c12
```

---

## 9. Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        A[localhost:5173/5174<br/>React Dev Server]
        B[localhost:8000<br/>Django Dev Server]
        C[localhost:5432<br/>PostgreSQL]
    end
    
    subgraph "Production (Potential)"
        D[Vercel/Netlify<br/>Static Frontend]
        E[Heroku/AWS/Railway<br/>Django Backend]
        F[AWS RDS/Supabase<br/>PostgreSQL]
        G[AWS S3/Cloudinary<br/>Media Storage]
    end
    
    A -.-> D
    B -.-> E
    C -.-> F
    E --> F
    E --> G
    D --> E
    
    style D fill:#61dafb
    style E fill:#092e20,color:#fff
    style F fill:#336791,color:#fff
```

---

## 10. Feature Map

```mermaid
mindmap
  root((JunoChat))
    User Management
      Registration/Login
      Profile Management
      Follow System
      Email Confirmation
      User Search
    Character System
      Create Characters
      Edit Characters
      Character Grid/List
      Tags & Categories
      Avatar Upload
      Character Details
    Chat System
      1:1 AI Chat
      Message History
      Real-time Responses
      OpenRouter Integration
      Chat Management
    Creative Features
      Photobooth
        Curtain Animation
        Image Upload
        Image Blending
        Polaroid Export
    UI/UX
      Glassmorphism Design
      Responsive Layout
      Toast Notifications
      Loading States
      Error Handling
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
