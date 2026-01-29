import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import Tailwind CSS
import { loadTheme } from './theme';

// Load saved theme before app renders

import { AuthProvider } from './context/AuthContext';
loadTheme();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
