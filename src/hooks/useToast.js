/**
 * Custom toast hook - wrapper around Sonner toast for consistent behavior
 * Automatically applies correct duration and styling based on toast type
 */

import { toast as sonnerToast } from "sonner";
import { getDuration } from "./toastConfig.js";

/**
 * Create a toast notification with automatic duration based on type
 * @param {string} message - The toast message
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {Object} options - Additional Sonner options
 */
const createToast = (message, type = "info", options = {}) => {
  const duration = getDuration(type);

  // For error toasts, ensure they require acknowledgment
  if (type === "error") {
    options.duration = Infinity;
    // Ensure closeButton is visible for errors
    if (options.closeButton === undefined) {
      options.closeButton = true;
    }
  }

  return sonnerToast[type](message, {
    duration,
    ...options,
  });
};

/**
 * Show a success toast (3 seconds)
 * @param {string} message - Success message
 * @param {Object} options - Additional Sonner options
 */
export const showSuccess = (message, options = {}) => {
  return createToast(message, "success", options);
};

/**
 * Show an info toast (4 seconds)
 * @param {string} message - Info message
 * @param {Object} options - Additional Sonner options
 */
export const showInfo = (message, options = {}) => {
  return createToast(message, "info", options);
};

/**
 * Show a warning toast (7 seconds)
 * @param {string} message - Warning message
 * @param {Object} options - Additional Sonner options
 */
export const showWarning = (message, options = {}) => {
  return createToast(message, "warning", options);
};

/**
 * Show an error toast (persists until closed)
 * @param {string} message - Error message
 * @param {Object} options - Additional Sonner options (close button enabled by default)
 */
export const showError = (message, options = {}) => {
  return createToast(message, "error", {
    closeButton: true,
    ...options,
  });
};

/**
 * Show a custom toast with promise support
 * @param {Promise} promise - Promise to track
 * @param {Object} messages - { loading, success, error } messages
 * @param {Object} options - Additional Sonner options
 */
export const showPromise = (promise, messages, options = {}) => {
  return sonnerToast.promise(promise, {
    loading: messages.loading || "Loading...",
    success: messages.success || "Success!",
    error: messages.error || "Something went wrong",
    ...options,
  });
};

/**
 * Show a toast with custom JSX content
 * @param {JSX.Element} content - Custom JSX content
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {Object} options - Additional Sonner options
 */
export const showCustom = (content, type = "info", options = {}) => {
  const duration = getDuration(type);
  return sonnerToast.custom(content, {
    duration: type === "error" ? Infinity : duration,
    ...options,
  });
};

/**
 * Dismiss a specific toast
 * @param {string|number} toastId - The toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  sonnerToast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  sonnerToast.dismiss();
};

// Export sonner toast directly for advanced usage
export const toast = sonnerToast;

export default {
  success: showSuccess,
  info: showInfo,
  warning: showWarning,
  error: showError,
  promise: showPromise,
  custom: showCustom,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  raw: sonnerToast,
};
