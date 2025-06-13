import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { toast } from 'sonner'

// Hoist mocks
const mockCreateCharacter = vi.hoisted(() => vi.fn())
const mockNavigate = vi.hoisted(() => vi.fn())

// Mock API
vi.mock('@/api', () => ({
  createCharacter: mockCreateCharacter
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock localStorage
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

import AddCharacterPage from '../AddCharacterPage'

describe('AddCharacterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    mockCreateCharacter.mockResolvedValue({ id: '1', message: 'Character created successfully' })
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    )
  }

  test('redirects to login if no token found', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    renderWithRouter(<AddCharacterPage />)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please log in to create a character')
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  test('renders form when authenticated', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return 'user-123'
      return null
    })
    
    renderWithRouter(<AddCharacterPage />)
    
    expect(screen.getByText('Create New Character')).toBeInTheDocument()  // Updated text
    expect(screen.getByLabelText('Name')).toBeInTheDocument()           // Updated label
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Character Image')).toBeInTheDocument() // Updated label
    expect(screen.getByLabelText('Tags')).toBeInTheDocument()           // Updated label
    expect(screen.getByLabelText('Color')).toBeInTheDocument()
  })

  test('handles form input changes', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return 'user-123'
      return null
    })
    
    renderWithRouter(<AddCharacterPage />)
    
    const nameInput = screen.getByLabelText('Name')              // Updated label
    const descriptionInput = screen.getByLabelText('Description')
    
    await user.type(nameInput, 'Test Character')
    await user.type(descriptionInput, 'Test Description')
    
    expect(nameInput).toHaveValue('Test Character')
    expect(descriptionInput).toHaveValue('Test Description')
  })

  test('handles form submission successfully', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return 'user-123'
      return null
    })
    
    renderWithRouter(<AddCharacterPage />)
    
    // Fill out the form
    await user.type(screen.getByLabelText('Name'), 'Test Character')             // Updated
    await user.type(screen.getByLabelText('Description'), 'Test Description')
    await user.type(screen.getByLabelText('Tags'), 'test, character')           // Updated
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Create' })         // Updated
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockCreateCharacter).toHaveBeenCalledWith({
        formData: {
          name: 'Test Character',
          description: 'Test Description',
          avatar: '',                    // Updated - starts empty
          tags: 'test,character',
          color: '#000000'
        },
        creator_id: 'user-123'
      })
      expect(toast.success).toHaveBeenCalledWith('Character created successfully!')
      expect(mockNavigate).toHaveBeenCalledWith('/characters')
    })
  })

  test('handles form submission error', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return 'user-123'
      return null
    })
    
    mockCreateCharacter.mockRejectedValue(new Error('Failed to create character'))
    
    renderWithRouter(<AddCharacterPage />)
    
    // Fill out minimum required fields
    await user.type(screen.getByLabelText('Name'), 'Test Character')           // Updated
    await user.type(screen.getByLabelText('Description'), 'Test Description')
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Create' })       // Updated
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to create character. Please try again.')).toBeInTheDocument()
      expect(toast.error).toHaveBeenCalledWith('Failed to create character')
    })
  })

  test('shows loading state during submission', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return 'user-123'
      return null
    })
    
    // Make the API call hang to test loading state
    mockCreateCharacter.mockImplementation(() => new Promise(() => {}))
    
    renderWithRouter(<AddCharacterPage />)
    
    await user.type(screen.getByLabelText('Name'), 'Test Character')           // Updated
    await user.type(screen.getByLabelText('Description'), 'Test Description')
    
    const submitButton = screen.getByRole('button', { name: 'Create' })       // Updated
    await user.click(submitButton)
    
    expect(submitButton).toBeDisabled()
    // Note: The button text doesn't change to "Creating..." in the actual component
  })

  test('handles file upload for avatar', async () => {
    const user = userEvent.setup()
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return 'user-123'
      return null
    })
    
    renderWithRouter(<AddCharacterPage />)
    
    // The file input is hidden, so we need to find it by its ID
    const fileInput = document.querySelector('#image') as HTMLInputElement
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' })
    
    await user.upload(fileInput, file)
    
    expect(fileInput.files?.[0]).toBe(file)
    expect(fileInput.files).toHaveLength(1)
  })

  test('handles color input change', async () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'user') return 'user-123'
      return null
    })
    
    renderWithRouter(<AddCharacterPage />)
    
    const colorInput = screen.getByLabelText('Color')
    
    // For color inputs, use fireEvent.change instead of user.clear and user.type
    fireEvent.change(colorInput, { target: { value: '#ff0000' } })
    
    expect(colorInput).toHaveValue('#ff0000')
  })
})