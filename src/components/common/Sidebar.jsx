import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext"; // Import your context
import { getNavItemsForRole, RBAC_INFO } from "@/constants/roles"; // Import the roles config we created
import { Button } from "@/components/ui/Button";

export default function Sidebar({
  collapsed,
  currentPath,
  handleLogout,
}) {
  const { user } = useApp();

  // 1. Get filtered links based on the role in your central config
  const navLinks = useMemo(() => {
    return getNavItemsForRole(user?.role);
  }, [user?.role]);

  // 2. Find the specific info (label/color) for the current user's role
  const roleInfo = useMemo(() => {
    return RBAC_INFO.find((r) => r.role === user?.role) || { label: "User" };
  }, [user?.role]);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } bg-indigo-950 text-white shadow-xl`}
    >
      {/* Header */}
      <div>
        {/* Brand Logo Section */}
        <div
          className={`flex items-center gap-2 px-4 h-20 border-b border-white/10 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {/* Logo SVG */}
          <div className="relative shrink-0">
            <svg
              width="40"
              height="40"
              viewBox="0 0 100 100"
              className="relative drop-shadow-md"
            >
              <rect
                x="15"
                y="10"
                width="70"
                height="80"
                rx="12"
                fill="url(#sidebar_logo_grad)"
              />
              <circle
                cx="50"
                cy="55"
                r="28"
                stroke="white"
                strokeWidth="4"
                fill="none"
              />
              <defs>
                <linearGradient
                  id="sidebar_logo_grad"
                  x1="50"
                  y1="10"
                  x2="50"
                  y2="90"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4F7DF3" />
                  <stop offset="1" stopColor="#3B63C9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter leading-none uppercase">
                klean<span className="text-indigo-400 animate-pulse">.</span>
              </span>
              <span className="text-[10px] text-indigo-300/60 font-bold uppercase tracking-widest mt-1">
                {roleInfo.label} {/* Dynamic Role Label */}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col mt-6 space-y-1 px-3">
          {navLinks.map((link) => {
            // Check for active status
            const isActive =
              currentPath === link.href ||
              currentPath.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-indigo-200 hover:bg-orange-500/10 hover:text-white"
                }`}
              >
                <span
                  className={`${
                    isActive ? "text-white" : "text-indigo-300/50 group-hover:text-indigo-100"
                  } transition-colors`}
                >
                  {/* Render the Icon directly since it's a component in our config */}
                  <link.icon size={20} />
                </span>

                {!collapsed && <span className="truncate">{link.label}</span>}

                {/* Active Indicator Bar */}
                {isActive && !collapsed && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-white text-indigo-900 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl whitespace-nowrap">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-lg font-bold text-indigo-300/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}