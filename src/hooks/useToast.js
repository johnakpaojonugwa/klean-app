import { toast as sonnerToast } from "sonner";
import { TOAST_DURATIONS, getToastClassNames } from "@/lib/toastConfig";

const isClient = typeof window !== "undefined";

const createToast = (message, type = "info", options = {}) => {
  if (!isClient) return null;

  return sonnerToast[type](message, {
    duration: TOAST_DURATIONS[type],
    classNames: getToastClassNames(type),
    ...options,
  });
};

export const showSuccess = (msg, opts) => createToast(msg, "success", opts);
export const showInfo = (msg, opts) => createToast(msg, "info", opts);
export const showWarning = (msg, opts) => createToast(msg, "warning", opts);
export const showError = (msg, opts) => createToast(msg, "error", { closeButton: true, ...opts });

export const showPromise = (promise, { loading, success, error }, options = {}) => {
  if (!isClient) return promise;
  return sonnerToast.promise(promise, {
    loading: loading || "Loading...",
    success: (data) => {
      const msg = typeof success === 'function' ? success(data) : success;
      return msg;
    },
    error: (err) => {
      const msg = typeof error === 'function' ? error(err) : error;
      return { label: msg, ...getToastClassNames("error") };
    },
    ...options,
  });
};

const toast = {
  success: showSuccess,
  info: showInfo,
  warning: showWarning,
  error: showError,
  promise: showPromise,
  dismiss: (id) => isClient && (id ? sonnerToast.dismiss(id) : sonnerToast.dismiss()),
};

export default toast;