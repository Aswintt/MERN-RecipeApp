import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  // Allow access to login route
  if (location.pathname === "/admin") {
    return <Outlet />;
  }

  // Block access to protected routes if no token
  if (!adminToken) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
