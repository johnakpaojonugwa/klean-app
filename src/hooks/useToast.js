/**
 * Custom toast utilities - wrapper around Sonner toast for consistent behavior
 * 
 * Features:
 * - Automatic duration based on toast type (success: 3s, info: 4s, warning: 7s, error: ∞)
 * - Responsive positioning (desktop: bottom-right, mobile: top-center)
 * - Spring physics animations with smart stacking (max 3 visible)
 * - Color-coded toasts with icons and left border accents
 * - Type-aware styling via toastConfig classNames
 * - Dark mode support
 * 
 * @example
 * import { showSuccess, showError } from '@/hooks/useToast';
 * showSuccess('Order created!');
 * showError('Failed to save');
 */

import { toast as sonnerToast } from "sonner";
import { getDuration, getToasterConfig, getToastClassNames } from "@/lib/toastConfig.js";

/**
 * Create a toast notification with automatic duration based on type
 * Explicitly passes classNames to ensure enhanced styling is applied
 * 
 * @param {string} message - The toast message/title
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {Object} options - Additional Sonner options (duration, description, action, etc.)
 * @returns {string|number} Toast ID for manual dismissal
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
    classNames: getToastClassNames(type),
    ...options,
  });
};

/**
 * Show a success toast (auto-dismisses in 3 seconds)
 * 
 * Styling: Green background (#ecfdf5), emerald border, success icon (✓)
 * 
 * @param {string} message - Success message to display
 * @param {Object} options - Additional Sonner options
 *   - description: {string} Optional subtitle message
 *   - action: {Object} Optional action button { label, onClick }
 * @returns {string|number} Toast ID for manual dismissal
 * 
 * @example
 * showSuccess('Profile updated successfully');
 * 
 * showSuccess('Order created', {
 *   description: 'Order #12345 is ready',
 *   action: { label: 'View', onClick: () => navigate('/orders/12345') }
 * });
 */
export const showSuccess = (message, options = {}) => {
  return createToast(message, "success", options);
};

/**
 * Show an info toast (auto-dismisses in 4 seconds)
 * 
 * Styling: Blue background (#eff6ff), blue border, info icon (ℹ)
 * 
 * @param {string} message - Info message to display
 * @param {Object} options - Additional Sonner options
 *   - description: {string} Optional subtitle message
 *   - action: {Object} Optional action button { label, onClick }
 * @returns {string|number} Toast ID for manual dismissal
 * 
 * @example
 * showInfo('You have 3 new orders');
 * 
 * showInfo('Update available', {
 *   description: 'Click to install',
 *   action: { label: 'Install', onClick: handleUpdate }
 * });
 */
export const showInfo = (message, options = {}) => {
  return createToast(message, "info", options);
};

/**
 * Show a warning toast (auto-dismisses in 7 seconds)
 * 
 * Styling: Amber background (#fffbeb), amber border, warning icon (⚠)
 * 
 * @param {string} message - Warning message to display
 * @param {Object} options - Additional Sonner options
 *   - description: {string} Optional subtitle message
 *   - action: {Object} Optional action button { label, onClick }
 * @returns {string|number} Toast ID for manual dismissal
 * 
 * @example
 * showWarning('Your session expires in 5 minutes');
 * 
 * showWarning('Low inventory', {
 *   description: 'Item ABC-123 has 5 units left',
 *   action: { label: 'Reorder', onClick: handleReorder }
 * });
 */
export const showWarning = (message, options = {}) => {
  return createToast(message, "warning", options);
};

/**
 * Show an error toast (stays visible until user closes it)
 * 
 * Styling: Red background (#fef2f2), red border, error icon (✕)
 * 
 * This toast type requires acknowledgment and won't auto-dismiss.
 * Close button is automatically enabled.
 * 
 * @param {string} message - Error message to display
 * @param {Object} options - Additional Sonner options
 *   - description: {string} Optional error details or remediation steps
 *   - action: {Object} Optional action button { label, onClick }
 * @returns {string|number} Toast ID for manual dismissal
 * 
 * @example
 * showError('Payment failed');
 * 
 * showError('Order not found', {
 *   description: 'Order #99999 does not exist. Please check the order number.',
 *   action: { label: 'Go to Orders', onClick: () => navigate('/orders') }
 * });
 */
export const showError = (message, options = {}) => {
  return createToast(message, "error", {
    closeButton: true,
    ...options,
  });
};

/**
 * Show a toast with promise support for async operations
 * 
 * Displays "loading" state while promise is pending, then "success" or "error" state.
 * The success/error toast inherits the type's auto-dismiss duration.
 * 
 * @param {Promise} promise - Promise to track
 * @param {Object} messages - Toast messages for each state
 *   - loading: {string} Loading state message
 *   - success: {string} Success state message
 *   - error: {string|Function} Error state message or function(error) => string
 * @param {Object} options - Additional Sonner options
 * @returns {Promise} Returns the original promise
 * 
 * @example
 * // Basic usage
 * toast.promise(
 *   submitForm(data),
 *   {
 *     loading: 'Submitting...',
 *     success: 'Form submitted successfully!',
 *     error: 'Failed to submit form'
 *   }
 * );
 * 
 * // With error handling
 * toast.promise(
 *   deleteOrder(id),
 *   {
 *     loading: 'Deleting order...',
 *     success: 'Order deleted',
 *     error: (error) => error.response?.data?.message || 'Failed to delete'
 *   }
 * );
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
 * 
 * Use this for complex or interactive toast content beyond simple messages.
 * The toast type determines styling and auto-dismiss duration.
 * 
 * @param {JSX.Element|Function} content - JSX element or render function(toastId) => JSX
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {Object} options - Additional Sonner options
 * @returns {string|number} Toast ID for manual dismissal
 * 
 * @example
 * // Simple JSX content
 * toast.custom(
 *   <div className="flex gap-2">
 *     <CheckIcon />
 *     <span>Custom notification</span>
 *   </div>,
 *   'success'
 * );
 * 
 * // Render function with toast ID (for dismissal)
 * toast.custom(
 *   (id) => (
 *     <div className="flex items-center justify-between gap-4">
 *       <span>Undo action?</span>
 *       <button onClick={() => toast.dismiss(id)}>Undo</button>
 *     </div>
 *   ),
 *   'info'
 * );
 */
export const showCustom = (content, type = "info", options = {}) => {
  const duration = getDuration(type);
  return sonnerToast.custom(content, {
    duration: type === "error" ? Infinity : duration,
    ...options,
  });
};

/**
 * Dismiss a specific toast by ID
 * 
 * Use this to manually close a toast before its auto-dismiss timer expires.
 * Useful for "Undo" actions, custom workflows, or batch operations.
 * 
 * @param {string|number} toastId - The toast ID returned from toast functions
 * 
 * @example
 * const id = showSuccess('Undo action?');
 * setTimeout(() => toast.dismiss(id), 5000);
 */
export const dismissToast = (toastId) => {
  sonnerToast.dismiss(toastId);
};

/**
 * Dismiss all visible toasts
 * 
 * Removes all toasts regardless of type. Useful for route changes, 
 * clearing state, or clearing multiple notifications at once.
 * 
 * @example
 * // Clear all toasts when navigating to a new page
 * useEffect(() => {
 *   toast.dismissAll();
 * }, [location.pathname]);
 */
export const dismissAllToasts = () => {
  sonnerToast.dismiss();
};

/**
 * Export raw Sonner toast instance for advanced usage
 * 
 * Use this only when the provided utilities don't meet your needs.
 * Provides direct access to Sonner's full API.
 * 
 * @example
 * // Load toast (displays while promise resolves)
 * toast.raw.loading('Processing...');
 */
export const toast = sonnerToast;

/**
 * Export configuration utilities for advanced usage
 * 
 * getToasterConfig: Get the full Toaster configuration object
 * 
 * @example
 * // Inspect current toast configuration
 * import { getToasterConfig } from '@/hooks/useToast';
 * const config = getToasterConfig();
 * console.log(config.toastOptions.classNames);
 */
export { getToasterConfig } from "@/lib/toastConfig.js";

/**
 * Default export - convenient namespace for all toast functions
 * 
 * @example
 * import toast from '@/hooks/useToast';
 * toast.success('Done!');
 * toast.error('Failed');
 * toast.promise(asyncOp(), {...});
 */
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
