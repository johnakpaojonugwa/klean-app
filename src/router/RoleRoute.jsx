import { Navigate, Outlet } from "react-router-dom";
import useAuthGuard from "@/hooks/useAuthGuard";
import { normalizeRole } from "@/constants/roles";

export default function RoleRoute({ allowedRoles = [] }) {
  const { isAuthenticated, loadingUser, user, location, loadingView } = useAuthGuard();

  if (!isAuthenticated) {
    const loginPath = location.pathname.startsWith("/admin") ? "/admin/login" : "/login";
    return <Navigate to={loginPath} replace />;
  }

  if (loadingUser || !user || !user.role) {
    return loadingView;
  }

  const userRole = normalizeRole(user?.role);
  const allowed = allowedRoles.map(normalizeRole);

  if (!allowed.includes(userRole)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
