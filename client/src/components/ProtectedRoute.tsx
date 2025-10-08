import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAdminAuth();

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
