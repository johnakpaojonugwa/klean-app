import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Menu,
  Settings,
  User,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import NotificationsDropdown from "@/components/common/NotificationsDropdown";
import { useApp } from "@/context/AppContext";

export default function Header({
  collapsed,
  setCollapsed,
  adminName = "Admin User",
  adminEmail = "admin@klean.com",
  handleLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useApp();

  // Get avatar and user info from context, fallback to props
  const displayName = user?.name || adminName;
  const displayEmail = user?.email || adminEmail;
  const avatarUrl = user?.avatar;

  return (
    <header
      className={`fixed top-0 right-0 h-20 flex items-center justify-between px-6 border-b bg-indigo-950 backdrop-blur-xl z-40 transition-all duration-300 border-white/10 ${
        collapsed ? "left-20" : "left-64"
      }`}
    >
      {/* LEFT SECTION: Navigation Control */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-white/10 text-white/70 rounded-lg shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* CENTER SECTION: Universal Search */}
      <div className="hidden md:flex items-center relative max-w-md w-full mx-8 group">
        <div className="absolute left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-white/50 group-focus-within:text-indigo-400 transition-colors" />
        </div>
        <Input
          type="text"
          placeholder="Search everything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-12 h-9 w-full bg-white/10 border-transparent rounded-full focus-visible:ring-2 focus-visible:ring-indigo-400/30 focus-visible:bg-white/20 focus-visible:border-indigo-400/50 transition-all text-sm text-white placeholder:text-white/40"
        />
        <div className="absolute right-3 flex items-center gap-1">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-sans text-[10px] font-medium text-white/50 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* RIGHT SECTION: Utility & Profile */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white/70 rounded-full hover:bg-white/10"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Support/Docs */}
        <Link to="/dashboard/profile">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex text-white/70 rounded-full hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Link>

        {/* Notifications */}
        <NotificationsDropdown />

        <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-white/10 transition-all outline-none"
            >
              <Avatar className="h-8 w-8 border-2 border-white/30 shadow-sm ring-1 ring-white/20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-indigo-500 text-white font-bold text-xs">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="text-sm font-bold text-white leading-none">
                  {displayName}
                </span>
                <span className="text-[10px] font-semibold text-white/60 mt-1 tracking-tight">
                  {displayEmail}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-white/60" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 p-2 rounded-xl border-white/10 shadow-xl mt-2 bg-white backdrop-blur border"
          >
            <DropdownMenuLabel className="px-3 py-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-slate-800">
                  {displayName}
                </p>
                <p className="text-xs text-slate-800/60 font-normal lowercase">
                  {displayEmail}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-white/10" />

            <div className="py-1">
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-indigo-700/50 focus:text-indigo-100 text-slate-800/80 hover:bg-indigo-50 transition-colors"
              >
                <Link
                  to="/dashboard/profile"
                  className="flex items-center w-full text-sm font-medium"
                >
                  <User className="mr-3 h-4 w-4 opacity-70" />
                  <span>Profile Account</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-indigo-700/50 focus:text-indigo-100 text-slate-800/80 hover:bg-indigo-50 transition-colors"
              >
                <Link
                  to="/dashboard/settings"
                  className="flex items-center w-full text-sm font-medium"
                >
                  <Settings className="mr-3 h-4 w-4 opacity-70" />
                  <span>Workspace Settings</span>
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-slate-100" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer rounded-lg px-3 py-2.5 font-bold text-sm mt-1 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
