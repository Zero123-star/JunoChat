# Software Engineering 2025-2026 - Project Documentation

## Documenting the Existing Application from MDS

**Course:** Software Engineering 2025-2026  
**Programme:** Informatics  
**Team:** JunoChat Development Team  
**Repository:** [https://github.com/Zero123-star/JunoChat](https://github.com/Zero123-star/JunoChat)  
**Branch:** photobooth  
**Date:** November 2, 2025

---

## Table of Contents

1. [Initial Project Requirements](#1-initial-project-requirements)
2. [User Stories Status](#2-user-stories-status)
3. [Team Description](#3-team-description)
4. [Software Architecture Report](#4-software-architecture-report)
5. [Documentation Links](#5-documentation-links)

---

## 1. Initial Project Requirements

### 1.1 List of Initial User Stories

The complete list of 40 initial user stories is documented in [USER_STORIES.md](./USER_STORIES.md). These stories are organized into 7 epics:

1. **Epic 1: User Management & Authentication** (5 stories)
2. **Epic 2: Character Management** (6 stories)
3. **Epic 3: AI Chat System** (6 stories)
4. **Epic 4: Social Features** (5 stories)
5. **Epic 5: Photobooth Feature** (5 stories)
6. **Epic 6: RPG Game System** (6 stories)
7. **Epic 7: Tags & Search** (2 stories)

### 1.2 Completed User Stories

**27 User Stories Completed (67.5% completion rate)**

#### Epic 1: User Management & Authentication (5/5 COMPLETED - 100%)
- US-1.1: User Registration
- US-1.2: User Login
- US-1.3: Email Confirmation
- US-1.4: Logout Functionality
- US-1.5: Profile Management

#### Epic 2: Character Management (6/6 COMPLETED - 100%)
- US-2.1: Character Creation
- US-2.2: Character Listing
- US-2.3: Character Details View
- US-2.4: Character Editing
- US-2.5: Character Deletion
- US-2.6: Character Search

#### Epic 3: AI Chat System (5/6 COMPLETED - 83%)
- US-3.1: Start New Chat (DONE)
- US-3.2: Send Messages (DONE)
- US-3.3: Receive AI Responses (DONE)
- US-3.4: View Chat History (DONE)
- US-3.5: Delete Chat (DONE)
- US-3.6: Delete Individual Messages (IN PROGRESS)

#### Epic 4: Social Features (3/5 COMPLETED - 60%)
- US-4.1: Follow Users (DONE)
- US-4.2: Unfollow Users (DONE)
- US-4.3: User Search (DONE)
- US-4.4: View Followers (IN PROGRESS)
- US-4.5: View Following (IN PROGRESS)

#### Epic 5: Photobooth Feature (5/5 COMPLETED - 100%)
- US-5.1: Access Photobooth
- US-5.2: Upload Images
- US-5.3: Blend Images
- US-5.4: Download Result
- US-5.5: Reset Photobooth

#### Epic 7: Tags & Search (1/2 COMPLETED - 50%)
- US-7.1: Tag Characters (DONE)
- US-7.2: Filter by Tags (IN PROGRESS)

---

### 1.3 Incomplete User Stories Analysis

#### US-3.6: Delete Individual Messages (IN PROGRESS)

**Priority:** SHOULD HAVE  
**Story Points:** 2  
**Status:** Partially implemented

**I. Why the User Story wasn't achieved:**
- Backend API endpoint exists and functions correctly
- Frontend implementation is incomplete
- Message deletion causes UI state inconsistencies
- Message numbering doesn't automatically update after deletion
- Focus was prioritized on completing Photobooth feature for intermediate deliverable

**II. Should it be developed in the following phase?**
Yes. This is a critical user experience feature that affects chat management. Users need the ability to remove individual messages for privacy and conversation clarity.

**III. Tactics to ensure achievement:**
- Allocate 2 story points in Sprint 4
- Implement optimistic UI updates with rollback on error
- Add WebSocket support for real-time message deletion synchronization
- Implement automatic message renumbering logic
- Add comprehensive unit tests for message deletion scenarios
- Use React Context or state management library (Zustand/Redux) for better state handling

---

#### US-4.4: View Followers (IN PROGRESS)

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:** Backend complete, frontend UI pending

**I. Why the User Story wasn't achieved:**
- Backend Follow model and API endpoints are fully functional
- Frontend lacks dedicated followers list page/modal
- UI design for followers list not finalized
- Time constraints prioritized core chat functionality

**II. Should it be developed in the following phase?**
Yes. Social features enhance user engagement and community building, which are core to the platform's value proposition.

**III. Tactics to ensure achievement:**
- Create reusable FollowersList component
- Implement modal or dedicated page for followers view
- Add pagination for large follower lists
- Include real-time follower count updates
- Design consistent with existing UI patterns
- Allocate to Sprint 4 with 3 story points

---

#### US-4.5: View Following (IN PROGRESS)

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:** Backend complete, frontend UI pending

**I. Why the User Story wasn't achieved:**
- Same reasons as US-4.4
- Backend infrastructure fully supports this feature
- Requires minimal additional work once US-4.4 is complete

**II. Should it be developed in the following phase?**
Yes. Complements US-4.4 and provides complete social network functionality.

**III. Tactics to ensure achievement:**
- Reuse FollowersList component with minor modifications
- Implement tab-based interface (Followers | Following)
- Share backend API patterns with US-4.4
- Test both features together for consistency
- Complete immediately after US-4.4 in Sprint 4

---

#### US-7.2: Filter Characters by Tags (IN PROGRESS)

**Priority:** SHOULD HAVE  
**Story Points:** 4  
**Status:** Partially implemented

**I. Why the User Story wasn't achieved:**
- Tag creation and assignment to characters works correctly
- Frontend tag filter UI exists but has bugs
- Backend filtering endpoint needs optimization for multiple tag queries
- Search algorithm needs refinement for better UX
- Not critical for MVP functionality

**II. Should it be developed in the following phase?**
Yes. As the character database grows, filtering becomes essential for discoverability.

**III. Tactics to ensure achievement:**
- Implement multi-select tag filter component
- Add "AND" vs "OR" logic for multiple tags
- Optimize database queries with proper indexing
- Add tag autocomplete for better UX
- Include tag popularity indicators
- Allocate 4 story points in Sprint 4

---

#### Epic 6: RPG Game System (0/6 PLANNED - 0%)

All 6 user stories in this epic are in PLANNED status:
- US-6.1: Create RPG Character
- US-6.2: Engage in Combat
- US-6.3: Manage Inventory
- US-6.4: Complete Quests
- US-6.5: Level Up System
- US-6.6: Save Game Progress

**I. Why the Epic wasn't achieved:**
- RPG system is a new feature planned for future development
- Requires significant backend Python development (separate service)
- Needs game design documentation and balancing
- Not part of original MDS project scope
- Lower priority than core chat functionality
- Requires 27 story points total (large epic)

**II. Should it be developed in the following phase?**
Yes, but incrementally. RPG system will differentiate JunoChat from competitors and increase user engagement significantly.

**III. Tactics to ensure achievement:**
- Break down into smaller, deliverable increments
- Start with US-6.1 and US-6.6 (character creation + save system) in Sprint 4
- Develop game design document first (Sprint 4)
- Create Python-based game engine as microservice
- Implement turn-based combat system (US-6.2) in Sprint 5
- Add inventory and quests in later sprints
- Consider using existing Python game libraries (pygame, arcade)
- Run parallel development: one developer on RPG while team maintains core features

---

## 2. User Stories Status

### 2.1 Summary Statistics

| Status | Count | Percentage |
|--------|-------|------------|
| DONE | 27 | 67.5% |
| IN PROGRESS | 3 | 7.5% |
| PLANNED | 10 | 25.0% |
| **TOTAL** | **40** | **100%** |

### 2.2 By Epic

| Epic | Completed | In Progress | Planned | Total | % Complete |
|------|-----------|-------------|---------|-------|------------|
| User Management | 5 | 0 | 0 | 5 | 100% |
| Character Management | 6 | 0 | 0 | 6 | 100% |
| AI Chat System | 5 | 1 | 0 | 6 | 83% |
| Social Features | 3 | 2 | 0 | 5 | 60% |
| Photobooth | 5 | 0 | 0 | 5 | 100% |
| RPG Game | 0 | 0 | 6 | 6 | 0% |
| Tags & Search | 1 | 1 | 0 | 2 | 50% |

### 2.3 By Priority (MoSCoW)

| Priority | Completed | Remaining | % Complete |
|----------|-----------|-----------|------------|
| MUST HAVE | 19 | 4 | 83% |
| SHOULD HAVE | 6 | 4 | 60% |
| COULD HAVE | 2 | 6 | 25% |

**Detailed documentation:** [USER_STORIES.md](./USER_STORIES.md)

---

## 3. Team Description

### 3.1 MDS Project Team Members

| Name | Role | Responsibilities | Status for SE Course |
|------|------|------------------|---------------------|
| Ingrid Corobana | Full-Stack Developer / Team Lead | - Overall project coordination<br>- Frontend development (React, TypeScript)<br>- Backend development (Django, DRF)<br>- Database design<br>- Photobooth feature implementation<br>- Documentation | Continuing |
| [Team Member 2] | Frontend Developer | - React component development<br>- UI/UX implementation<br>- State management<br>- API integration | TBD |
| [Team Member 3] | Backend Developer | - Django REST API development<br>- Database modeling<br>- Authentication system<br>- OpenRouter AI integration | TBD |
| [Team Member 4] | Designer / QA | - UI/UX design<br>- Testing and quality assurance<br>- User acceptance testing<br>- Documentation review | TBD |

### 3.2 Roles and Responsibilities

#### Full-Stack Developer / Team Lead
- **Responsibilities:**
  - Sprint planning and backlog management
  - Architecture decisions and technical leadership
  - Code review and merge approvals
  - Stakeholder communication
  - Both frontend and backend development
  - DevOps and deployment

#### Frontend Developer
- **Responsibilities:**
  - React component development
  - TypeScript implementation
  - State management (Context API, potential Redux/Zustand)
  - Responsive design implementation
  - Integration with backend APIs
  - Frontend testing

#### Backend Developer
- **Responsibilities:**
  - Django REST API development
  - Database schema design and migrations
  - Authentication and authorization
  - External API integrations (OpenRouter)
  - Backend testing
  - Performance optimization

#### Designer / QA
- **Responsibilities:**
  - UI/UX design and prototyping
  - User research and testing
  - Quality assurance testing
  - Bug reporting and tracking
  - Documentation and user guides

### 3.3 Predicted Changes for SE Course

**Expected Team Evolution:**
- Team may expand if RPG feature requires additional Python/game development expertise
- DevOps role may be separated as deployment complexity increases
- Possible addition of dedicated QA engineer for automated testing
- Frontend team may need strengthening for RPG UI complexity

**Role Modifications:**
- Team Lead will focus more on architecture and less on implementation
- Backend developer may specialize in microservices (RPG game service)
- Frontend developer may need to learn Canvas API for RPG graphics

---

## 4. Software Architecture Report

### 4.1 Architectural Decisions

#### 4.1.1 High-Level Architecture

**Decision:** Monolithic backend with separate frontend (traditional client-server architecture)

**Rationale:**
- Simplifies development for small team
- Easier to deploy and maintain initially
- Clear separation of concerns
- RESTful API allows future mobile app development

**Effectiveness:**
- **Successful:** Clear boundaries between frontend and backend
- **Challenge:** Some API endpoints became bloated with multiple responsibilities
- **Learning:** Consider microservices for RPG system to avoid further monolith growth

**Diagram Reference:** See [DIAGRAM.md - High-Level Architecture](./DIAGRAM.md#1-high-level-architecture)

---

#### 4.1.2 Database Design

**Decision:** PostgreSQL relational database with Django ORM

**Rationale:**
- ACID compliance for data integrity
- Strong support for complex queries
- Django ORM provides excellent abstraction
- Battle-tested in production environments

**Effectiveness:**
- **Successful:** Clean data models with proper relationships
- **Successful:** Migration system worked well for schema evolution
- **Challenge:** N+1 query problems in chat history loading
- **Solution Implemented:** Added `select_related()` and `prefetch_related()` optimizations

**Key Models:**
- CustomUser (authentication)
- Character (AI personalities)
- Chat (conversation container)
- Message (individual messages)
- Follow (social network)
- Tag (categorization)

**Diagram Reference:** See [DIAGRAM.md - Entity Relationship Diagram](./DIAGRAM.md#2-entity-relationship-diagram-erd)

---

#### 4.1.3 Frontend Architecture

**Decision:** React with TypeScript, component-based architecture

**Rationale:**
- React's virtual DOM for performance
- TypeScript for type safety and better IDE support
- Component reusability
- Large ecosystem and community support

**Effectiveness:**
- **Successful:** Reusable components (GlassmorphicContainer, Navbar, etc.)
- **Successful:** TypeScript caught many bugs during development
- **Challenge:** Prop drilling in deeply nested components
- **Future Improvement:** Implement Context API or Zustand for global state

**Component Structure:**
```
src/
├── components/        # Reusable UI components
│   ├── Navbar.tsx
│   ├── GlassmorphicContainer.tsx
│   └── ...
├── pages/            # Route-based pages
│   ├── HomePage.tsx
│   ├── ChatsPage.tsx
│   ├── CharactersPage.tsx
│   └── PhotoboothPage.tsx
├── api.ts            # API service layer
└── types/            # TypeScript type definitions
```

**Diagram Reference:** See [DIAGRAM.md - Frontend Component Hierarchy](./DIAGRAM.md#4-frontend-component-hierarchy)

---

#### 4.1.4 Authentication Strategy

**Decision:** Token-based authentication with Django REST Framework

**Rationale:**
- Stateless authentication for scalability
- Tokens can be stored in localStorage
- DRF provides robust token management
- Easy to implement and secure

**Effectiveness:**
- **Successful:** Secure authentication flow
- **Successful:** Token expiration and refresh working correctly
- **Challenge:** Email confirmation system needed custom implementation
- **Security Note:** HTTPS required for production to protect tokens

**Flow:**
1. User registers → Email confirmation sent
2. User confirms email → Account activated
3. User logs in → Token generated and returned
4. Frontend stores token → Included in all API requests
5. Token expires → User must re-authenticate

**Diagram Reference:** See [DIAGRAM.md - Authentication Flow Sequence](./DIAGRAM.md#6-authentication-flow-sequence)

---

### 4.2 Technologies Used

#### 4.2.1 Frontend Stack

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| React | 18.x | UI Framework | Industry standard, component-based, large ecosystem |
| TypeScript | 5.x | Type Safety | Catch errors at compile-time, better IDE support |
| Vite | 5.x | Build Tool | Fast HMR, modern ES modules, optimized builds |
| TailwindCSS | 3.x | Styling | Utility-first, rapid development, consistent design |
| React Router | 6.x | Routing | Standard routing solution for React SPAs |
| Axios | 1.x | HTTP Client | Promise-based, interceptors, better error handling |
| Lucide React | - | Icons | Modern icon set, tree-shakeable, lightweight |
| Sonner | - | Notifications | Beautiful toast notifications, easy integration |

**Why This Stack:**
- **Developer Experience:** Fast development with hot reload and TypeScript
- **Performance:** Vite provides instant server start and optimized production builds
- **Maintainability:** TypeScript reduces bugs and improves code documentation
- **UI Consistency:** TailwindCSS ensures consistent spacing and design system

---

#### 4.2.2 Backend Stack

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| Python | 3.13 | Language | Readable, extensive libraries, team expertise |
| Django | 5.1.7 | Web Framework | Batteries included, ORM, admin panel, security |
| Django REST Framework | 3.x | API Framework | Serialization, authentication, browsable API |
| PostgreSQL | 14+ | Database | ACID compliant, robust, scalable, JSON support |
| psycopg2 | 2.x | DB Adapter | PostgreSQL adapter for Python |
| Pillow | 10.x | Image Processing | Avatar upload and processing |
| Requests | 2.x | HTTP Client | External API calls (OpenRouter) |

**Why This Stack:**
- **Rapid Development:** Django's "batteries included" philosophy accelerates development
- **Security:** Built-in protection against SQL injection, XSS, CSRF
- **Scalability:** PostgreSQL handles millions of records efficiently
- **Ecosystem:** Large library ecosystem for future features

---

#### 4.2.3 External Services

| Service | Purpose | Why Chosen |
|---------|---------|------------|
| OpenRouter API | AI Chat Completions | Access to multiple LLM models, cost-effective, no vendor lock-in |
| Git/GitHub | Version Control | Industry standard, collaboration, CI/CD integration |

---

### 4.3 Architectural Patterns Implemented

#### 4.3.1 MVC Pattern (Backend)

**Implementation:** Django follows Model-View-Controller pattern
- **Models:** Data layer (models.py)
- **Views:** Business logic (views.py)
- **Templates:** Not used (API-only backend)
- **Serializers:** Data transformation layer (DRF addition)

**Effectiveness:**
- **Appropriate:** Yes, excellent separation of concerns
- **Benefits:** Easy to test, maintain, and extend
- **Example:** Character CRUD operations cleanly separated across layers

---

#### 4.3.2 RESTful API Design

**Implementation:** Django REST Framework with resource-based endpoints

**Endpoints Structure:**
```
POST   /api/register/           # User registration
POST   /api/login/              # User authentication
GET    /api/characters/         # List characters
POST   /api/characters/         # Create character
GET    /api/characters/{id}/    # Get character details
PUT    /api/characters/{id}/    # Update character
DELETE /api/characters/{id}/    # Delete character
GET    /api/chats/              # List user's chats
POST   /api/chats/              # Start new chat
GET    /api/messages/{chat_id}/ # Get chat messages
POST   /api/messages/           # Send message
```

**Effectiveness:**
- **Appropriate:** Yes, standard REST conventions followed
- **Benefits:** Predictable API, easy to document, cacheable
- **Challenge:** Some endpoints needed custom actions beyond CRUD

---

#### 4.3.3 Repository Pattern (Frontend)

**Implementation:** Centralized API service layer (api.ts)

**Structure:**
```typescript
// api.ts - All API calls in one place
export const loginUser = async (credentials) => {...}
export const getCharacters = async () => {...}
export const sendMessage = async (chatId, message) => {...}
```

**Effectiveness:**
- **Appropriate:** Yes, separates data access from UI components
- **Benefits:** Easy to mock for testing, consistent error handling
- **Improvement Needed:** Add request/response interceptors for token refresh

---

#### 4.3.4 Component Pattern (Frontend)

**Implementation:** Reusable React components with props and composition

**Example:**
```typescript
<GlassmorphicContainer>
  <Navbar />
  <CharacterList characters={characters} />
</GlassmorphicContainer>
```

**Effectiveness:**
- **Appropriate:** Yes, promotes code reuse and maintainability
- **Benefits:** Consistent UI, easier testing, faster development
- **Success Story:** GlassmorphicContainer used across 8 different pages

---

#### 4.3.5 Factory Pattern

**Implementation:** Django model managers for complex queries

**Example:**
```python
class CharacterManager(models.Manager):
    def get_by_creator(self, user):
        return self.filter(creator=user)
    
    def get_popular(self):
        return self.annotate(chat_count=Count('chat')).order_by('-chat_count')
```

**Effectiveness:**
- **Appropriate:** Yes, encapsulates query logic
- **Benefits:** DRY principle, easier to test and maintain

---

### 4.4 Coding Principles and Standards

#### 4.4.1 Code Quality Tools

**ESLint (Frontend):**
- **Configured:** Yes (eslint.config.js)
- **Rules Enforced:**
  - TypeScript strict mode
  - React hooks rules
  - No unused variables
  - Consistent formatting
- **Compliance:** 85% adherence
- **Issues:** Some quick fixes bypassed linting for demo deadlines

**Black (Backend - Planned):**
- **Status:** Not yet implemented
- **Action Item:** Add Python formatting in Sprint 4

---

#### 4.4.2 Coding Standards Applied

**TypeScript Best Practices:**
- ✅ Explicit return types on functions
- ✅ Interface definitions for all props
- ✅ No `any` types (strict mode enabled)
- ⚠️ Some prop drilling could be avoided

**Python Best Practices:**
- ✅ PEP 8 naming conventions
- ✅ Docstrings for complex functions
- ✅ Type hints on function signatures
- ⚠️ Some files exceed 300 lines (refactoring needed)

**Django Best Practices:**
- ✅ Model validation in clean() methods
- ✅ Custom managers for complex queries
- ✅ Serializer validation
- ✅ Atomic transactions for multi-model operations

---

#### 4.4.3 Version Control Practices

**Git Workflow:**
- Feature branches for new development
- Descriptive commit messages
- Pull requests for major changes (recommended, not always followed)

**Commit Message Convention:**
```
Add Photobooth feature with image blending
- Implement curtain animation
- Add dual image upload
- Create polaroid-style output
```

**Effectiveness:**
- **Successful:** Clear history of feature development
- **Challenge:** Some commits were too large (multiple features)
- **Improvement:** Adopt conventional commits (feat:, fix:, docs:)

---

### 4.5 Discovered Faults and Issues

#### 4.5.1 Critical Issues (Must Fix)

**None remaining** - All critical bugs resolved before MDS delivery.

---

#### 4.5.2 High Priority Issues

**1. Message Deletion Bug (Issue #86)**
- **Description:** Deleting a message doesn't properly update the UI state
- **Impact:** Confusing UX, requires page refresh
- **Status:** IN PROGRESS
- **Timeline:** Fix in Sprint 4
- **Root Cause:** React state not synchronized with backend after deletion

**2. N+1 Query Problem in Chat History**
- **Description:** Loading chat messages makes multiple database queries
- **Impact:** Performance degradation with large chat histories
- **Status:** Partially addressed with select_related()
- **Timeline:** Further optimization in Sprint 4
- **Solution:** Implement pagination and query optimization

---

#### 4.5.3 Medium Priority Issues

**3. Character Avatar Update Lag (Issue #87)**
- **Description:** Avatar doesn't update immediately after upload
- **Impact:** Minor UX issue
- **Status:** TODO
- **Root Cause:** Frontend caching issue
- **Solution:** Implement cache-busting with query parameters

**4. Follow Button State Inconsistency (Issue #88)**
- **Description:** Follow button sometimes shows incorrect state
- **Impact:** User confusion
- **Status:** TODO
- **Root Cause:** Optimistic UI updates without proper error rollback
- **Solution:** Implement proper error handling and state synchronization

---

#### 4.5.4 Low Priority Issues

**5. Navbar Overlap on Small Screens (Issue #89)**
- **Description:** Minor UI layout issue on mobile devices
- **Impact:** Aesthetic only
- **Status:** TODO
- **Timeline:** Sprint 5 (polish phase)

---

### 4.6 Refactoring Needs

#### 4.6.1 High Priority Refactoring

**1. API Service Layer (Issue #90)**
- **Current State:** All API calls in single api.ts file (500+ lines)
- **Problem:** Hard to maintain, find specific endpoints
- **Proposed Solution:**
  ```typescript
  services/
  ├── auth.service.ts
  ├── character.service.ts
  ├── chat.service.ts
  ├── social.service.ts
  └── index.ts
  ```
- **Priority:** P1
- **Story Points:** 5

**2. Chat Page Component (Frontend)**
- **Current State:** Single large component (400+ lines)
- **Problem:** Difficult to test, maintain
- **Proposed Solution:** Break into smaller components:
  - ChatHeader
  - MessageList
  - MessageInput
  - ChatSidebar
- **Priority:** P1
- **Story Points:** 3

**3. Views.py in Backend API**
- **Current State:** All view logic in single file (600+ lines)
- **Problem:** Hard to navigate, merge conflicts
- **Proposed Solution:** Split into separate files:
  ```python
  views/
  ├── __init__.py
  ├── auth_views.py
  ├── character_views.py
  ├── chat_views.py
  └── social_views.py
  ```
- **Priority:** P2
- **Story Points:** 5

---

#### 4.6.2 Code Smell Identification

**1. Prop Drilling in Character Pages**
- **Smell:** Passing props through 3+ component levels
- **Solution:** Implement React Context or Zustand for character state

**2. Duplicate Code in Serializers**
- **Smell:** Similar validation logic repeated across serializers
- **Solution:** Create base serializer classes with common validation

**3. Hard-coded URLs**
- **Smell:** API URLs written directly in components
- **Solution:** Centralize in environment configuration

---

#### 4.6.3 Technical Debt Items

See [BACKLOG.md - Technical Debt Section](./BACKLOG.md#-technical-debt) for complete list:

| ID | Issue | Priority | Points |
|----|-------|----------|--------|
| #90 | Refactor API service layer | P2 | 5 |
| #91 | Add unit tests for components | P1 | 8 |
| #92 | Optimize database queries | P1 | 5 |
| #93 | Implement error boundaries | P2 | 3 |
| #94 | Add API rate limiting | P1 | 3 |
| #95 | Setup CI/CD pipeline | P2 | 8 |

**Total Technical Debt:** 32 story points

---

### 4.7 Architectural Diagrams

All architectural diagrams are maintained in [DIAGRAM.md](./DIAGRAM.md):

1. **High-Level Architecture** - System overview
2. **Entity Relationship Diagram** - Database schema
3. **Backend Models UML** - Django model relationships
4. **Frontend Component Hierarchy** - React component structure
5. **Chat Flow Sequence** - Message sending process
6. **Authentication Flow Sequence** - Login/register flow
7. **User Journey State Diagram** - User flow through app
8. **Technology Stack Diagram** - All technologies used
9. **System Layers** - Architectural layers
10. **Core Features Overview** - Feature organization
11. **Comprehensive UML Class Diagram** - Complete system design

---

### 4.8 Effectiveness Summary

#### What Worked Well
✅ Clean separation between frontend and backend  
✅ TypeScript prevented numerous runtime errors  
✅ Django ORM simplified database operations  
✅ Component-based architecture enabled rapid UI development  
✅ RESTful API design made integration straightforward  
✅ Git branching strategy allowed parallel feature development  

#### What Needs Improvement
⚠️ State management in frontend (prop drilling issues)  
⚠️ Test coverage (currently minimal, needs expansion)  
⚠️ Code organization (some files too large)  
⚠️ Documentation (needs more inline comments)  
⚠️ Performance optimization (query optimization needed)  
⚠️ Error handling (needs more robust error boundaries)  

#### Lessons Learned
1. **Plan for state management early** - Prop drilling became painful
2. **Write tests from the start** - Adding tests later is harder
3. **Keep files small** - Large files are hard to maintain
4. **Document as you go** - Retroactive documentation is time-consuming
5. **Optimize queries early** - N+1 problems compound over time
6. **Use linting consistently** - Code quality degrades without enforcement

---

## 5. Documentation Links

### 5.1 Core Documentation

| Document | Description | Link |
|----------|-------------|------|
| **README.md** | Product vision, features, tech stack, roadmap | [README.md](./README.md) |
| **FEATURES.md** | Detailed feature specifications with scenarios | [FEATURES.md](./FEATURES.md) |
| **USER_STORIES.md** | 40 user stories with acceptance criteria | [USER_STORIES.md](./USER_STORIES.md) |
| **BACKLOG.md** | Prioritized product backlog and sprint planning | [BACKLOG.md](./BACKLOG.md) |
| **DIAGRAM.md** | UML and architectural diagrams | [DIAGRAM.md](./DIAGRAM.md) |

---

### 5.2 Repository Information

**GitHub Repository:** [https://github.com/Zero123-star/JunoChat](https://github.com/Zero123-star/JunoChat)  
**Branch for SE Course:** `photobooth`  
**Branch for Production:** `main`

**Clone Command:**
```bash
git clone git@github.com:Zero123-star/JunoChat.git
cd JunoChat
git checkout photobooth
```

---

### 5.3 Quick Navigation

**Project Overview:**
- [Product Vision](./README.md#product-vision)
- [Key Features](./README.md#key-features)
- [Technology Stack](./README.md#technology-stack)

**Development:**
- [User Stories](./USER_STORIES.md)
- [Sprint Planning](./BACKLOG.md#current-sprint)
- [Technical Debt](./BACKLOG.md#technical-debt)

**Architecture:**
- [High-Level Architecture](./DIAGRAM.md#1-high-level-architecture)
- [Database Schema](./DIAGRAM.md#2-entity-relationship-diagram-erd)
- [UML Class Diagram](./DIAGRAM.md#11-comprehensive-uml-class-diagram)

**Features:**
- [Authentication System](./FEATURES.md#f1-user-authentication--management)
- [Character Management](./FEATURES.md#f2-character-management)
- [AI Chat System](./FEATURES.md#f3-ai-chat-system)
- [Photobooth Feature](./FEATURES.md#f5-photobooth-new)
- [RPG Game (Planned)](./FEATURES.md#f6-rpg-game-system-upcoming)

---

## 6. Appendix

### 6.1 Project Statistics

**Code Metrics:**
- Total Lines of Code: ~8,000
- Frontend: ~4,500 lines (TypeScript/TSX)
- Backend: ~3,500 lines (Python)
- Components: 15+
- API Endpoints: 25+
- Database Tables: 7

**Development Metrics:**
- Total Commits: 50+
- Development Time: 8 weeks (MDS course)
- Team Size: 4 developers
- Sprints Completed: 3
- User Stories Completed: 27/40 (67.5%)

---

### 6.2 Contact Information

**Team Lead:** Ingrid Corobana  
**Course:** Software Engineering 2025-2026  
**Programme:** Informatics  
**Institution:** [University Name]  

---

**Document Version:** 1.0  
**Last Updated:** November 2, 2025  
**Next Review:** Start of Software Engineering course semester
