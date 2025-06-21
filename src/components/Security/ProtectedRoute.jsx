import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location, message: 'Please sign in to continue' }} />;
  }

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace state={{ from: location, message: 'Session expired. Please sign in again.' }} />;
    }
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace state={{ from: location, message: 'Invalid token. Please sign in.' }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
