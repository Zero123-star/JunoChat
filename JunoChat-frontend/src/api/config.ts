// API Base URL configuration
// Dynamically determines the API endpoint based on environment
export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://project-inginerie-software-juno-production.up.railway.app'
    : 'http://localhost:8000';
