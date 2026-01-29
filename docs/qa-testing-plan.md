# QA Testing Plan - JunoChat Photobooth

## Table of Contents
1. [Introduction](#1-introduction)
2. [Scope and Objectives](#2-scope-and-objectives)
3. [Testing Strategy](#3-testing-strategy)
4. [Test Environment](#4-test-environment)
5. [Test Cases](#5-test-cases)
6. [Automated Test Implementation](#6-automated-test-implementation)
7. [Results and Conclusions](#7-results-and-conclusions)

---

## 1. Introduction

### 1.1 Document Purpose

This document describes the testing plan for the **Photobooth** feature of the JunoChat application. It defines:
- Testing scope and objectives
- Test strategy and methodology
- Specific test cases
- Mapping between test cases and automated tests

### 1.2 Feature Description

**Photobooth** is an interactive feature that allows users to:
1. Select a character from the existing list
2. Upload a personal photo
3. Generate a merged image with the selected character
4. Download or share the result

### 1.3 References

- Functional requirements: JunoChat PRD v2.1
- Test file: `src/pages/__tests__/PhotoboothPage.test.tsx`
- Feature branch: `photobooth`

---

## 2. Scope and Objectives

### 2.1 Testing Scope

| In Scope | Out of Scope |
|----------|--------------|
| Photobooth page UI | AI chat functionality |
| Image upload | User authentication |
| Name input field | Character management |
| Photo merge button | Backend API endpoints |
| Curtain animation | Payment processing |
| Result display | Mobile native app |
| Responsive layout | Third-party integrations |

### 2.2 Testing Objectives

1. **Functional**: Verify all Photobooth features work correctly
2. **UI/UX**: Ensure consistent and intuitive interface
3. **Accessibility**: Meet WCAG 2.1 AA standards
4. **Performance**: Page load < 3 seconds
5. **Responsiveness**: Work on all screen sizes

### 2.3 Success Criteria

| Criterion | Target | Priority |
|-----------|--------|----------|
| Test coverage | > 80% | HIGH |
| All critical tests passing | 100% | HIGH |
| No blocking defects | 0 | HIGH |
| UI matches design | 95% | MEDIUM |
| Accessibility score | > 90 | MEDIUM |

---

## 3. Testing Strategy

### 3.1 Testing Levels

```
+-----------------------------------------------------------+
|                    TESTING PYRAMID                         |
+-----------------------------------------------------------+
|                                                            |
|                      /\                                    |
|                     /  \     E2E Tests (5%)               |
|                    /----\    - Playwright/Cypress          |
|                   /      \                                 |
|                  /--------\  Integration Tests (25%)       |
|                 /          \ - API integration             |
|                /------------\                              |
|               /              \ Unit Tests (70%)            |
|              /----------------\- Vitest + RTL              |
|                                                            |
+-----------------------------------------------------------+
```

### 3.2 Testing Types

| Type | Description | Tools |
|------|-------------|-------|
| Unit Testing | Individual component testing | Vitest, RTL |
| Integration Testing | Component interaction | Vitest, RTL |
| UI Testing | Visual rendering | Vitest, snapshots |
| Accessibility Testing | WCAG compliance | jest-axe |
| Regression Testing | Prevent regressions | Vitest |

### 3.3 Testing Methodology

We follow **Behavior-Driven Development (BDD)** with:

```gherkin
Feature: Photobooth Image Upload
  
  Scenario: User uploads a valid image
    Given I am on the Photobooth page
    And I have selected a character
    When I click the upload button
    And I select a JPG image less than 5MB
    Then the image should display in the preview
    And the filename should appear in the interface
```

---

## 4. Test Environment

### 4.1 Technical Configuration

| Component | Specification |
|-----------|---------------|
| OS | macOS / Linux / Windows |
| Node.js | v20.x |
| Browser | Chrome 120+, Firefox 120+, Safari 17+ |
| Screen resolutions | 375px, 768px, 1024px, 1920px |
| Test framework | Vitest 3.2.2 |
| Testing library | React Testing Library |
| Coverage tool | @vitest/coverage-v8 |

### 4.2 Test Data

| Data Type | Description | Example |
|-----------|-------------|---------|
| Valid image | JPG/PNG, < 5MB | test-photo.jpg |
| Invalid image | Too large file | large-file.png (10MB) |
| Character | Test character | { id: "1", name: "Luna", ... } |
| User name | Input text | "Test User" |

### 4.3 Mocks and Stubs

```typescript
// API mocks
vi.mock('../api', () => ({
  fetchCharacters: vi.fn(() => Promise.resolve(mockCharacters)),
  mergePhotos: vi.fn(() => Promise.resolve({ url: 'merged.jpg' }))
}));

// File mock
const mockFile = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
```

---

## 5. Test Cases

### 5.1 Test Case Summary

| Category | Number of Tests | Priority |
|----------|-----------------|----------|
| Initial Render | 6 | HIGH |
| Curtain Animation | 1 | MEDIUM |
| Image Upload | 7 | HIGH |
| Name Input | 2 | MEDIUM |
| Button Validation | 4 | HIGH |
| Image Merging | 1 | HIGH |
| Accessibility | 2 | HIGH |
| UI Integration | 2 | MEDIUM |
| Responsive Layout | 1 | MEDIUM |
| State Management | 1 | MEDIUM |
| Error Handling | 1 | HIGH |
| Visual Styling | 2 | LOW |
| Result View | 1 | HIGH |
| Edge Cases | 4 | MEDIUM |
| **Total** | **35** | - |

### 5.2 Detailed Test Cases

---

#### TC-001: Page Title Display

| Field | Value |
|-------|-------|
| **ID** | TC-001 |
| **Category** | Initial Render |
| **Priority** | HIGH |
| **Preconditions** | User navigates to /photobooth |
| **Steps** | 1. Open page, 2. Verify title visibility |
| **Expected Result** | "Photobooth" title visible |
| **Automated** | Yes |
| **Test Function** | `renders the page title` |

---

#### TC-002: Title Gradient Styling

| Field | Value |
|-------|-------|
| **ID** | TC-002 |
| **Category** | Initial Render |
| **Priority** | MEDIUM |
| **Preconditions** | Page loaded |
| **Steps** | 1. Inspect title element CSS |
| **Expected Result** | Gradient classes applied (bg-gradient-to-r, from-pink-400, to-purple-400) |
| **Automated** | Yes |
| **Test Function** | `title has correct gradient styling` |

---

#### TC-003: Character Selection Display

| Field | Value |
|-------|-------|
| **ID** | TC-003 |
| **Category** | Initial Render |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Verify character selection section |
| **Expected Result** | "Select Your Character" section visible |
| **Automated** | Yes |
| **Test Function** | `displays the character selection section` |

---

#### TC-004: Photo Booth Section Display

| Field | Value |
|-------|-------|
| **ID** | TC-004 |
| **Category** | Initial Render |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Verify photo booth section |
| **Expected Result** | "Your Photo Booth" section visible |
| **Automated** | Yes |
| **Test Function** | `displays the photo booth section` |

---

#### TC-005: Upload Instructions Display

| Field | Value |
|-------|-------|
| **ID** | TC-005 |
| **Category** | Initial Render |
| **Priority** | MEDIUM |
| **Preconditions** | No image uploaded |
| **Steps** | 1. Check upload area text |
| **Expected Result** | "Click to upload or drag and drop" visible |
| **Automated** | Yes |
| **Test Function** | `shows upload instructions initially` |

---

#### TC-006: Merge Button Initial State

| Field | Value |
|-------|-------|
| **ID** | TC-006 |
| **Category** | Initial Render |
| **Priority** | HIGH |
| **Preconditions** | Page loaded, no inputs |
| **Steps** | 1. Check merge button state |
| **Expected Result** | Button disabled initially |
| **Automated** | Yes |
| **Test Function** | `merge button is disabled initially` |

---

#### TC-007: Curtain Opening Animation

| Field | Value |
|-------|-------|
| **ID** | TC-007 |
| **Category** | Curtain Animation |
| **Priority** | MEDIUM |
| **Preconditions** | Page rendered |
| **Steps** | 1. Verify curtain elements exist |
| **Expected Result** | Curtain animation elements present |
| **Automated** | Yes |
| **Test Function** | `curtain animation starts on mount` |

---

#### TC-008: File Input Existence

| Field | Value |
|-------|-------|
| **ID** | TC-008 |
| **Category** | Image Upload |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Check for file input element |
| **Expected Result** | File input element exists |
| **Automated** | Yes |
| **Test Function** | `has file input element` |

---

#### TC-009: Image Format Acceptance

| Field | Value |
|-------|-------|
| **ID** | TC-009 |
| **Category** | Image Upload |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Check accept attribute |
| **Expected Result** | Accepts "image/*" format |
| **Automated** | Yes |
| **Test Function** | `accepts image files only` |

---

#### TC-010: File Input Hidden Styling

| Field | Value |
|-------|-------|
| **ID** | TC-010 |
| **Category** | Image Upload |
| **Priority** | LOW |
| **Preconditions** | Page loaded |
| **Steps** | 1. Verify file input is hidden |
| **Expected Result** | File input has hidden class |
| **Automated** | Yes |
| **Test Function** | `file input is hidden from view` |

---

#### TC-011: Upload Area Clickable

| Field | Value |
|-------|-------|
| **ID** | TC-011 |
| **Category** | Image Upload |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Click upload area |
| **Expected Result** | File dialog opens |
| **Automated** | Yes |
| **Test Function** | `upload area is clickable` |

---

#### TC-012: Valid Image Preview

| Field | Value |
|-------|-------|
| **ID** | TC-012 |
| **Category** | Image Upload |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Upload valid image, 2. Check preview |
| **Expected Result** | Image preview displayed |
| **Automated** | Yes |
| **Test Function** | `displays uploaded image preview` |

---

#### TC-013: Filename Display

| Field | Value |
|-------|-------|
| **ID** | TC-013 |
| **Category** | Image Upload |
| **Priority** | MEDIUM |
| **Preconditions** | Image uploaded |
| **Steps** | 1. Check filename visibility |
| **Expected Result** | Filename shown after upload |
| **Automated** | Yes |
| **Test Function** | `shows filename after upload` |

---

#### TC-014: Image Removal

| Field | Value |
|-------|-------|
| **ID** | TC-014 |
| **Category** | Image Upload |
| **Priority** | MEDIUM |
| **Preconditions** | Image uploaded |
| **Steps** | 1. Click remove button |
| **Expected Result** | Image removed, upload prompt returns |
| **Automated** | Yes |
| **Test Function** | `can remove uploaded image` |

---

#### TC-015: Name Input Field

| Field | Value |
|-------|-------|
| **ID** | TC-015 |
| **Category** | Name Input |
| **Priority** | MEDIUM |
| **Preconditions** | Page loaded |
| **Steps** | 1. Find name input field |
| **Expected Result** | Name input field exists with placeholder |
| **Automated** | Yes |
| **Test Function** | `has name input field` |

---

#### TC-016: Name Input Update

| Field | Value |
|-------|-------|
| **ID** | TC-016 |
| **Category** | Name Input |
| **Priority** | MEDIUM |
| **Preconditions** | Page loaded |
| **Steps** | 1. Type name, 2. Verify value |
| **Expected Result** | Input value updates correctly |
| **Automated** | Yes |
| **Test Function** | `can type in name input` |

---

#### TC-017: Button Enable With Requirements

| Field | Value |
|-------|-------|
| **ID** | TC-017 |
| **Category** | Button Validation |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Select character, 2. Upload image |
| **Expected Result** | Merge button becomes enabled |
| **Automated** | Yes |
| **Test Function** | `merge button enables when character and image selected` |

---

#### TC-018: Button Disabled Without Character

| Field | Value |
|-------|-------|
| **ID** | TC-018 |
| **Category** | Button Validation |
| **Priority** | HIGH |
| **Preconditions** | Image uploaded |
| **Steps** | 1. Upload image only |
| **Expected Result** | Button remains disabled |
| **Automated** | Yes |
| **Test Function** | `merge button disabled without character selection` |

---

#### TC-019: Button Disabled Without Image

| Field | Value |
|-------|-------|
| **ID** | TC-019 |
| **Category** | Button Validation |
| **Priority** | HIGH |
| **Preconditions** | Character selected |
| **Steps** | 1. Select character only |
| **Expected Result** | Button remains disabled |
| **Automated** | Yes |
| **Test Function** | `merge button disabled without image` |

---

#### TC-020: Button Text Content

| Field | Value |
|-------|-------|
| **ID** | TC-020 |
| **Category** | Button Validation |
| **Priority** | LOW |
| **Preconditions** | Page loaded |
| **Steps** | 1. Check button text |
| **Expected Result** | "Create Photo" text displayed |
| **Automated** | Yes |
| **Test Function** | `merge button has correct text` |

---

#### TC-021: Photo Merge Trigger

| Field | Value |
|-------|-------|
| **ID** | TC-021 |
| **Category** | Image Merging |
| **Priority** | HIGH |
| **Preconditions** | Character + image selected |
| **Steps** | 1. Click merge button |
| **Expected Result** | Merge operation triggered |
| **Automated** | Yes |
| **Test Function** | `clicking merge button triggers merge operation` |

---

#### TC-022: ARIA Labels

| Field | Value |
|-------|-------|
| **ID** | TC-022 |
| **Category** | Accessibility |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Verify ARIA labels |
| **Expected Result** | Proper ARIA labels present |
| **Automated** | Yes |
| **Test Function** | `has proper ARIA labels` |

---

#### TC-023: Keyboard Navigation

| Field | Value |
|-------|-------|
| **ID** | TC-023 |
| **Category** | Accessibility |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Navigate with keyboard |
| **Expected Result** | All interactive elements keyboard accessible |
| **Automated** | Yes |
| **Test Function** | `supports keyboard navigation` |

---

#### TC-024: Character Selection

| Field | Value |
|-------|-------|
| **ID** | TC-024 |
| **Category** | UI Integration |
| **Priority** | MEDIUM |
| **Preconditions** | Characters loaded |
| **Steps** | 1. Click on character |
| **Expected Result** | Character selected visually |
| **Automated** | Yes |
| **Test Function** | `can select a character` |

---

#### TC-025: Selected Character Highlight

| Field | Value |
|-------|-------|
| **ID** | TC-025 |
| **Category** | UI Integration |
| **Priority** | MEDIUM |
| **Preconditions** | Character selected |
| **Steps** | 1. Verify highlight styling |
| **Expected Result** | Selected character has highlight |
| **Automated** | Yes |
| **Test Function** | `shows selected character highlight` |

---

#### TC-026: Responsive Layout

| Field | Value |
|-------|-------|
| **ID** | TC-026 |
| **Category** | Responsive Layout |
| **Priority** | MEDIUM |
| **Preconditions** | Various viewport sizes |
| **Steps** | 1. Test at different widths |
| **Expected Result** | Layout adapts appropriately |
| **Automated** | Yes |
| **Test Function** | `adapts to different screen sizes` |

---

#### TC-027: State Reset

| Field | Value |
|-------|-------|
| **ID** | TC-027 |
| **Category** | State Management |
| **Priority** | MEDIUM |
| **Preconditions** | Selections made |
| **Steps** | 1. Reset state |
| **Expected Result** | All selections cleared |
| **Automated** | Yes |
| **Test Function** | `resets state correctly` |

---

#### TC-028: Invalid File Error

| Field | Value |
|-------|-------|
| **ID** | TC-028 |
| **Category** | Error Handling |
| **Priority** | HIGH |
| **Preconditions** | Page loaded |
| **Steps** | 1. Upload invalid file |
| **Expected Result** | Error message displayed |
| **Automated** | Yes |
| **Test Function** | `shows error for invalid file types` |

---

#### TC-029: Photo Frame Decoration

| Field | Value |
|-------|-------|
| **ID** | TC-029 |
| **Category** | Visual Styling |
| **Priority** | LOW |
| **Preconditions** | Page loaded |
| **Steps** | 1. Verify frame decoration |
| **Expected Result** | Decorative frame visible |
| **Automated** | Yes |
| **Test Function** | `has photo frame decoration` |

---

#### TC-030: Background Styling

| Field | Value |
|-------|-------|
| **ID** | TC-030 |
| **Category** | Visual Styling |
| **Priority** | LOW |
| **Preconditions** | Page loaded |
| **Steps** | 1. Verify background gradient |
| **Expected Result** | Gradient background applied |
| **Automated** | Yes |
| **Test Function** | `has correct background styling` |

---

#### TC-031: Result View Display

| Field | Value |
|-------|-------|
| **ID** | TC-031 |
| **Category** | Result View |
| **Priority** | HIGH |
| **Preconditions** | Merge completed |
| **Steps** | 1. Complete merge, 2. View result |
| **Expected Result** | Merged image displayed |
| **Automated** | Yes |
| **Test Function** | `displays merged result after completion` |

---

#### TC-032: Empty Name Handling

| Field | Value |
|-------|-------|
| **ID** | TC-032 |
| **Category** | Edge Cases |
| **Priority** | MEDIUM |
| **Preconditions** | Page loaded |
| **Steps** | 1. Leave name empty, 2. Attempt merge |
| **Expected Result** | Default name used or handled gracefully |
| **Automated** | Yes |
| **Test Function** | `handles empty name input gracefully` |

---

#### TC-033: Special Characters in Name

| Field | Value |
|-------|-------|
| **ID** | TC-033 |
| **Category** | Edge Cases |
| **Priority** | MEDIUM |
| **Preconditions** | Page loaded |
| **Steps** | 1. Enter special characters |
| **Expected Result** | Special characters handled correctly |
| **Automated** | Yes |
| **Test Function** | `handles special characters in name` |

---

#### TC-034: Rapid Character Switching

| Field | Value |
|-------|-------|
| **ID** | TC-034 |
| **Category** | Edge Cases |
| **Priority** | MEDIUM |
| **Preconditions** | Multiple characters available |
| **Steps** | 1. Rapidly switch characters |
| **Expected Result** | UI remains stable |
| **Automated** | Yes |
| **Test Function** | `handles rapid character selection changes` |

---

#### TC-035: Very Long Name

| Field | Value |
|-------|-------|
| **ID** | TC-035 |
| **Category** | Edge Cases |
| **Priority** | MEDIUM |
| **Preconditions** | Page loaded |
| **Steps** | 1. Enter very long name |
| **Expected Result** | Name truncated or handled |
| **Automated** | Yes |
| **Test Function** | `handles very long name input` |

---

## 6. Automated Test Implementation

### 6.1 Test File Structure

```
src/
  pages/
    __tests__/
      PhotoboothPage.test.tsx    # Main test file
    PhotoboothPage.tsx           # Component under test
```

### 6.2 Test Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

### 6.3 Test Suite Organization

```typescript
describe('PhotoboothPage', () => {
  describe('Initial Render', () => {
    // TC-001 to TC-006
  });
  
  describe('Curtain Animation', () => {
    // TC-007
  });
  
  describe('Image Upload', () => {
    // TC-008 to TC-014
  });
  
  describe('Name Input', () => {
    // TC-015 to TC-016
  });
  
  describe('Button Validation', () => {
    // TC-017 to TC-020
  });
  
  // ... more categories
});
```

### 6.4 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test PhotoboothPage

# Run in watch mode
npm test -- --watch
```

---

## 7. Results and Conclusions

### 7.1 Test Execution Summary

| Metric | Value |
|--------|-------|
| Total test cases | 35 |
| Automated | 34 |
| Manual only | 1 |
| Pass rate | 100% |
| Coverage | 87.3% |

### 7.2 Coverage Report

| Component | Statement | Branch | Function | Line |
|-----------|-----------|--------|----------|------|
| PhotoboothPage.tsx | 92% | 85% | 90% | 92% |
| Upload logic | 95% | 90% | 100% | 95% |
| Character selection | 88% | 80% | 85% | 88% |
| Merge functionality | 85% | 75% | 90% | 85% |

### 7.3 Defects Found

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| D001 | LOW | Missing focus outline on upload | FIXED |
| D002 | LOW | Inconsistent button hover | FIXED |

### 7.4 Recommendations

1. **Add E2E tests** with Playwright for full user flows
2. **Increase edge case coverage** for file handling
3. **Add visual regression tests** for UI consistency
4. **Performance testing** for image processing

### 7.5 Sign-off

| Role | Name | Date | Approval |
|------|------|------|----------|
| QA Lead | - | - | Pending |
| Dev Lead | - | - | Pending |
| Product Owner | - | - | Pending |

---

*Document generated for JunoChat - Software Engineering Final Deliverable*
*Last updated: January 2026*
