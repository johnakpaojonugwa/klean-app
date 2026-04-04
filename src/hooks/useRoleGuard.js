/**
 * Custom hook for role-based access control
 */
import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { hasRequiredRole } from '@/constants/roles';

export const useRoleGuard = (allowedRoles = []) => {
  const { user, isAuthenticated, initializing, loadingUser } = useApp();

  // Combine both loading states to ensure we aren't making decisions mid-fetch
  const isLoading = initializing || loadingUser;

  const { hasAccess, isDenied } = useMemo(() => {
    // If we are still loading, nobody is "allowed" or "denied" yet
    if (isLoading) {
      return { hasAccess: false, isDenied: false };
    }

    // If no roles are required, access is granted by default (if authenticated)
    if (allowedRoles.length === 0) {
      return { hasAccess: isAuthenticated, isDenied: false };
    }

    // If authenticated and we have the user, calculate access
    if (isAuthenticated && user) {
      const allowed = hasRequiredRole(user.role, allowedRoles);
      return {
        hasAccess: allowed,
        isDenied: !allowed, // Only deny if we definitely have a user and they lack the role
      };
    }

    // Default state (likely not authenticated)
    return { hasAccess: false, isDenied: false };
  }, [user, isAuthenticated, isLoading, allowedRoles]);

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