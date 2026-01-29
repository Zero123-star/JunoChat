// API Configuration
// Use environment variable in production, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get full API URL
export const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;

// Helper function to get media URL (for images, avatars, etc.)
export const getMediaUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};
