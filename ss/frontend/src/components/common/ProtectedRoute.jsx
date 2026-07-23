import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles.length && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}
