import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Make vi available globally
global.vi = vi

// Extend global types for vitest
declare global {
  var vi: typeof import('vitest').vi
}

// Mock console methods to keep test output clean
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Reset localStorage before each test
beforeEach(() => {
  localStorageMock.clear()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
})