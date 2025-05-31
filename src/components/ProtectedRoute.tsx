import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Incognito mode: allow all users (guests) to access protected routes
  // Just render <Outlet /> unconditionally
  return <Outlet />;
};

export default ProtectedRoute;
