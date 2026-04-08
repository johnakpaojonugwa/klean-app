import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { hasRequiredRole } from '@/constants/roles';

export const useRoleGuard = (allowedRoles = []) => {
  const { user, isAuthenticated, initializing, loadingUser } = useApp();

  const isLoading = initializing || loadingUser || (isAuthenticated && !user);

  const { hasAccess, isDenied } = useMemo(() => {
    if (isLoading) {
      return { hasAccess: false, isDenied: false };
    }

    if (!isAuthenticated) {
      return { hasAccess: false, isDenied: false };
    }

    if (allowedRoles.length === 0) {
      return { hasAccess: true, isDenied: false };
    }

    const allowed = hasRequiredRole(user?.role, allowedRoles);
    return {
      hasAccess: allowed,
      isDenied: !allowed, 
    };
  }, [user, isAuthenticated, isLoading, allowedRoles]);
  console.log("Role Guard:", user?.role, allowedRoles);

  return {
    isLoading,
    isAuthenticated,
    user,
    hasAccess,
    isDenied,
    userRole: user?.role || null,
  };
};