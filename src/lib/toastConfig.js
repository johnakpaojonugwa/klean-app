/**
 * Toast notification configuration and utilities
 * Implemented for Next.js with SSR safety and Tailwind optimization
 */

export const TOAST_DURATIONS = {
  success: 3000,
  info: 4000,
  warning: 7000,
  error: Infinity,
};

// SSR-Safe Device Detection
export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

export const getToastPosition = () => {
  return isMobileDevice() ? "top-center" : "bottom-right";
};

/**
 * Returns Tailwind classes. 
 * Note: Using template literals with full class names ensures 
 * Tailwind JIT compiler doesn't purge these styles.
 */
export const getToastClassNames = (type = "info") => {
  const baseClasses = "group relative rounded-xl shadow-lg font-medium text-sm flex items-center gap-4 px-5 py-4 border transition-all duration-300";
  
  const typeStyles = {
    success: "bg-emerald-50 border-emerald-200 border-l-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:border-l-emerald-400 dark:text-emerald-100",
    error: "bg-red-50 border-red-200 border-l-red-500 text-red-900 dark:bg-red-950 dark:border-red-800 dark:border-l-red-400 dark:text-red-100",
    warning: "bg-amber-50 border-amber-200 border-l-amber-500 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:border-l-amber-400 dark:text-amber-100",
    info: "bg-blue-50 border-blue-200 border-l-blue-500 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:border-l-blue-400 dark:text-blue-100",
  };

  return {
    toast: `${baseClasses} ${typeStyles[type] || typeStyles.info}`,
    title: "text-sm font-bold leading-tight",
    description: "text-xs opacity-80 mt-1 leading-tight",
    actionButton: "bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
    closeButton: "opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
  };
};

export const getToasterConfig = () => ({
  position: getToastPosition(),
  theme: "system",
  richColors: false,
  closeButton: true,
  visibleToasts: 3,
  gap: 12,
  toastOptions: {
    style: { padding: '0', background: 'transparent', border: 'none' },
  },
});