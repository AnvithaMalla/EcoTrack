import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from './ui/LoadingScreen';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};
