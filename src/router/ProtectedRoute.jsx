import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function ProtectedRoute ({ children, requiredRole }) {
  const { isAuthenticated, user, isSuperAdmin } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the current location to return later
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && !isSuperAdmin) {
    // If they don't have the role (and aren't a super admin), boot to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};