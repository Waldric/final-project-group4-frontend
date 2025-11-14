import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useAuth();

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Define default redirect routes for each role
  const defaultRoutes = {
    Student: "/dashboard/student/grades",
    Teacher: "/dashboard/teacher/classes",
    Admin: "/dashboard/admin/manage-accounts",
  };

  // If no specific role is required (e.g., /dashboard), allow all authenticated users
  if (!requiredRole) {
    return <Outlet />;
  }

  // Check if user has the required role
  if (user.user_type === requiredRole) {
    return <Outlet />;
  }

  // Redirect to the user's default route if unauthorized
  return <Navigate to={defaultRoutes[user.user_type] || "/dashboard"} replace />;
};

export default ProtectedRoute;