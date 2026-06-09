import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export function ProtectedRoute({ children, requiredRole }) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'ADMIN' && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'TEACHER' && !['TEACHER', 'ADMIN'].includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
