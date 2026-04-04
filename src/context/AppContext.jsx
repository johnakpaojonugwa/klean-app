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
import { Skeleton } from "@/components/ui/skeleton";

const AppContext = createContext();

const getInitialUser = () => {
  try {
    const raw = sessionStorage.getItem("klean_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
console.log("Current User:", getInitialUser)

const getInitialToken = () => sessionStorage.getItem("klean_token") || null;

export const AppProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const baseURL =
    import.meta.env.VITE_API_BASE || "http://localhost:5000/api/v1";

  const [userToken, setUserToken] = useState(getInitialToken);

  const {
    data: queryResponse,
    isLoading: isFetchingUser,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!userToken,
    staleTime: 5 * 60 * 1000,
    initialData: () => {
      const stored = getInitialUser();
      return stored ? { data: stored } : undefined;
    },
  });

  // Extract the actual user object 
const user = useMemo(() => {
    const employees = queryResponse?.data?.employees || [];
    const storedUser = getInitialUser();
    
    if (!storedUser) return null;

    // Find the current user in the API response by matching IDs
    const serverUser = employees.find(
      (employee) => employee._id === (storedUser._id || storedUser.id)
    );

    // Fallback to storedUser 
    return serverUser || storedUser;
  }, [queryResponse]);
  // 3. Auth Actions
  const logout = useCallback(() => {
    sessionStorage.removeItem("klean_token");
    sessionStorage.removeItem("klean_refresh");
    sessionStorage.removeItem("klean_user");
    setUserToken(null);
    queryClient.setQueryData(["currentUser"], null);
    queryClient.removeQueries();
    window.location.href = "/admin-auth";
  }, [queryClient]);

  const login = useCallback(
    (userData, token, refreshToken = null) => {
      if (token) sessionStorage.setItem("klean_token", token);
      if (refreshToken) sessionStorage.setItem("klean_refresh", refreshToken);
      sessionStorage.setItem("klean_user", JSON.stringify(userData));      
      // Store phone number separately if available
      if (userData?.phoneNumber || userData?.phone) {
        sessionStorage.setItem("klean_user_phone", userData.phoneNumber || userData.phone);
      }
            setUserToken(token);
      queryClient.setQueryData(["currentUser"], { data: userData });
    },
    [queryClient],
  );

  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      logout();
    }
  }, [isError, error, logout]);

  // RBAC & Context Value Memoization
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
        <p className="mt-6 text-slate-600">Initializing Klean Laundry Systems...</p>
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
