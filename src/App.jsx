import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/layout/ErrorBoundary.jsx";
import AdminRoute from "@/router/AdminRoute.jsx";
import ScrollToTop from "@/utils/ScrollToTop.jsx";
import { getToasterConfig, getToastPosition, TOAST_STACKING } from "@/lib/toastConfig.js";
import "@/styles/toast.css";

// Lazy-loaded components for Admin Dashboard and Pages
const AdminLayout = lazy(() => import("@/admin/layout/AdminLayout.jsx"));
const AdminAuthPage = lazy(
  () => import("@/admin/admin-auth/AdminAuthPage.jsx"),
);
const Orders = lazy(() => import("@/admin/orders/Orders.jsx"));
const Inventory = lazy(() => import("@/admin/inventory/Inventory.jsx"));
const DashboardPage = lazy(() => import("@/admin/dashboard/DashboardPage.jsx"));
const Customers = lazy(() => import("@/admin/customers/Customers.jsx"));
const Employees = lazy(() => import("@/admin/employees/Employees.jsx"));
const Invoices = lazy(() => import("@/admin/invoices/Invoices.jsx"));
const Reports = lazy(() => import("@/admin/reports/Reports.jsx"));
const Locations = lazy(() => import("@/admin/locations/Locations.jsx"));
const Tracking = lazy(() => import("@/admin/tracking/Tracking.jsx"));
const Managers = lazy(() => import("@/admin/managers/Managers.jsx"));
const ProfilePage = lazy(() => import("@/admin/profile/ProfilePage.jsx"));
const Unauthorized = lazy(
  () => import("@/admin/unauthorized/Unauthorized.jsx"),
);

// Lazy-loaded components for Pages
const FrontendLayout = lazy(
  () => import("@/pages/frontendlayout/FrontendLayout.jsx"),
);
const Auth = lazy(() => import("@/pages/auth/Auth.jsx"));
const HomePage = lazy(() => import("@/pages/home/HomePage.jsx"));
const ServicesPage = lazy(() => import("@/pages/services/ServicesPage.jsx"));
const AboutPage = lazy(() => import("@/pages/about/AboutPage.jsx"));
const ContactPage = lazy(() => import("@/pages/contact/ContactPage.jsx"));
const BookingPage = lazy(() => import("@/pages/booking/BookingPage.jsx"));
const NotFound = lazy(() => import("@/pages/notfound/NotFound.jsx"));

const LoadingFallback = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative flex items-center gap-4 scale-125 md:scale-[1.5]">
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />

            <svg
              width="48"
              height="48"
              viewBox="0 0 100 100"
              className="relative drop-shadow-md animate-bounce-subtle"
            >
              <rect
                x="15"
                y="10"
                width="70"
                height="80"
                rx="12"
                fill="url(#loader_grad)"
              />

              {/* Drawing Circle */}
              <circle
                cx="50"
                cy="55"
                r="28"
                stroke="white"
                strokeWidth="4"
                fill="none"
                className="animate-draw-circle"
              />

              <defs>
                <linearGradient
                  id="loader_grad"
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

          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter leading-none uppercase text-[#0F172A]">
              klean<span className="text-[#4F7DF3] animate-pulse">.</span>
            </h1>
            <div className="overflow-hidden">
              <span className="block text-[10px] text-[#94A3B8] font-bold uppercase tracking-[0.4em] mt-1 border-r-2 border-[#4F7DF3] animate-typing whitespace-nowrap">
                Enterprise
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [position, setPosition] = useState(getToastPosition());

  // Handle responsive positioning
  useEffect(() => {
    const handleResize = () => {
      setPosition(getToastPosition());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<FrontendLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/admin-auth" element={<AdminAuthPage />} />
            <Route path="/auth" element={<Auth />} />

            {/* Admin Dashboard Route - RBAC protected (Super Admin, Branch Manager, Staff only) */}
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="orders" element={<Orders />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="customers" element={<Customers />} />
              <Route path="employees" element={<Employees />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="reports" element={<Reports />} />
              <Route path="locations" element={<Locations />} />
              <Route path="tracking" element={<Tracking />} />
              <Route path="managers" element={<Managers />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Error & Not Found Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Toaster
        position={position}
        theme="light"
        richColors={false}
        closeButton={true}
        pauseWhenPageIsHidden={true}
        visibleToasts={TOAST_STACKING.maxVisible}
        gap={TOAST_STACKING.offset}
        toastOptions={getToasterConfig().toastOptions}
      />
    </>
  );
}
