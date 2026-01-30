# JunoChat - AI Character Interaction Platform

##  Product Vision

**JunoChat** is an innovative AI-powered platform that revolutionizes how users interact with fictional characters and AI personalities. Our vision is to create an immersive, creative, and entertaining space where users can engage in meaningful conversations with AI characters, build their own character personalities, and explore creative features like image blending and interactive gaming.

### Vision Statement

*"To become the leading platform for AI character interaction, providing users with unlimited creative possibilities for entertainment, storytelling, and social connection through artificial intelligence."*

---

##  Core Value Propositions

1. **Unlimited Character Interaction** - Chat with AI-powered characters from various universes and genres
2. **Creative Freedom** - Design and share your own unique AI characters with the community
3. **Social Features** - Connect with other users, follow creators, and discover trending characters
4. **Innovative Tools** - Access creative features like the Photobooth for image blending and RPG gaming
5. **Seamless Experience** - Modern, responsive UI with glassmorphism design and intuitive navigation

---

##  Target Audience

- **Entertainment Seekers** - Users looking for engaging AI conversations and roleplay
- **Content Creators** - Writers and artists who want to bring their characters to life
- **AI Enthusiasts** - Tech-savvy users interested in AI interaction and customization
- **Gaming Community** - Players interested in text-based RPG and interactive storytelling
- **Social Users** - People seeking new forms of digital social interaction

---

##  Key Features

### 1. AI Character Chat System
- Real-time conversations with AI-powered characters
- Context-aware responses using OpenRouter AI
- Message history and conversation management
- Multiple concurrent chat sessions

### 2. Character Creation & Management
- Design custom AI characters with personalities
- Upload avatars and define character backgrounds
- Tag system for categorization and discovery
- Edit and manage your character portfolio

### 3. Social Features
- User profiles with follower system
- Browse and discover community characters
- Search and connect with other users
- Share and collaborate on character designs

### 4.  Photobooth (NEW)
- Upload two images (user + character)
- AI-powered image blending and merging
- Polaroid-style output with custom naming
- Curtain animation for dramatic reveal
- Download and share creations

### 5.  RPG Game System (UPCOMING)
- Text-based Python RPG adventure
- Character selection and customization
- Turn-based combat mechanics
- Inventory and progression system
- Quest and storyline integration

### 6. User Management
- Secure authentication and authorization
- Profile customization with avatars
- Email confirmation and security features
- User activity tracking

---

##  Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Django 5.1.7** - Python web framework
- **Django REST Framework** - RESTful API
- **PostgreSQL** - Relational database
- **psycopg2** - PostgreSQL adapter
- **Pillow** - Image processing

### External Services
- **OpenRouter API** - AI chat completions
- **Local Media Storage** - Image and file storage

---

##  Success Metrics

1. **User Engagement**
   - Daily active users (DAU)
   - Average session duration
   - Messages sent per user
   - Characters created per user

2. **Feature Adoption**
   - Photobooth usage rate
   - RPG game completion rate
   - Character creation rate
   - Social interactions (follows, shares)

3. **Technical Performance**
   - API response time < 500ms
   - AI response time < 3s
   - 99.9% uptime
   - Zero critical security vulnerabilities

4. **Growth Metrics**
   - Monthly active users (MAU) growth
   - User retention rate (30-day)
   - Community character library size
   - User-generated content rate

---

##  Development Roadmap

### Phase 1: MVP (Completed )
- User authentication and profiles
- Character CRUD operations
- Basic AI chat functionality
- Social follow system

### Phase 2: Enhanced Features (Current )
-  Photobooth image blending
-  RPG game system
-  Advanced character customization
-  Enhanced UI/UX improvements

### Phase 3: Community & Scale (Planned )
- Public character marketplace
- Advanced AI model selection
- Real-time notifications
- Mobile app development
- Advanced analytics dashboard

### Phase 4: Monetization (Future )
- Premium AI models
- Custom character voices
- Advanced features subscription
- Creator monetization tools

---

##  Competitive Advantages

1. **Open Character Creation** - Unlike competitors, anyone can create and share characters
2. **Multiple Creative Tools** - Photobooth and RPG features beyond just chat
3. **Community-Driven** - Social features encourage user engagement and content sharing
4. **Modern Tech Stack** - Fast, responsive, and scalable architecture
5. **Open AI Integration** - Flexibility to use multiple AI providers

---

##  Security & Privacy

- Secure token-based authentication
- Password hashing with Django's built-in security
- CORS protection and CSRF tokens
- Input validation and sanitization
- SQL injection protection via ORM
- Regular security audits and updates

---

## � Contact & Support

- **Repository**: [github.com/Zero123-star/JunoChat](https://github.com/Zero123-star/JunoChat)
- **Branch**: photobooth (current development)
- **License**: TBD
- **Contributors**: Welcome! See CONTRIBUTING.md

---

## Documentation

### For University Capstone Evaluation

- **[Deployment.md](Deployment.md)** - START HERE
  - Live application URL: https://talented-spontaneity-production.up.railway.app/
  - Railway deployment guide with cost breakdown
  - Local development setup instructions
  - Production troubleshooting

- **[Architecture.md](Architecture.md)** - REQUIRED
  - C4 System/Container/Component diagrams
  - Data flow diagrams (character display, authentication)
  - Technology stack details
  - Non-functional characteristics

- **[Security.md](Security.md)** - SECURITY DETAILS
  - Authentication & authorization implementation
  - OWASP Top 10 coverage
  - Data protection mechanisms
  - API security details

- **[Testing.md](Testing.md)** - TESTING & QA
  - Test coverage matrix
  - Production validation checklist
  - Manual smoke testing procedures
  - CI/CD workflow

- **[Demo Video](https://drive.google.com/file/d/1ACU5ZaR8D4o54at9JxEwARJfdpTKmDbQ/view?usp=sharing)** - LIVE DEMO
  - Full feature walkthrough
  - User registration and authentication
  - Character chat and creation
  - Image display and media serving

### General Documentation

- [Feature Specifications](FEATURES.md) - Detailed feature descriptions
- [User Stories](USER_STORIES.md) - User scenarios and acceptance criteria
- [Backlog](BACKLOG.md) - Development roadmap

---

## Quick Start for Evaluation

1. **View Live Application**: https://talented-spontaneity-production.up.railway.app/
   - Register new account with any email
   - Browse characters with avatars loaded
   - Chat with any character via OpenRouter API
   - Create your own character

2. **Review Architecture**: See [Architecture.md](Architecture.md)
   - C1: System Context Diagram
   - C2: Container Architecture (Frontend/Backend/DB)
   - C3: Component Diagram
   - Data Flow Diagrams

3. **Understand Deployment**: See [Deployment.md](Deployment.md)
   - Two services on Railway (backend + frontend)
   - Automatic CI/CD pipeline
   - Media file serving
   - Database migrations

4. **Security Assessment**: See [Security.md](Security.md)
   - Token-based authentication
   - HTTPS/CORS configuration
   - Password hashing (PBKDF2)
   - API key management

5. **Testing Details**: See [Testing.md](Testing.md)
   - Production validation checklist
   - Manual test procedures
   - Performance baselines

6. **Watch Demo**: See [Demo Video](https://drive.google.com/file/d/1ACU5ZaR8D4o54at9JxEwARJfdpTKmDbQ/view?usp=sharing)
   - Full feature walkthrough recorded on production

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready for Evaluation 
