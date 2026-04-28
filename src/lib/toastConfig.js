/**
 * Toast notification configuration and utilities
 * Implements responsive positioning, type-specific timing, and spring physics animations
 */

// Toast duration configurations (in milliseconds)
export const TOAST_DURATIONS = {
  success: 3000,  // 3 seconds
  info: 4000,     // 4 seconds
  warning: 7000,  // 7 seconds
  error: Infinity, // Until acknowledged
};

// Color coding for each toast type
export const TOAST_COLORS = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-l-4 border-emerald-500",
    icon: "text-emerald-500",
    textColor: "text-emerald-900 dark:text-emerald-100",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-l-4 border-red-500",
    icon: "text-red-500",
    textColor: "text-red-900 dark:text-red-100",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-l-4 border-amber-500",
    icon: "text-amber-500",
    textColor: "text-amber-900 dark:text-amber-100",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-l-4 border-blue-500",
    icon: "text-blue-500",
    textColor: "text-blue-900 dark:text-blue-100",
  },
};

// Spring physics configuration
export const SPRING_CONFIG = {
  damping: 20,
  stiffness: 180,
  mass: 1,
};

// Toast stacking configuration
export const TOAST_STACKING = {
  maxVisible: 3,
  offset: 12, // pixels between toasts
};

// Get toast duration based on type
export const getDuration = (type) => {
  return TOAST_DURATIONS[type] || TOAST_DURATIONS.info;
};

// Get color coding based on type
export const getToastColors = (type) => {
  return TOAST_COLORS[type] || TOAST_COLORS.info;
};

// Detect if mobile device
export const isMobileDevice = () => {
  return typeof window !== "undefined" && window.innerWidth < 768;
};

// Get position based on device
export const getToastPosition = () => {
  return isMobileDevice() ? "top-center" : "bottom-right";
};

/**
 * Get toast classNames for a specific type - used for individual toast calls
 */
export const getToastClassNames = (type = "info") => {
  const baseClassNames = {
    toast: `
      group relative rounded-lg shadow-lg font-medium text-sm
      flex items-center gap-4 px-5 py-4 pb-1 pr-10
      backdrop-blur-sm border border-l-4
      animate-toast-enter
      dark:shadow-xl
    `,
    icon: `flex items-center justify-center w-10 h-10 rounded-lg bg-white shrink-0 mt-0`,
    content: "flex flex-col justify-center flex-1",
    title: "text-sm font-semibold leading-tight text-inherit",
    description: "text-xs opacity-70 mt-0.5 leading-tight text-inherit",
    actionButton: `
      bg-white/10 hover:bg-white/20 
      text-inherit border-none 
      px-3 py-1.5 rounded-md 
      text-xs font-bold transition-colors
      ml-2
    `,
    closeButton: `
      h-5 w-5 shrink-0 rounded opacity-75 hover:opacity-100
      transition-opacity
      group-hover:opacity-100
    `,
  };

  const typeSpecificClasses = {
    error: `
      !bg-red-50 !border-red-200 dark:!bg-red-950 dark:!border-red-800
      !border-l-4 !border-l-red-500 dark:!border-l-red-400
      [&_svg]:!text-red-500
    `,
    success: `
      !bg-emerald-50 !border-emerald-200 dark:!bg-emerald-950 dark:!border-emerald-800
      !border-l-4 !border-l-emerald-500 dark:!border-l-emerald-400
      [&_svg]:!text-emerald-500
    `,
    warning: `
      !bg-amber-50 !border-amber-200 dark:!bg-amber-950 dark:!border-amber-800
      !border-l-4 !border-l-amber-500 dark:!border-l-amber-400
      [&_svg]:!text-amber-500
    `,
    info: `
      !bg-blue-50 !border-blue-200 dark:!bg-blue-950 dark:!border-blue-800
      !border-l-4 !border-l-blue-500 dark:!border-l-blue-400
      [&_svg]:!text-blue-500
    `,
  };

  return {
    ...baseClassNames,
    [type]: typeSpecificClasses[type] || typeSpecificClasses.info,
  };
};

/**
 * Get Sonner Toaster configuration based on device type and requirements
 */
export const getToasterConfig = () => {
  const isMobile = isMobileDevice();

  return {
    position: getToastPosition(),
    theme: "light",
    richColors: false, // We use custom colors
    closeButton: true,
    pauseWhenPageIsHidden: true,
    // Maximum visible toasts
    visibleToasts: TOAST_STACKING.maxVisible,
    // Toast gap/spacing
    gap: TOAST_STACKING.offset,
    // Sonner transitions with spring physics approximation
    duration: TOAST_DURATIONS.info, // Default fallback
    toastOptions: {
      // Default styling for all toasts
      classNames: getToastClassNames("info"),
      style: {
        padding: "0", // Let Tailwind handle padding
      },
    },
  };
};

// CSS animations for toast entry/exit with spring physics
export const toastAnimationCSS = `
  @keyframes toast-enter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toast-exit {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  @keyframes toast-swipe-out {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(var(--radix-toast-swipe-end-x));
    }
  }

  .animate-toast-enter {
    animation: toast-enter 0.35s cubic-bezier(0.21, 1.02, 0.53, 0.96);
  }

  .animate-toast-exit {
    animation: toast-exit 0.35s cubic-bezier(0.21, 1.02, 0.53, 0.96) forwards;
  }

  [data-swipe="move"] {
    transform: translateX(var(--radix-toast-swipe-move-x));
  }

  [data-swipe="cancel"] {
    transform: translateX(0);
    transition: transform 200ms ease-out;
  }

  [data-swipe="end"] {
    animation: toast-swipe-out 100ms ease-out forwards;
  }
`;
