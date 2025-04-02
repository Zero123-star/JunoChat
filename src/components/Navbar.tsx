import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="blue-500 bg-gradient-to-r from-purple-400 to-pink-500 p-4 fixed top-0 left-0 right-0 z-100 shadow-lg">
      <ul className="flex space-x-4 white">
        <li>
          <Link to="/home" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/characters" className="hover:underline">Personaje</Link>
        </li>
        <li>
          <Link to="/login" className="hover:underline">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;