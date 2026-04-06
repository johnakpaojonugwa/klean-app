import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/api.js";
import { ROLES } from "@/constants/roles";
import { Skeleton } from "@/components/ui/Skeleton";

const AppContext = createContext();

// Centralized Storage Helpers
const getStoredUser = () =>
  JSON.parse(sessionStorage.getItem("klean_user") || "null");
const getStoredToken = () => sessionStorage.getItem("klean_token") || null;

export const AppProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const baseURL =
    import.meta.env.VITE_API_BASE || "https://klean-dev.onrender.com/api/v1";

  const [userToken, setUserToken] = useState(getStoredToken);

  // React Query for Profile Data
  const {
    data: userData,
    isLoading: isFetchingUser,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!userToken,
    staleTime: 5 * 60 * 1000,
    // Use the stored user as the starting point so the UI is instant
    initialData: () => {
      const stored = getStoredUser();
      return stored ? { data: stored } : undefined;
    },
    // Map the nested API response directly to the user object
    select: (response) => response?.data || response,
  });

  // The final user object (Falls back to storage if API hasn't returned yet)
  const user = userData || getStoredUser();

  // Auth Actions
  const logout = useCallback(() => {
    sessionStorage.clear(); // Safety first
    setUserToken(null);
    queryClient.setQueryData(["currentUser"], null);
    queryClient.removeQueries();
    window.location.href = "/admin-auth";
  }, [queryClient]);

  const login = useCallback(
    (userData, token, refreshToken = null) => {
      sessionStorage.setItem("klean_token", token);
      if (refreshToken) sessionStorage.setItem("klean_refresh", refreshToken);
      sessionStorage.setItem("klean_user", JSON.stringify(userData));

      setUserToken(token);
      // Directly seed the cache with the new user object
      queryClient.setQueryData(["currentUser"], userData);
    },
    [queryClient],
  );

  // Handle Global 401s
  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      logout();
    }
  }, [isError, error, logout]);

  // 4. RBAC Logic
  const rbac = useMemo(() => {
    const role = user?.role;
    return {
      isSuperAdmin: role === ROLES.SUPER_ADMIN,
      isManager: role === ROLES.BRANCH_MANAGER,
      isStaff: role === ROLES.STAFF,
      isCustomer: role === ROLES.CUSTOMER,
      isManagement: [
        ROLES.SUPER_ADMIN,
        ROLES.BRANCH_MANAGER,
        ROLES.STAFF,
      ].includes(role),
      canAccessBranch: (branchId) =>
        role === ROLES.SUPER_ADMIN || user?.branchId === branchId,
    };
  }, [user]);

  const isInitializing = !!userToken && isFetchingUser && !user;

  const contextValue = useMemo(
    () => ({
      user,
      userToken,
      baseURL,
      login,
      logout,
      isAuthenticated: !!userToken && !!user && !isError,
      loadingUser: isFetchingUser,
      initializing: isInitializing,
      branchId: user?.branchId?._id || user?.branchId || null,
      ...rbac,
    }),
    [
      user,
      userToken,
      isError,
      isFetchingUser,
      rbac,
      login,
      logout,
      baseURL,
      isInitializing,
    ],
  );

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="space-y-4 w-full max-w-sm">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <p className="mt-6 text-slate-600">
          Initializing Klean Laundry Systems...
        </p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
