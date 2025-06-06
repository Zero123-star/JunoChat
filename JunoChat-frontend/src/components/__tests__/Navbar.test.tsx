import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../Navbar'

// Mock react-router-dom hooks
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(),
})

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    pathname: '/',
  },
})

// Create a proper localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('Navbar Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorageMock.clear()
    vi.clearAllMocks()
    window.location.pathname = '/'
    
    // Reset localStorage mock implementations
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return null
      if (key === 'user') return null
      return null
    })
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    )
  }

  test('renders navbar with basic navigation links', () => {
    renderWithRouter(<Navbar />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
    expect(screen.getByText('Search Users')).toBeInTheDocument()
  })

  test('shows login button when not authenticated', () => {
    renderWithRouter(<Navbar />)
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Chats')).not.toBeInTheDocument()
    expect(screen.queryByText('New Character')).not.toBeInTheDocument()
  })

  test('shows authenticated user interface when logged in', async () => {
    // Mock localStorage to return authenticated user data
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ username: 'testuser' })
      return null
    })
    
    renderWithRouter(<Navbar />)
    
    // Wait for component to update with localStorage data
    await waitFor(() => {
      expect(screen.getByText('Chats')).toBeInTheDocument()
    })
    
    expect(screen.getByText('New Character')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })

  test('handles navigation to home', () => {
    renderWithRouter(<Navbar />)
    
    const homeLink = screen.getByText('Home')
    expect(homeLink.closest('a')).toHaveAttribute('href', '/home')
  })

  test('handles navigation to characters', () => {
    renderWithRouter(<Navbar />)
    
    const charactersLink = screen.getByText('Characters')
    expect(charactersLink.closest('a')).toHaveAttribute('href', '/characters')
  })

  test('handles navigation to chats when authenticated', async () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ username: 'testuser' })
      return null
    })
    
    renderWithRouter(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('Chats')).toBeInTheDocument()
    })
    
    const chatsLink = screen.getByText('Chats')
    expect(chatsLink.closest('a')).toHaveAttribute('href', '/chats')
  })

  test('handles new character button click when authenticated', async () => {
    const user = userEvent.setup()
    
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ username: 'testuser' })
      return null
    })
    
    renderWithRouter(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('New Character')).toBeInTheDocument()
    })
    
    const newCharacterButton = screen.getByText('New Character')
    await user.click(newCharacterButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/characters/add')
  })

  test('handles search users button click', async () => {
    const user = userEvent.setup()
    
    renderWithRouter(<Navbar />)
    
    const searchUsersButton = screen.getByText('Search Users')
    await user.click(searchUsersButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/search-users')
  })

  test('handles login button click when not authenticated', async () => {
    const user = userEvent.setup()
    
    renderWithRouter(<Navbar />)
    
    const loginButton = screen.getByText('Login')
    await user.click(loginButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('handles profile navigation when authenticated and not on profile page', async () => {
    const user = userEvent.setup()
    
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ username: 'testuser' })
      return null
    })
    
    renderWithRouter(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument()
    })
    
    const profileButton = screen.getByText('testuser')
    await user.click(profileButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/profile/testuser')
  })

  test('shows logout button when on user profile page', async () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ username: 'testuser' })
      return null
    })
    
    window.location.pathname = '/profile/testuser'
    
    renderWithRouter(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('Log out')).toBeInTheDocument()
    })
    
    expect(screen.queryByText('testuser')).not.toBeInTheDocument()
  })

  test('handles user data without username gracefully', async () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ id: '123' }) // No username
      return null
    })
    
    renderWithRouter(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('Chats')).toBeInTheDocument()
    })
    
    expect(screen.getByText('New Character')).toBeInTheDocument()
  })

  test('applies correct CSS classes for styling', () => {
    renderWithRouter(<Navbar />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('bg-gradient-to-r', 'from-purple-400', 'to-pink-500', 'fixed', 'top-0')
  })

  test('renders icons correctly', async () => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ username: 'testuser' })
      return null
    })
    
    renderWithRouter(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('New Character')).toBeInTheDocument()
    })
    
    // Check that buttons contain SVG icons
    const newCharacterButton = screen.getByText('New Character').closest('button')
    const userButton = screen.getByText('testuser').closest('button')
    
    expect(newCharacterButton?.querySelector('svg')).toBeInTheDocument()
    expect(userButton?.querySelector('svg')).toBeInTheDocument()
  })
})