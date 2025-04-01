import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const adminToken = localStorage.getItem("adminToken");
  const location = useLocation();

  // 🔍 Debug: Check if token exists
  console.log("Admin Token from localStorage:", adminToken);
  console.log("Current Location:", location.pathname);

  // ✅ If no token, restrict access and redirect to login
  if (!adminToken && location.pathname !== "/admin") {
    console.log("🚫 No token found. Redirecting to login...");
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
