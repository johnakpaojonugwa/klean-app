import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { useApp } from "@/context/AppContext";
import { Suspense, useState, useMemo } from "react";
import { showError } from "@/hooks/useToast";
import { 
  Home, 
  Loader2, 
  ChevronRight 
} from "lucide-react";

// Import the items for breadcrumb matching
import { SIDEBAR_NAV_ITEMS } from "@/constants/roles";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, user, loadingUser } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Constants for UI
  const displayName = user?.fullname || user?.username || "Admin";
  const displayEmail = user?.email || "admin@example.com";

  /**
   * Breadcrumb Logic: Matches the current path against our config 
   * to show the correct label (e.g., "/dashboard/inventory" -> "Inventory")
   */
  const currentPage = useMemo(() => {
  const cleanPath = pathname.endsWith("/") && pathname !== "/" 
    ? pathname.slice(0, -1) 
    : pathname;

  const specificLink = SIDEBAR_NAV_ITEMS.find((link) => 
    link.href !== "/dashboard" && (cleanPath === link.href || cleanPath.startsWith(link.href + "/"))
  );

  if (specificLink) return specificLink.label;

  if (cleanPath === "/dashboard") return "Overview";

  return "Dashboard";
}, [pathname]);

  const handleLogout = async () => {
    try {
      await logout?.();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      showError("Logout failed. Please try again.");
    }
  };

  // Show global loader while checking user session
  if (loadingUser || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar now manages its own links internally 
          using getNavItemsForRole(user.role) 
      */}
      <Sidebar
        collapsed={collapsed}
        currentPath={pathname}
        handleLogout={handleLogout}
      />

      {/* Main content area */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          adminName={displayName}
          adminEmail={displayEmail}
          handleLogout={handleLogout}
        />

        {/* Dynamic Page content */}
        <section className="mt-16 p-6 md:p-8 min-h-[calc(100vh-64px)]">
          
          {/* Centralized Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 bg-white w-fit px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
            <Home size={14} className="text-indigo-500" />
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Admin
            </span>
            <ChevronRight size={12} className="text-slate-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {currentPage}
            </h2>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
              </div>
            }
          >
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Outlet />
            </div>
          </Suspense>
        </section>
      </main>
    </div>
  );
}