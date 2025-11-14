import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debug: Log the user object and required role
  console.log("ProtectedRoute - User:", user, "Required Role:", requiredRole);

  // If user is not authenticated, redirect to login
  if (!user) {
    console.log("Redirecting to login (no user)");
    return <Navigate to="/" replace />;
  }

  // Define default redirect routes for each role (for fallback or unauthorized access)
  const defaultRoutes = {
    Student: "/dashboard/student/grades",
    Teacher: "/dashboard/teacher/classes",
    Admin: "/dashboard/admin/manage-accounts",
  };

  // If no specific role is required (e.g., /dashboard), allow all authenticated users
  if (!requiredRole) {
    console.log("No required role, allowing access to /dashboard");
    return <Outlet />;
  }

  // Check if user has the required role (case-insensitive comparison)
  const userType = user.user_type?.toLowerCase();
  const requiredType = requiredRole?.toLowerCase();
  if (userType && requiredType && userType === requiredType) {
    console.log("User has required role, granting access");
    return <Outlet />;
  }

  // Display "Can't Access" message for unauthorized access
  console.log("User lacks required role, showing Can't Access message");
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600">Can't Access</h2>
        <p className="text-lg text-gray-700 mt-2">
          This page is only available for{" "}
          <span className="font-semibold">{requiredRole}s</span>.
        </p>
        <button
          className="mt-4 btn btn-primary"
          onClick={() => navigate(defaultRoutes[user.user_type] || "/dashboard")}
        >
          Go to Your Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProtectedRoute;