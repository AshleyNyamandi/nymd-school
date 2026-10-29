// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router';
import useAuth from '../hooks/useAuth';


const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { role, email, userId } = useAuth();

  if (!role && !email && !userId) {
    return <Navigate to="/admin/sign-in"  replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;  