import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: any) => state.auth);

  return user?.email ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
