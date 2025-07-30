import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../store';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);
  const location = useLocation();


  if (status === 'loading') {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};