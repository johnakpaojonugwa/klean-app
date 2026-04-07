import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Menu,
  X,
  Calendar,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils"; // Importing your new helper

export default function Header() {
  const { user, logout, isSuperAdmin, isManager, isStaff } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);
  const mobileCloseRef = useRef(null);

  const isAuthPage = location.pathname === "/auth" || location.pathname === "/signup";
  const shouldShowSolidHeader = isScrolled || isAuthPage;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate("/auth");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        shouldShowSolidHeader
          ? "py-3 bg-white shadow-lg shadow-slate-200/20 border-b border-slate-100"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <Link to="/" className="group flex items-center gap-3 shrink-0">
          <svg
            width="36"
            height="36"
            viewBox="0 0 100 100"
            className="drop-shadow-sm group-hover:rotate-12 transition-transform duration-500"
          >
            <rect x="15" y="10" width="70" height="80" rx="12" fill="url(#klean_grad)" />
            <circle cx="50" cy="55" r="28" stroke="white" strokeWidth="4" />
            <defs>
              <linearGradient id="klean_grad" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F7DF3" />
                <stop offset="1" stopColor="#3B63C9" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex flex-col">
            <h1 className={cn(
                "text-lg font-black tracking-tighter leading-none uppercase transition-colors",
                shouldShowSolidHeader ? "text-[#0F172A]" : "text-white"
              )}>
              klean<span className="text-[#4F7DF3]">.</span>
            </h1>
            <span className="text-[8px] text-[#94A3B8] font-bold uppercase tracking-[0.4em] mt-1">
              Enterprise
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105",
                location.pathname === link.href 
                  ? "text-[#4F7DF3]" 
                  : shouldShowSolidHeader ? "text-slate-600 hover:text-[#4F7DF3]" : "text-white/90 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+2348105167156"
            className={cn(
              "hidden xl:flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              shouldShowSolidHeader ? "bg-slate-50 text-[#0F172A]" : "bg-white/10 text-white"
            )}
          >
            <Phone size={14} className="text-[#4F7DF3]" />
            <span className="text-[12px] font-bold">+234 810 138 9942</span>
          </a>

          <Link to="/booking" className="hidden md:flex bg-[#4F7DF3] text-white px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest items-center gap-2 shadow-lg shadow-[#4F7DF3]/20 hover:brightness-110 active:scale-95 transition-all">
            <Calendar size={14} />
            Book Online
          </Link>

          {/* AUTH & MOBILE TOGGLE */}
          <div className="flex items-center gap-2 border-l border-slate-200 ml-2 pl-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  ref={profileButtonRef}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-haspopup="true"
                  aria-controls="profile-menu"
                  aria-expanded={isProfileOpen}
                  className="flex items-center gap-2 p-1 outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#4F7DF3] flex items-center justify-center text-white shadow-md">
                    <User size={16} />
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      shouldShowSolidHeader ? "text-slate-400" : "text-white/60",
                      isProfileOpen && "rotate-180"
                    )}
                  />
                </button>

                {isProfileOpen && (
                  <div id="profile-menu" role="menu" aria-labelledby="profile-button" className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 animate-in fade-in zoom-in-95 origin-top-right">
                    <div className="px-3 py-2.5 border-b border-slate-50 mb-1">
                      <p className="text-[11px] font-black text-[#0F172A] truncate uppercase tracking-tight">
                        {user.fullname}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium truncate">
                        {user.email}
                      </p>
                      {(isSuperAdmin || isManager || isStaff) && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded text-[8px] font-bold text-blue-700 uppercase tracking-tight">
                          <Shield size={10} />
                          Administrator
                        </div>
                      )}
                    </div>
                    {(isSuperAdmin || isManager || isStaff) && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/dashboard");
                            setIsProfileOpen(false);
                            profileButtonRef.current?.focus();
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Shield size={14} /> Admin Dashboard
                        </button>
                        <div className="my-1 border-t border-slate-100"></div>
                      </>
                    )}
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsProfileOpen(false);
                        profileButtonRef.current?.focus();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#4F7DF3] transition-all"
                    >
                      <Settings size={14} /> Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  "text-[11px] font-black uppercase tracking-widest px-2 transition-colors",
                  shouldShowSolidHeader ? "text-[#4F7DF3]" : "text-white"
                )}
              >
                Sign In
              </Link>
            )}

            <button
              aria-label="Open menu"
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                shouldShowSolidHeader ? "bg-slate-100 text-slate-600" : "bg-white/10 text-white"
              )}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileMenuOpen}
        className={cn(
          "fixed inset-0 bg-white z-[150] p-6 flex flex-col transition-transform duration-500 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-10">
          <span className="font-black tracking-tighter text-xl text-[#0F172A]">
            KLEAN<span className="text-[#4F7DF3]">.</span>
          </span>
          <button
            ref={mobileCloseRef}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 bg-slate-100 rounded-full text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-black text-[#0F172A] flex justify-between items-center border-b border-slate-50 pb-4"
            >
              {link.name} <ChevronRight className="text-[#4F7DF3]" size={20} />
            </Link>
          ))}
          <div className="mt-4 space-y-4">
            <a href="tel:+2348105167156" className="flex items-center gap-4 text-sm font-bold text-[#0F172A] bg-slate-50 p-4 rounded-xl">
              <Phone size={18} className="text-[#4F7DF3]" /> +234 810 516 7156
            </a>
            <button className="w-full bg-[#4F7DF3] text-white py-4 rounded-xl font-black tracking-widest text-[11px] shadow-lg shadow-[#4F7DF3]/20">
              BOOK ONLINE NOW
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}
