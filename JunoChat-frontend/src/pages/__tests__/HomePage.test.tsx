import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { toast } from 'sonner'

// Hoist mocks
const mockFetchCharacters = vi.hoisted(() => vi.fn())
const mockNavigate = vi.hoisted(() => vi.fn())

// Mock API
vi.mock('@/api', () => ({
  fetchCharacters: mockFetchCharacters
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

// Mock all the components
vi.mock('@/components/HeroSection', () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>
}))

vi.mock('@/components/CharacterGrid', () => ({
  default: ({ characters, onSelectCharacter }: any) => (
    <div data-testid="character-grid">
      Character Grid with {characters.length} characters
      {characters.length > 0 && (
        <button onClick={() => onSelectCharacter(characters[0])}>
          Select First Character
        </button>
      )}
    </div>
  )
}))

vi.mock('@/components/CharacterCarousel', () => ({
  default: ({ characters, onSelect }: any) => (
    <div data-testid="character-carousel">
      Character Carousel with {characters.length} characters
      {characters.length > 0 && (
        <button onClick={() => onSelect(characters[0])}>
          Select First Character
        </button>
      )}
    </div>
  )
}))

vi.mock('@/components/GlassmorphicContainer', () => ({
  default: ({ children }: any) => <div data-testid="glassmorphic-container">{children}</div>
}))

vi.mock('@/components/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}))

import HomePage from '../HomePage'

const mockCharacters = [
  {
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
  },
  {
    id: '2',
    name: 'Sasuke Uchiha',
    description: 'A skilled ninja from the Uchiha clan',
    avatar: '/avatars/sasuke.jpg',
    source: 'Naruto',
    personality: 'Cool and determined',
    created_at: '2024-01-01T00:00:00Z',
    tags: 'ninja, uchiha',
    creator: 'Masashi Kishimoto',
    color: '#1a1a2e'
  }
]

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchCharacters.mockResolvedValue(mockCharacters)
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    )
  }

  test('renders loading state initially', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('Loading characters...')).toBeInTheDocument()
  })

  test('fetches and displays characters successfully', async () => {
    renderWithRouter(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    })

    expect(mockFetchCharacters).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('character-grid')).toBeInTheDocument()
    expect(screen.getByTestId('character-carousel')).toBeInTheDocument()
    expect(screen.getByText('Character Grid with 2 characters')).toBeInTheDocument()
    expect(screen.getByText('Character Carousel with 2 characters')).toBeInTheDocument()
  })

  test('handles API error gracefully', async () => {
    const mockError = new Error('Failed to fetch characters')
    mockFetchCharacters.mockRejectedValue(mockError)
    
    renderWithRouter(<HomePage />)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Nu am putut încărca personajele. Încearcă din nou!')
    })

    // Should still show components even with error
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })

  test('handles character selection', async () => {
    renderWithRouter(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('character-grid')).toBeInTheDocument()
    })

    // Get the specific button within the character-grid component
    const characterGrid = screen.getByTestId('character-grid')
    const selectButton = within(characterGrid).getByText('Select First Character')
    selectButton.click()

    expect(toast.success).toHaveBeenCalledWith('Starting chat with Naruto Uzumaki')
  })

  test('renders all main sections', async () => {
    renderWithRouter(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    })

    expect(screen.getByTestId('character-carousel')).toBeInTheDocument()
    expect(screen.getByTestId('character-grid')).toBeInTheDocument()
    expect(screen.getByText('FEATURED CHARACTERS')).toBeInTheDocument()
  })

  test('handles empty characters array', async () => {
    mockFetchCharacters.mockResolvedValue([])
    
    renderWithRouter(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    })

    expect(screen.getByText('Character Grid with 0 characters')).toBeInTheDocument()
    expect(screen.getByText('Character Carousel with 0 characters')).toBeInTheDocument()
  })
})