import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Wraps a route so it is only accessible when a JWT token exists in localStorage.
 * Unauthenticated users are sent to /login and the original path is stored in
 * state so they can be redirected back after successful login.
 */
const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
