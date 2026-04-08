import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function ProtectedRoute ({ children, requiredRole }) {
  const { isAuthenticated, user, isSuperAdmin } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};