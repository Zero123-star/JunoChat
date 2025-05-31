import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css'; // Tailwind CSS

const queryClient = new QueryClient();

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const SimplePage = lazy(() => import('./pages/SimplePage'));
const CharactersPage = lazy(() => import('./pages/CharactersPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const CharacterDetails = lazy(() => import('./components/CharacterDetails'));
const AddCharacterPage = lazy(() => import('./pages/AddCharacterPage'));
const EditCharacterPage = lazy(() => import('./pages/EditCharacterPage'));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-center" />
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
        <Navbar />
        <div className="pt-16 sm:pt-20">
          <Suspense fallback={<div className="text-center text-purple-700 p-10">Loading page...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SimplePage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/characters/add" element={<AddCharacterPage />} />
                <Route path="/characters/edit/:id" element={<EditCharacterPage />} />
                <Route path="/chat/:characterId" element={<ChatPage />} />
                <Route path="/character/:id" element={<CharacterDetails />} />
              </Route>

              {/* 404 fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
