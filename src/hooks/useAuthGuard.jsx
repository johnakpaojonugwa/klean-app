import { useLocation, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function useAuthGuard() {
  const { isAuthenticated, loadingUser, user } = useApp();
  const location = useLocation();

  const authRedirect = (to = "/login") => (
    <Navigate to={to} state={{ from: location }} replace />
  );

  const loadingView = (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4 w-full max-w-sm">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );

  return { isAuthenticated, loadingUser, user, location, authRedirect, loadingView };
}
