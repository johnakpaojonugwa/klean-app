import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_ROLES } from "@/constants/roles";
import { useApp } from "@/context/AppContext";
import useRoleGuard from "@/hooks/useRoleGuard";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { initializing } = useApp();
  const { isLoading, isAuthenticated, isDenied } = useRoleGuard(ADMIN_ROLES);

  // 1. Wait for both the AppContext initialization AND the Guard fetch
  if (initializing || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="space-y-4 w-full max-w-sm">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <span className="mt-4 text-slate-500 font-medium">
          Verifying admin access...
        </span>
      </div>
    );
  }

  // 2. ONLY check these after we are certain loading is finished
  if (!isAuthenticated) {
    // If not logged in, take them to the admin login page
    return <Navigate to="/admin-auth" state={{ from: location }} replace />;
  }

  if (isDenied) {
    // If logged in but not an admin, take them to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Success
  return children;
}
