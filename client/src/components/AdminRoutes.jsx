import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
