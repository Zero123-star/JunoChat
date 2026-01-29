# User Stories & Acceptance Criteria

## Overview

This document contains all user stories organized by epic/feature area, following the format:
**As a [type of user], I want [goal] so that [benefit].**

---

## Epic 1: User Management & Authentication

### US-1.1: User Registration
**As a** new visitor  
**I want to** create an account with username, email, and password  
**So that** I can access the platform and save my data  

**Acceptance Criteria:**
- [ ] Registration form has username, email, password, and confirm password fields
- [ ] Username must be unique and 3-20 characters
- [ ] Email must be valid format and unique
- [ ] Password must be minimum 8 characters
- [ ] Confirmation email is sent after registration
- [ ] Account is inactive until email is confirmed
- [ ] Error messages display for validation failures
- [ ] Success message shown after registration

**Priority:** MUST HAVE  
**Story Points:** 5  
**Status:** DONE

---

### US-1.2: User Login
**As a** registered user  
**I want to** log in with my credentials  
**So that** I can access my personalized content  

**Acceptance Criteria:**
- [ ] Login form accepts username/email and password
- [ ] Valid credentials generate authentication token
- [ ] Token is stored securely in localStorage
- [ ] User is redirected to home page after login
- [ ] Invalid credentials show error message
- [ ] Login persists across browser sessions
- [ ] Token expires after 24 hours of inactivity

**Priority:** MUST HAVE  
**Story Points:** 3  
**Status:** DONE

---

### US-1.3: User Logout
**As a** logged-in user  
**I want to** log out of my account  
**So that** I can secure my session on shared devices  

**Acceptance Criteria:**
- [ ] Logout button visible in navbar when authenticated
- [ ] Clicking logout clears authentication token
- [ ] User is redirected to login page
- [ ] Confirmation prompt before logout
- [ ] All protected routes become inaccessible

**Priority:** MUST HAVE  
**Story Points:** 2  
**Status:** DONE

---

### US-1.4: View User Profile
**As a** platform user  
**I want to** view user profiles  
**So that** I can learn about other users and their characters  

**Acceptance Criteria:**
- [ ] Profile page displays username, avatar, bio
- [ ] Shows user's created characters
- [ ] Displays follower and following counts
- [ ] Shows join date
- [ ] Profile is accessible via username URL
- [ ] Public profiles viewable without login

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:** DONE

---

### US-1.5: Edit My Profile
**As a** registered user  
**I want to** edit my profile information  
**So that** I can personalize my account  

**Acceptance Criteria:**
- [ ] Edit button visible on own profile only
- [ ] Can upload/change profile picture
- [ ] Can update bio (max 500 characters)
- [ ] Changes save immediately
- [ ] Image validation (format, size < 5MB)
- [ ] Success confirmation message

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:** DONE

---

## Epic 2: Character Management

### US-2.1: Browse All Characters
**As a** user  
**I want to** view all available characters  
**So that** I can discover characters to chat with  

**Acceptance Criteria:**
- [ ] Characters displayed in responsive grid
- [ ] Each card shows avatar, name, and description
- [ ] Shows character tags
- [ ] Displays creator username
- [ ] Loading state while fetching
- [ ] Characters load on page mount

**Priority:** MUST HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-2.2: Create New Character
**As a** authenticated user  
**I want to** create my own AI character  
**So that** I can share my creative ideas with the community  

**Acceptance Criteria:**
- [ ] Create button visible to authenticated users only
- [ ] Form has fields: name, description, source, avatar
- [ ] Name is required (max 50 chars)
- [ ] Description supports markdown (max 1000 chars)
- [ ] Avatar upload with preview
- [ ] Can add multiple tags
- [ ] Validation errors display clearly
- [ ] Success message and redirect to character page

**Priority:** MUST HAVE  
**Story Points:** 5  
**Status:**  DONE

---

### US-2.3: Edit My Character
**As a** character creator  
**I want to** edit my character's details  
**So that** I can improve or update the character  

**Acceptance Criteria:**
- [ ] Edit button visible only to character creator
- [ ] Form pre-filled with existing data
- [ ] Can modify all character fields
- [ ] Can change avatar image
- [ ] Can add/remove tags
- [ ] Changes save to database
- [ ] Updated character displays immediately

**Priority:** MUST HAVE  
**Story Points:** 4  
**Status:**  DONE

---

### US-2.4: Delete My Character
**As a** character creator  
**I want to** delete characters I created  
**So that** I can remove content I no longer want public  

**Acceptance Criteria:**
- [ ] Delete button visible only to character creator
- [ ] Confirmation dialog before deletion
- [ ] Character removed from database
- [ ] Associated chats are also deleted
- [ ] User redirected to characters page
- [ ] Success message displayed

**Priority:** MUST HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-2.5: View Character Details
**As a** user  
**I want to** view detailed information about a character  
**So that** I can learn about them before chatting  

**Acceptance Criteria:**
- [ ] Clicking character opens detail page
- [ ] Shows full description with formatting
- [ ] Displays all tags
- [ ] Shows creator information
- [ ] Large avatar image visible
- [ ] "Start Chat" button prominent
- [ ] Shows character source/origin

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-2.6: Filter Characters by Tags
**As a** user  
**I want to** filter characters by tags  
**So that** I can find characters that match my interests  

**Acceptance Criteria:**
- [ ] Tag filter UI visible on characters page
- [ ] Can select multiple tags
- [ ] Character list updates in real-time
- [ ] Shows count of filtered results
- [ ] Can clear filters
- [ ] Tags are clickable from character cards

**Priority:** COULD HAVE  
**Story Points:** 3  
**Status:**  IN PROGRESS

---

## Epic 3: AI Chat System

### US-3.1: Start Chat with Character
**As a** user  
**I want to** start a conversation with any character  
**So that** I can interact with AI personalities  

**Acceptance Criteria:**
- [ ] Chat button visible on character pages
- [ ] Clicking creates new chat session
- [ ] User redirected to chat interface
- [ ] Chat starts with empty message history
- [ ] Character info displayed in chat header
- [ ] Input field is focused and ready

**Priority:** MUST HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-3.2: Send Message to Character
**As a** user in a chat  
**I want to** send messages to the character  
**So that** I can have a conversation  

**Acceptance Criteria:**
- [ ] Text input field at bottom of chat
- [ ] Send button and Enter key both work
- [ ] Message appears immediately after sending
- [ ] User message styled differently from bot
- [ ] Input clears after sending
- [ ] Cannot send empty messages
- [ ] Loading indicator while AI responds

**Priority:** MUST HAVE  
**Story Points:** 5  
**Status:**  DONE

---

### US-3.3: Receive AI Response
**As a** user in a chat  
**I want to** receive contextual responses from the AI  
**So that** I have meaningful conversations  

**Acceptance Criteria:**
- [ ] AI response appears within 3 seconds
- [ ] Response is contextually relevant
- [ ] Bot message styled as character
- [ ] Typing indicator shows while processing
- [ ] Error message if AI service fails
- [ ] Conversation context maintained
- [ ] Previous messages influence responses

**Priority:** MUST HAVE  
**Story Points:** 8  
**Status:**  DONE

---

### US-3.4: View Chat History
**As a** user  
**I want to** see my previous chat sessions  
**So that** I can continue past conversations  

**Acceptance Criteria:**
- [ ] Chats page lists all user's chats
- [ ] Each entry shows character and last message
- [ ] Clicking chat opens full conversation
- [ ] Chats sorted by most recent activity
- [ ] Empty state if no chats exist
- [ ] Chat count displayed

**Priority:** MUST HAVE  
**Story Points:** 4  
**Status:**  DONE

---

### US-3.5: Continue Existing Chat
**As a** user  
**I want to** resume previous conversations  
**So that** I can maintain context over time  

**Acceptance Criteria:**
- [ ] Clicking chat loads full message history
- [ ] Messages display in chronological order
- [ ] Scroll position at bottom (latest messages)
- [ ] Can scroll up to view older messages
- [ ] Can send new messages immediately
- [ ] Chat context preserved across sessions

**Priority:** MUST HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-3.6: Delete Message
**As a** user  
**I want to** delete my messages  
**So that** I can remove mistakes or unwanted content  

**Acceptance Criteria:**
- [ ] Delete icon on user's messages only
- [ ] Confirmation prompt before deletion
- [ ] Message removed from conversation
- [ ] Message numbers reordered automatically
- [ ] Cannot delete bot messages
- [ ] Success feedback

**Priority:** COULD HAVE  
**Story Points:** 3  
**Status:**  IN PROGRESS

---

### US-3.7: Group Chat with AI Characters and Users
**As a** user  
**I want to** create group chats with multiple AI characters and other users  
**So that** I can have dynamic multi-party conversations  

**Acceptance Criteria:**
- [ ] Option to create group chat from characters page
- [ ] Can add multiple AI characters to one chat
- [ ] Can invite other users to join the chat
- [ ] All participants' messages visible in conversation
- [ ] AI characters respond in context of group discussion
- [ ] User messages clearly labeled by sender
- [ ] AI characters maintain distinct personalities
- [ ] Typing indicators show who is typing (user or which AI)
- [ ] Group chat list separate from 1-on-1 chats
- [ ] Can leave or delete group chats
- [ ] Participants list visible in chat header

**Priority:** SHOULD HAVE  
**Story Points:** 13  
**Status:**  IN PROGRESS

---

## Epic 4: Social Features

### US-4.1: Follow User
**As a** user  
**I want to** follow other users  
**So that** I can track their character creations  

**Acceptance Criteria:**
- [ ] Follow button on user profiles
- [ ] Button changes to "Unfollow" after clicking
- [ ] Follow count updates immediately
- [ ] Cannot follow yourself
- [ ] Follow persists across sessions
- [ ] Duplicate follows prevented

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-4.2: Unfollow User
**As a** user  
**I want to** unfollow users  
**So that** I can manage my connections  

**Acceptance Criteria:**
- [ ] Unfollow button visible on followed users
- [ ] Confirmation optional
- [ ] Follow relationship removed
- [ ] Follower count decreases
- [ ] Button reverts to "Follow"
- [ ] Immediate UI update

**Priority:** SHOULD HAVE  
**Story Points:** 2  
**Status:**  DONE

---

### US-4.3: Search Users
**As a** user  
**I want to** search for other users by username  
**So that** I can find and connect with specific people  

**Acceptance Criteria:**
- [ ] Search input field visible
- [ ] Search is case-insensitive
- [ ] Results update as user types
- [ ] Shows user avatar and username
- [ ] Click result to view profile
- [ ] Empty state for no results
- [ ] Search by partial username

**Priority:** SHOULD HAVE  
**Story Points:** 4  
**Status:**  DONE

---

### US-4.4: View Followers List
**As a** user  
**I want to** see who follows me  
**So that** I know my audience  

**Acceptance Criteria:**
- [ ] Followers count clickable
- [ ] Opens modal/page with follower list
- [ ] Shows avatar and username
- [ ] Can click to view profiles
- [ ] List paginated if many followers
- [ ] Shows follow back status

**Priority:** COULD HAVE  
**Story Points:** 3  
**Status:**  PLANNED

---

### US-4.5: View Following List
**As a** user  
**I want to** see who I follow  
**So that** I can manage my connections  

**Acceptance Criteria:**
- [ ] Following count clickable
- [ ] Opens modal/page with following list
- [ ] Shows avatar and username
- [ ] Can unfollow from this list
- [ ] List paginated if many following
- [ ] Quick access to profiles

**Priority:** COULD HAVE  
**Story Points:** 3  
**Status:**  PLANNED

---

## Epic 5: Photobooth Feature (NEW)

### US-5.1: Access Photobooth
**As a** user  
**I want to** access the Photobooth feature  
**So that** I can create fun image blends  

**Acceptance Criteria:**
- [ ] Photobooth button in main navigation
- [ ] Dramatic curtain opening animation
- [ ] Photobooth-themed background image
- [ ] Clear instructions visible
- [ ] Works on mobile and desktop
- [ ] Accessible to all users (no login required)

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-5.2: Upload Images to Photobooth
**As a** user  
**I want to** upload two images  
**So that** I can blend them together  

**Acceptance Criteria:**
- [ ] Two distinct upload areas (user & character)
- [ ] Click to open file selector
- [ ] Drag and drop support
- [ ] Image preview after upload
- [ ] Accepts JPG, PNG formats
- [ ] File size validation (max 5MB)
- [ ] Clear visual distinction between upload zones
- [ ] Can replace uploaded images

**Priority:** MUST HAVE  
**Story Points:** 5  
**Status:**  DONE

---

### US-5.3: Create Merged Image
**As a** user  
**I want to** blend my uploaded images  
**So that** I can see the combined result  

**Acceptance Criteria:**
- [ ] Name input field for creation
- [ ] "Create Magic" button disabled until ready
- [ ] Images blend at 50% opacity
- [ ] Processing happens client-side
- [ ] Loading animation during processing
- [ ] Result displayed as polaroid
- [ ] Includes custom name and date
- [ ] High-quality output image

**Priority:** MUST HAVE  
**Story Points:** 8  
**Status:**  DONE

---

### US-5.4: Download Photobooth Creation
**As a** user  
**I want to** download my merged image  
**So that** I can save and share it  

**Acceptance Criteria:**
- [ ] Download button visible on result
- [ ] Downloads as PNG file
- [ ] Filename includes custom name
- [ ] Full resolution maintained
- [ ] Works across all browsers
- [ ] Success message after download

**Priority:** MUST HAVE  
**Story Points:** 2  
**Status:**  DONE

---

### US-5.5: Create Multiple Photobooths
**As a** user  
**I want to** create another photobooth after the first  
**So that** I can experiment with different combinations  

**Acceptance Criteria:**
- [ ] "Create Another" button visible
- [ ] Resets all inputs and images
- [ ] Clears previous result
- [ ] Returns to upload state
- [ ] No page reload required

**Priority:** SHOULD HAVE  
**Story Points:** 2  
**Status:**  DONE

---

## Epic 6: RPG Game System (UPCOMING)

### US-6.1: Start RPG Game
**As a** user  
**I want to** start an RPG adventure  
**So that** I can play a text-based game with characters  

**Acceptance Criteria:**
- [ ] RPG menu accessible from navigation
- [ ] Game introduction/story displays
- [ ] Can select character to play as
- [ ] Character stats initialize properly
- [ ] Game state saves automatically
- [ ] Tutorial for first-time players

**Priority:** COULD HAVE  
**Story Points:** 8  
**Status:**  PLANNED

---

### US-6.2: Engage in Combat
**As a** player  
**I want to** fight enemies in turn-based combat  
**So that** I can progress through the game  

**Acceptance Criteria:**
- [ ] Combat interface shows player and enemy stats
- [ ] Turn-based action selection (attack, defend, ability, item)
- [ ] Damage calculations are logical
- [ ] HP bars update visually
- [ ] Combat log shows actions and results
- [ ] Victory gives experience and loot
- [ ] Defeat shows game over screen

**Priority:** MUST HAVE (for RPG)  
**Story Points:** 13  
**Status:**  PLANNED

---

### US-6.3: Manage Inventory
**As a** player  
**I want to** manage my items and equipment  
**So that** I can optimize my character  

**Acceptance Criteria:**
- [ ] Inventory menu accessible in game
- [ ] Shows all collected items
- [ ] Can use consumables (potions, etc.)
- [ ] Can equip weapons and armor
- [ ] Stat changes display when equipping
- [ ] Item weight/capacity limits
- [ ] Drag and drop organization

**Priority:** MUST HAVE (for RPG)  
**Story Points:** 8  
**Status:**  PLANNED

---

### US-6.4: Complete Quests
**As a** player  
**I want to** accept and complete quests  
**So that** I can earn rewards and experience story  

**Acceptance Criteria:**
- [ ] Quest log accessible from menu
- [ ] NPCs offer quests with dialogue
- [ ] Quest objectives are clear
- [ ] Progress tracks automatically
- [ ] Rewards given upon completion
- [ ] Multiple active quests supported
- [ ] Quest markers on map/locations

**Priority:** SHOULD HAVE (for RPG)  
**Story Points:** 8  
**Status:**  PLANNED

---

### US-6.5: Level Up Character
**As a** player  
**I want to** gain experience and level up  
**So that** I can become stronger  

**Acceptance Criteria:**
- [ ] Experience bar shows progress
- [ ] Level up notification on reaching threshold
- [ ] Can allocate stat points
- [ ] New abilities unlock at certain levels
- [ ] Character sheet shows all stats
- [ ] Level cap is reasonable (max 50)

**Priority:** MUST HAVE (for RPG)  
**Story Points:** 5  
**Status:**  PLANNED

---

### US-6.6: Save and Load Game
**As a** player  
**I want to** save my progress  
**So that** I can continue later  

**Acceptance Criteria:**
- [ ] Auto-save at checkpoints
- [ ] Manual save option in menu
- [ ] Multiple save slots (at least 3)
- [ ] Load game from main menu
- [ ] Save includes all game state
- [ ] Timestamp on save files
- [ ] Cannot overwrite without confirmation

**Priority:** MUST HAVE (for RPG)  
**Story Points:** 8  
**Status:**  PLANNED

---

## Epic 7: Tags & Search

### US-7.1: Create Tags
**As a** character creator  
**I want to** add tags to my character  
**So that** it's easier to discover  

**Acceptance Criteria:**
- [ ] Tag input field in character form
- [ ] Press Enter to add tag
- [ ] Tags display as colored chips
- [ ] Can add multiple tags
- [ ] Tag names are case-insensitive unique
- [ ] Maximum 10 tags per character
- [ ] Can remove tags before saving

**Priority:** SHOULD HAVE  
**Story Points:** 3  
**Status:**  DONE

---

### US-7.2: Browse by Tag
**As a** user  
**I want to** filter characters by tag  
**So that** I can find relevant content  

**Acceptance Criteria:**
- [ ] Clicking tag filters character list
- [ ] Multiple tags can be selected (OR logic)
- [ ] Filter state visible in UI
- [ ] Character count updates
- [ ] Can clear all filters
- [ ] Tags sorted by popularity

**Priority:** SHOULD HAVE  
**Story Points:** 4  
**Status:**  IN PROGRESS

---

## Story Status Legend
-  DONE - Feature completed and tested
-  IN PROGRESS - Currently being developed
-  PLANNED - Scheduled for development
-  BLOCKED - Waiting on dependencies
-  CANCELLED - Not pursuing this feature

## Priority Levels
- **MUST HAVE** - Critical for MVP
- **SHOULD HAVE** - Important but not critical
- **COULD HAVE** - Nice to have if time permits
- **WON'T HAVE** - Explicitly out of scope

---

**Total User Stories:** 41  
**Completed:** 27  
**In Progress:** 4  
**Planned:** 10  

**Document Version:** 1.1  
**Last Updated:** November 2, 2025
