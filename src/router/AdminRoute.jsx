import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";
import { ADMIN_ROLES } from "@/constants/roles";
import { useRoleGuard } from "@/hooks/useRoleGuard";

/**
 * Route wrapper that restricts access to users with Admin roles.
 */
export default function AdminRoute({ children }) {
  const location = useLocation();
  
  // Initialize the guard with your predefined admin roles
  const { isLoading, isAuthenticated, isDenied } = useRoleGuard(ADMIN_ROLES);

  // 1. Show loading state while verifying credentials
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="space-y-4 w-full max-w-sm p-6">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Verifying administrative access...
        </p>
      </div>
    );
  }

  // 2. If not authenticated at all, redirect to the specific admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin-auth" state={{ from: location }} replace />;
  }

  // 3. If authenticated but role doesn't match, send to unauthorized
  if (isDenied) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Access Granted
  return children;
}