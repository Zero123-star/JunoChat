# Product Backlog - Prioritized Issues

## Sprint Planning Overview

This document contains the prioritized backlog of all issues derived from user stories, organized by priority and sprint allocation.

---

##  Current Sprint (Sprint 3) - November 2025

### Sprint Goal
Complete Photobooth feature and begin RPG game system development.

### Sprint Duration
November 1-15, 2025 (2 weeks)

### Committed Issues

| ID | Issue | Story | Priority | Points | Status | Assignee |
|----|-------|-------|----------|--------|--------|----------|
| #45 | Add Photobooth navigation button | US-5.1 | MUST | 1 |  DONE | - |
| #46 | Implement curtain animation | US-5.1 | MUST | 2 |  DONE | - |
| #47 | Create image upload components | US-5.2 | MUST | 3 |  DONE | - |
| #48 | Implement image blending logic | US-5.3 | MUST | 5 |  DONE | - |
| #49 | Add polaroid styling to output | US-5.3 | SHOULD | 2 |  DONE | - |
| #50 | Implement download functionality | US-5.4 | MUST | 2 |  DONE | - |
| #51 | Add reset/create another feature | US-5.5 | SHOULD | 1 |  DONE | - |
| #52 | Design RPG game architecture | US-6.1 | COULD | 3 |  TODO | - |
| #53 | Create RPG Python backend | US-6.1 | COULD | 5 |  TODO | - |

**Sprint Velocity:** 24 points  
**Completed:** 16 points  
**Remaining:** 8 points  

---

## Next Sprint (Sprint 4) - Mid-November 2025

### Sprint Goal
Launch MVP of RPG game system with combat and basic inventory.

### Planned Issues

| ID | Issue | Story | Priority | Points | Status |
|----|-------|-------|----------|--------|--------|
| #54 | Implement turn-based combat system | US-6.2 | MUST | 8 |  TODO |
| #55 | Create enemy database and AI | US-6.2 | MUST | 5 |  TODO |
| #56 | Build inventory management UI | US-6.3 | MUST | 5 |  TODO |
| #57 | Implement item usage system | US-6.3 | SHOULD | 3 |  TODO |
| #58 | Add character stats system | US-6.5 | MUST | 3 |  TODO |
| #59 | Create game state manager | US-6.6 | MUST | 5 |  TODO |

**Planned Velocity:** 29 points

---

##  Backlog - Prioritized by MoSCoW

### MUST HAVE (Critical for MVP)

#### High Priority (P0)
| ID | Issue | Story | Points | Status |
|----|-------|-------|--------|--------|
| #60 | Fix message deletion bug | US-3.6 | 2 |  IN PROGRESS |
| #96 | Implement group chat database schema | US-3.7 | 5 |  IN PROGRESS |
| #97 | Create group chat UI components | US-3.7 | 5 |  IN PROGRESS |
| #61 | Implement auto-save for RPG | US-6.6 | 5 |  TODO |
| #62 | Add combat victory/defeat screens | US-6.2 | 3 |  TODO |

#### Medium Priority (P1)
| ID | Issue | Story | Points | Status |
|----|-------|-------|--------|--------|
| #63 | Optimize chat message loading | US-3.4 | 3 |  TODO |
| #64 | Add character search functionality | US-2.6 | 3 |  TODO |
| #65 | Implement RPG quest system basics | US-6.4 | 5 |  TODO |

---

### SHOULD HAVE (Important but not critical)

#### High Priority (P1)
| ID | Issue | Story | Points | Status |
|----|-------|-------|--------|--------|
| #66 | Add tag filtering to characters page | US-7.2 | 4 |  IN PROGRESS |
| #67 | Implement followers list view | US-4.4 | 3 |  TODO |
| #68 | Add following list view | US-4.5 | 3 |  TODO |
| #98 | Add multiple AI characters to group chat | US-3.7 | 3 |  TODO |
| #99 | Implement multi-user group chat support | US-3.7 | 3 |  TODO |
| #69 | Create RPG quest log interface | US-6.4 | 3 |  TODO |

#### Medium Priority (P2)
| ID | Issue | Story | Points | Status |
|----|-------|-------|--------|--------|
| #70 | Add pagination to chat history | US-3.4 | 2 |  TODO |
| #71 | Implement bio field in profile | US-1.5 | 2 |  TODO |
| #72 | Add character creation analytics | - | 3 |  TODO |
| #73 | Create RPG level up UI | US-6.5 | 3 |  TODO |

---

### COULD HAVE (Nice to have)

#### Medium Priority (P2)
| ID | Issue | Story | Points | Status |
|----|-------|-------|--------|--------|
| #74 | Add real-time typing indicators | US-3.2 | 5 |  TODO |
| #75 | Implement message reactions | - | 3 |  TODO |
| #76 | Add character favorites system | - | 3 |  TODO |
| #77 | Create RPG achievements | - | 5 |  TODO |

#### Low Priority (P3)
| ID | Issue | Story | Points | Status |
|----|-------|-------|--------|--------|
| #78 | Add dark mode toggle | - | 3 |  TODO |
| #79 | Implement keyboard shortcuts | - | 2 |  TODO |
| #80 | Add export chat history | - | 3 |  TODO |
| #81 | Create RPG multiplayer mode | - | 13 |  TODO |

---

### WON'T HAVE (Out of scope for now)

| ID | Issue | Reason | Status |
|----|-------|--------|--------|
| #82 | Voice chat with characters | Requires significant infrastructure |  DEFERRED |
| #83 | 3D character avatars | Out of current budget |  DEFERRED |
| #84 | Blockchain NFT integration | Not core to product vision |  CANCELLED |
| #85 | VR chat experience | Technology not mature enough |  DEFERRED |

---

##  Bug Backlog

### Critical Bugs (P0)
| ID | Issue | Description | Status | Reported |
|----|-------|-------------|--------|----------|
| - | - | No critical bugs | - | - |

### High Priority Bugs (P1)
| ID | Issue | Description | Status | Reported |
|----|-------|-------------|--------|----------|
| #86 | Message order incorrect after deletion | Messages don't reorder properly |  IN PROGRESS | Nov 1 |

### Medium Priority Bugs (P2)
| ID | Issue | Description | Status | Reported |
|----|-------|-------------|--------|----------|
| #87 | Character avatar doesn't update immediately | Requires page refresh |  TODO | Oct 28 |
| #88 | Follow button state inconsistent | Sometimes shows wrong state |  TODO | Oct 30 |

### Low Priority Bugs (P3)
| ID | Issue | Description | Status | Reported |
|----|-------|-------------|--------|----------|
| #89 | Navbar overlap on small screens | Minor UI issue |  TODO | Oct 25 |

---

##  Technical Debt

| ID | Issue | Description | Priority | Points | Status |
|----|-------|-------------|----------|--------|--------|
| #90 | Refactor API service layer | Reduce code duplication | P2 | 5 |  TODO |
| #91 | Add unit tests for components | Improve test coverage | P1 | 8 |  TODO |
| #92 | Optimize database queries | Add indexes, reduce N+1 | P1 | 5 |  TODO |
| #93 | Implement proper error boundaries | Better React error handling | P2 | 3 |  TODO |
| #94 | Add API rate limiting | Prevent abuse | P1 | 3 |  TODO |
| #95 | Setup CI/CD pipeline | Automate testing and deployment | P2 | 8 |  TODO |

---

##  Backlog Metrics

### Overall Statistics
- **Total Issues:** 99
- **Completed:** 51 (52%)
- **In Progress:** 6 (6%)
- **To Do:** 38 (38%)
- **Blocked:** 0 (0%)
- **Cancelled:** 4 (4%)

### By Priority
- **P0 (Critical):** 5 issues
- **P1 (High):** 23 issues
- **P2 (Medium):** 28 issues
- **P3 (Low):** 7 issues

### By Category
- **Features:** 67 issues
- **Bugs:** 4 issues
- **Technical Debt:** 6 issues
- **Documentation:** 18 issues

### Velocity Trend
- **Sprint 1:** 18 points (actual)
- **Sprint 2:** 22 points (actual)
- **Sprint 3:** 24 points (projected)
- **Sprint 4:** 29 points (planned)

---

##  Epic Progress

| Epic | Total Stories | Completed | In Progress | Remaining | % Complete |
|------|--------------|-----------|-------------|-----------|------------|
| User Management | 5 | 5 | 0 | 0 | 100% |
| Character Management | 6 | 6 | 0 | 0 | 100% |
| AI Chat System | 7 | 5 | 2 | 0 | 71% |
| Social Features | 5 | 3 | 2 | 0 | 60% |
| Photobooth | 5 | 5 | 0 | 0 | 100% |
| RPG Game | 6 | 0 | 0 | 6 | 0% |
| Tags & Search | 2 | 1 | 1 | 0 | 50% |

---

##  Backlog Refinement Notes

### Recent Changes (November 2, 2025)
-  Completed entire Photobooth epic (issues #45-#51)
-  Added RPG game system issues (#52-#59)
-  Added Group Chat feature (US-3.7) - IN PROGRESS (issues #96-#99)
-  Moved message deletion to current sprint
-  Increased sprint velocity target to 29 points
-  Total user stories increased from 40 to 41

### Next Refinement Session
- **Date:** November 8, 2025
- **Focus:** Review RPG game progress and reprioritize
- **Participants:** Development team

### Dependencies
- Issue #54 (Combat) depends on #58 (Stats system)
- Issue #56 (Inventory UI) depends on #55 (Enemy database)
- Issue #61 (Auto-save) depends on #59 (State manager)

---

##  Issue Template

```markdown
## Issue Title
[User Story ID] - Brief description

## Description
Detailed explanation of what needs to be done

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
- Implementation details
- API endpoints affected
- Database changes required

## Dependencies
- Related issues: #XX, #YY

## Story Points
X points

## Priority
P0 / P1 / P2 / P3

## Labels
feature / bug / enhancement / technical-debt
```

---

**Document Version:** 1.0  
**Last Updated:** November 2, 2025  
**Next Review:** November 8, 2025
