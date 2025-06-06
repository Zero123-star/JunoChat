import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { CharacterCard } from '../CharacterCard'

// Mock the entire API module properly
vi.mock('@/api', () => ({
  get_first_chat: vi.fn()
}))

// Mock react-router-dom navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

const mockCharacter = {
  id: '1',
  name: 'Naruto Uzumaki',
  description: 'A young ninja with dreams of becoming Hokage',
  avatar: '/avatars/naruto.webp',
  source: 'Naruto',
  personality: 'Energetic and determined',
  created_at: '2024-01-01T00:00:00Z',
  tags: 'ninja, hokage',
  creator: 'Masashi Kishimoto',
  color: '#ff6b35'
}

// Import the mocked API function
import * as api from '@/api'

describe('CharacterCard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.clearAllMocks()
    localStorage.clear()
    
    // Reset all mocks
    vi.mocked(api.get_first_chat).mockClear()
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    )
  }

  test('renders character information correctly', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    
    expect(screen.getByText('Naruto Uzumaki')).toBeInTheDocument()
    expect(screen.getByText('A young ninja with dreams of becoming Hokage')).toBeInTheDocument()
    
    const avatar = screen.getByAltText('Naruto Uzumaki')
    expect(avatar).toHaveAttribute('src', '/avatars/naruto.webp')
  })

  test('navigates to character details when card is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    
    // Click on the card (but not on the button)
    const cardContainer = screen.getByText('Naruto Uzumaki').closest('div[class*="relative"]')
    await user.click(cardContainer!)
    
    expect(mockNavigate).toHaveBeenCalledWith('/character/1')
  })

  test('handles chat navigation without user ID', async () => {
    const user = userEvent.setup()
    
    // Don't set user ID in localStorage
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    
    const chatButton = screen.getByRole('button', { name: /start chatting/i })
    await user.click(chatButton)
    
    // Should navigate to chat without state when no user ID
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/chat/1')
    })
  })

  test('prevents event bubbling when chat button is clicked', async () => {
    const user = userEvent.setup()
    
    vi.mocked(api.get_first_chat).mockResolvedValue({ chat_id: 'chat-123' })
    localStorage.setItem('user', 'user-456')
    
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    
    const chatButton = screen.getByRole('button', { name: /start chatting/i })
    await user.click(chatButton)
    
    // Wait a bit to ensure all async operations complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
    
    // The card click navigation should not be called when button is clicked
    expect(mockNavigate).not.toHaveBeenCalledWith('/character/1')
  })

  test('displays correct button text and icon', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    
    const chatButton = screen.getByRole('button', { name: /start chatting/i })
    expect(chatButton).toBeInTheDocument()
    expect(chatButton).toHaveTextContent('Start Chatting')
  })

  test('applies correct CSS classes for styling', () => {
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    
    const cardContainer = screen.getByText('Naruto Uzumaki').closest('div[class*="relative"]')
    
    expect(cardContainer).toHaveClass('relative', 'group', 'rounded-xl', 'overflow-hidden')
  })

  test('handles missing character color gracefully', () => {
    const characterWithoutColor = { ...mockCharacter, color: undefined }
    
    renderWithRouter(<CharacterCard character={characterWithoutColor} />)
    
    // Should still render without errors
    expect(screen.getByText('Naruto Uzumaki')).toBeInTheDocument()
  })

  test('handles API error when getting first chat', async () => {
    const user = userEvent.setup()
    
    // Mock API to reject
    vi.mocked(api.get_first_chat).mockRejectedValue(new Error('API Error'))
    localStorage.setItem('user', 'user-456')
    
    // Mock console.error to prevent error output in test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    renderWithRouter(<CharacterCard character={mockCharacter} />)
    
    const chatButton = screen.getByRole('button', { name: /start chatting/i })
    
    // Should not throw error when API fails
    await expect(user.click(chatButton)).resolves.not.toThrow()
    
    // Clean up console spy
    consoleSpy.mockRestore()
  })
})