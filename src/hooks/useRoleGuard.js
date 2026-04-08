import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { hasRequiredRole } from '@/constants/roles';

/**
 * Custom hook for role-based access control (RBAC)
 * Ensures decisions are only made after user data is fully synced.
 */
export const useRoleGuard = (allowedRoles = []) => {
  const { user, isAuthenticated, initializing, loadingUser } = useApp();

  // STAGE 1: Determine if we are still in a "waiting" state.
  // We wait if the app is initializing, if a fetch is active, 
  // or if we have a token (isAuthenticated) but the user profile hasn't arrived yet.
  const isLoading = initializing || loadingUser || (isAuthenticated && !user);

  const { hasAccess, isDenied } = useMemo(() => {
    // 1. If still loading, nobody is "allowed" or "denied" yet.
    if (isLoading) {
      return { hasAccess: false, isDenied: false };
    }

    // 2. If definitely not logged in, access is false but it's not a "role denial."
    if (!isAuthenticated) {
      return { hasAccess: false, isDenied: false };
    }

    // 3. If no specific roles are required for this route, access is granted.
    if (allowedRoles.length === 0) {
      return { hasAccess: true, isDenied: false };
    }

    // 4. Calculate actual access based on the user's role.
    const allowed = hasRequiredRole(user?.role, allowedRoles);
    
    return {
      hasAccess: allowed,
      isDenied: !allowed, // Only 'true' if user exists but has the wrong role.
    };
  }, [user, isAuthenticated, isLoading, allowedRoles]);

  // Debugging log - only visible in development
  if (import.meta.env.DEV && !isLoading) {
    console.log("🔐 Role Guard:", {
      role: user?.role,
      required: allowedRoles,
      hasAccess,
      isDenied
    });
  }

  return {
    isLoading,
    isAuthenticated,
    user,
    hasAccess,
    isDenied,
    userRole: user?.role || null,
  };
};

export default useRoleGuard;