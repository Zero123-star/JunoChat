

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import SimplePage from './pages/SimplePage';
import CharactersPage from './pages/CharactersPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFoundPage';
import './index.css'; // Importă Tailwind CSS
import ChatPage from './pages/ChatPage';
import CharacterDetails from './components/CharacterDetails';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-center" />
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
        <Navbar />
        <div className="pt-16 sm:pt-20"> {/* Spațiu pentru navbar */}
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<SimplePage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/chat/:characterId" element={<ChatPage />} /> 
            <Route path="/character/:id" element={<CharacterDetails />} /> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;