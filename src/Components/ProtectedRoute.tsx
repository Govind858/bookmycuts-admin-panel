import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute – renders child routes only when an accessToken
 * exists in localStorage. Otherwise redirects to the login page.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
