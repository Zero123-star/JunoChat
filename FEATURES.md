# Product Features & Scenarios

## Feature List

This document outlines all product features, scenarios, and detailed specifications for JunoChat.

---

## F1: User Authentication & Authorization

### Description
Secure user registration, login, and session management system.

### User Scenarios

**Scenario 1.1: New User Registration**
- User navigates to signup page
- Fills in username, email, and password
- Receives confirmation email
- Confirms email and activates account

**Scenario 1.2: User Login**
- User enters credentials on login page
- System validates and generates authentication token
- User is redirected to home page
- Token is stored in localStorage for subsequent requests

**Scenario 1.3: User Logout**
- User clicks logout button
- System clears authentication token
- User is redirected to login page

### Acceptance Criteria
-  Passwords are hashed and never stored in plain text
-  Invalid credentials show appropriate error messages
-  Session persists across browser refreshes
-  Token expires after inactivity period
-  Email confirmation required for account activation

---

## F2: Character Management System

### Description
CRUD operations for AI characters with avatar upload and tagging.

### User Scenarios

**Scenario 2.1: Browse Characters**
- User navigates to Characters page
- System displays grid of all available characters
- User can see character name, avatar, and description
- User can filter by tags

**Scenario 2.2: Create New Character**
- Authenticated user clicks "New Character"
- Fills character form (name, description, source)
- Uploads character avatar image
- Adds relevant tags
- Submits and character is created

**Scenario 2.3: Edit Existing Character**
- User navigates to their character
- Clicks edit button
- Modifies character details
- Saves changes

**Scenario 2.4: Delete Character**
- User selects their character
- Clicks delete button
- Confirms deletion
- Character and associated chats are removed

### Acceptance Criteria
-  Only character creator can edit/delete their characters
-  Avatar images are validated (format, size)
-  Character names have length limits (max 50 chars)
-  Tags are reusable across multiple characters
-  Deleted characters cascade delete their chats

---

## F3: AI Chat System

### Description
Real-time conversation system with AI-powered characters using OpenRouter API.

### User Scenarios

**Scenario 3.1: Start New Chat**
- User selects a character from Characters page
- Clicks "Chat" button
- New chat session is created
- User is taken to chat interface

**Scenario 3.2: Send Message**
- User types message in input field
- Presses send button or Enter key
- Message is displayed immediately
- AI processes message and responds
- Bot response appears in conversation

**Scenario 3.3: View Chat History**
- User navigates to Chats page
- Sees list of all previous chat sessions
- Clicks on a chat to resume conversation
- Full message history is loaded

**Scenario 3.4: Continue Conversation**
- User opens existing chat
- Scrolls through previous messages
- Sends new message
- Conversation context is maintained

### Acceptance Criteria
-  Messages are displayed in chronological order
-  User and bot messages are visually distinct
-  AI responses appear within 3 seconds
-  Long conversations are paginated
-  Chat history persists across sessions
-  Error handling for AI service failures

---

## F4: Social Features & User Profiles

### Description
User profile management, follow system, and social discovery.

### User Scenarios

**Scenario 4.1: View User Profile**
- User clicks on username anywhere in app
- Profile page shows user info, avatar, and stats
- Displays user's created characters
- Shows follower/following counts

**Scenario 4.2: Follow User**
- User views another user's profile
- Clicks "Follow" button
- Follow relationship is created
- Button changes to "Unfollow"

**Scenario 4.3: Search Users**
- User navigates to Search Users page
- Enters search query
- System returns matching users
- User can view profiles and follow

**Scenario 4.4: Edit Own Profile**
- User navigates to their profile
- Clicks edit button
- Updates avatar, bio, or other info
- Saves changes

### Acceptance Criteria
-  Users cannot follow themselves
-  Follow/unfollow is instant
-  Follower counts update in real-time
-  Search is case-insensitive
-  Profile images are resized/optimized
-  Users can view their followers and following lists

---

## F5:  Photobooth Feature (NEW)

### Description
Creative image blending tool that merges user photo with character image to create a "magical combination."

### User Scenarios

**Scenario 5.1: Access Photobooth**
- User clicks "Photobooth" in navigation
- Curtain animation plays (dramatic reveal)
- Photobooth interface is displayed
- Background shows photobooth-themed image

**Scenario 5.2: Upload Images**
- User clicks first upload area
- Selects their photo from device
- Preview displays immediately
- User clicks second upload area
- Selects character/favorite person photo
- Preview displays for second image

**Scenario 5.3: Create Merged Image**
- User enters creative name for creation
- Clicks "Create Magic" button
- System blends images at 50% opacity
- Processing animation displays
- Polaroid-style result appears

**Scenario 5.4: Download Creation**
- User views merged image
- Image shows custom name and date
- User clicks "Download Photo"
- PNG file downloads to device
- User can create another or share

### Acceptance Criteria
-  Accepts common image formats (JPG, PNG)
-  Images are validated for size (max 5MB)
-  Blending happens client-side (no server upload)
-  Curtain animation plays smoothly
-  Polaroid design includes name and timestamp
-  Download preserves image quality
-  User can reset and create multiple images
-  Works on mobile and desktop

### Technical Implementation
- Canvas API for image manipulation
- 50% opacity blend mode
- Client-side processing (no backend required)
- Responsive design for all screen sizes

---

## F6:  RPG Game System (UPCOMING)

### Description
Text-based Python RPG adventure game integrated into the platform where users can play as their favorite characters.

### User Scenarios

**Scenario 6.1: Start RPG Game**
- User navigates to RPG section
- Views available game modes/quests
- Selects character to play as
- Game intro narrative displays
- User enters game world

**Scenario 6.2: Combat System**
- Player encounters enemy
- Turn-based combat begins
- User selects action (attack, defend, special ability)
- Damage calculations display
- Combat continues until victory or defeat

**Scenario 6.3: Inventory Management**
- User opens inventory menu
- Views collected items and equipment
- Uses consumables (health potions, etc.)
- Equips weapons or armor
- Sees stat changes

**Scenario 6.4: Quest Progression**
- User accepts quest from NPC
- Quest objectives display in log
- User completes quest tasks
- Returns to NPC for reward
- Experience and items gained

**Scenario 6.5: Character Progression**
- User gains experience from battles
- Levels up and chooses stat upgrades
- Unlocks new abilities
- Saves progress automatically

**Scenario 6.6: Save/Load Game**
- Game auto-saves at checkpoints
- User can manually save progress
- User can load previous save
- Multiple save slots available

### Acceptance Criteria
- � Turn-based combat with clear action options
- � Character stats (HP, Attack, Defense, Speed)
- � Inventory system with item limits
- � At least 3 enemy types with unique behaviors
- � Experience and leveling system
- � Save/load functionality
- � Multiple quests with branching paths
- � Integration with existing character system
- � Python backend for game logic
- � Real-time UI updates in frontend

### Technical Implementation
```python
# RPG Game Architecture
- Python backend service
- Game state management
- Turn-based logic engine
- Random encounter system
- Item/equipment database
- Experience calculation algorithms
- Save state serialization
```

---

## F7: Tag System

### Description
Categorization and filtering system for characters.

### User Scenarios

**Scenario 7.1: Add Tags to Character**
- User creates/edits character
- Types tag name in tag field
- Presses Enter to add tag
- Tag appears as chip/badge
- Multiple tags can be added

**Scenario 7.2: Filter by Tags**
- User views Characters page
- Clicks on tag filter
- Selects desired tags
- Character list filters in real-time
- Shows only matching characters

### Acceptance Criteria
-  Tags are reusable across platform
-  Tag names are unique (case-insensitive)
-  Multiple tags can be applied per character
-  Tags display as colored badges
-  Easy to add/remove tags

---

## F8: Message Management

### Description
CRUD operations for chat messages with ordering and numbering.

### User Scenarios

**Scenario 8.1: View Messages**
- User opens chat
- Messages display in order
- Each message shows sender and timestamp
- User can scroll through history

**Scenario 8.2: Delete Message**
- User clicks delete on their message
- Confirmation prompt appears
- Message is removed
- Message numbers are reordered

### Acceptance Criteria
-  Messages numbered sequentially per chat
-  Deletion reorders subsequent messages
-  Timestamps in user's timezone
-  Bot messages cannot be deleted by users
-  Message history persists

---

## Non-Functional Requirements

### Performance
- Page load time < 2 seconds
- API response time < 500ms
- AI response time < 3 seconds
- Image upload < 5 seconds
- Support 100+ concurrent users

### Security
- HTTPS for all communications
- Token-based authentication
- CSRF protection
- XSS prevention
- SQL injection protection
- Rate limiting on API endpoints

### Usability
- Responsive design (mobile, tablet, desktop)
- Intuitive navigation
- Clear error messages
- Accessibility compliance (WCAG 2.1)
- Multi-language support (future)

### Scalability
- Horizontal scaling capability
- Database query optimization
- CDN for static assets
- Caching strategy
- Load balancing ready

### Reliability
- 99.9% uptime SLA
- Automated backups (daily)
- Error logging and monitoring
- Graceful degradation
- Disaster recovery plan

---

## Future Feature Considerations

### Short Term (Next 3 months)
-  Voice chat with characters
-  Character personality customization
-  Advanced RPG features (multiplayer)
-  Mobile app (React Native)

### Medium Term (6 months)
-  Character marketplace
-  Premium AI models
-  Real-time notifications
-  Character animation/expressions

### Long Term (1 year+)
-  3D character avatars
-  VR chat experience
-  Character voice synthesis
-  Blockchain character NFTs

---

**Document Version**: 1.0  
**Last Updated**: November 2, 2025  
**Status**: Active Development
