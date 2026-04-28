/**
 * Example usage of the refactored Toast Notification System
 * 
 * This file demonstrates how to use the toast system in your components.
 * You can reference this when implementing toasts in your app.
 */

// ============================================
// BASIC USAGE - Simple Toast Messages
// ============================================

import { showSuccess, showError, showWarning, showInfo } from '@/hooks/useToast';

// Success notification (auto-dismisses in 3 seconds)
export const handleOrderSuccess = () => {
  showSuccess('Order placed successfully!');
};

// Error notification (stays until user closes it)
export const handleOrderError = (message) => {
  showError(message || 'Failed to place order. Please try again.');
};

// Warning notification (auto-dismisses in 7 seconds)
export const handleExpiringSoon = () => {
  showWarning('Your session will expire in 5 minutes');
};

// Info notification (auto-dismisses in 4 seconds)
export const handleNewOrderAlert = () => {
  showInfo('You have 3 new orders waiting');
};

// ============================================
// ADVANCED USAGE - Toast with Descriptions
// ============================================

import toast from '@/hooks/useToast';

export const handlePaymentError = () => {
  toast.error('Payment Failed', {
    description: 'Your card was declined. Please check your payment details and try again.',
    duration: Infinity, // Keep showing until closed
  });
};

export const handleValidationWarning = (field) => {
  toast.warning(`${field} is invalid`, {
    description: `Please check your ${field} and try again.`,
  });
};

// ============================================
// PROMISE TOASTS - For Async Operations
// ============================================

export const handleFormSubmit = async (formData) => {
  const submitPromise = fetch('/api/submit-form', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  toast.promise(submitPromise, {
    loading: 'Submitting your form...',
    success: 'Form submitted successfully!',
    error: 'Failed to submit form. Please try again.',
  });

  try {
    await submitPromise;
  } catch (error) {
    console.error('Form submission error:', error);
  }
};

// ============================================
// COMPONENT EXAMPLE - Using in React
// ============================================

import React from 'react';

export function OrderComponent() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* order data */ }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      showSuccess('Order created successfully');
      // Refresh orders list, redirect, etc.
    } catch (error) {
      showError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleCreateOrder} disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Order'}
    </button>
  );
}

// ============================================
// CUSTOM CONTENT TOASTS
// ============================================

export const showCustomActionToast = () => {
  toast.custom(
    (toastId) => (
      <div className="flex items-center gap-3">
        <div>
          <p className="font-semibold">Undo Action?</p>
          <p className="text-sm opacity-75">Your changes were deleted.</p>
        </div>
        <button
          onClick={() => {
            console.log('Undo clicked');
            toast.dismiss(toastId);
          }}
          className="whitespace-nowrap px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Undo
        </button>
      </div>
    ),
    'info'
  );
};

// ============================================
// DISMISSING TOASTS MANUALLY
// ============================================

export function ListComponent() {
  const deleteItem = async (id) => {
    // Show an "undo" toast that can be dismissed
    const toastId = showSuccess(
      'Item deleted. Undo?'
    );

    // Simulate API call
    const success = await fetch(`/api/items/${id}`, { method: 'DELETE' });

    if (success.ok) {
      // Dismiss the undo toast after 10 seconds
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 10000);
    } else {
      // Dismiss immediately and show error
      toast.dismiss(toastId);
      showError('Failed to delete item');
    }
  };

  return (
    <button onClick={() => deleteItem(123)}>
      Delete Item
    </button>
  );
}

// ============================================
// BEST PRACTICES
// ============================================

/**
 * DO's:
 * ✅ Use specific toast types (success, error, warning, info)
 * ✅ Keep messages concise and clear
 * ✅ Use error toasts for critical failures
 * ✅ Use warning for cautions that need attention
 * ✅ Show loading state in modal/button during async operations
 * ✅ Test on mobile devices for swipe gestures
 * 
 * DON'Ts:
 * ❌ Show more than 3 toasts at once
 * ❌ Use vague messages like "Error" without context
 * ❌ Show success toast for every action
 * ❌ Keep success/info toasts visible too long
 * ❌ Use toasts for critical information that users might miss
 */

// ============================================
// COMMON USE CASES
// ============================================

// CRUD Operations
export const handleDelete = async (id) => {
  try {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    showSuccess('Item deleted successfully');
  } catch {
    showError('Failed to delete item');
  }
};

export const handleUpdate = async (id, data) => {
  try {
    await fetch(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    showSuccess('Changes saved successfully');
  } catch {
    showError('Failed to save changes');
  }
};

// Form Validation
export const handleValidation = (errors) => {
  if (errors.length > 0) {
    showError(`${errors.length} validation error(s)`, {
      description: errors.join(', '),
    });
    return false;
  }
  return true;
};

// API Errors
export const handleApiError = (error) => {
  if (error.status === 401) {
    showWarning('Session expired. Please log in again.');
  } else if (error.status === 403) {
    showError('You do not have permission to perform this action');
  } else if (error.status === 500) {
    showError('Server error. Please try again later.');
  } else {
    showError(error.message || 'An error occurred');
  }
};

// ============================================
// NOTIFICATION CENTER EXAMPLE
// ============================================

export const showNotification = (notification) => {
  switch (notification.type) {
    case 'order_confirmed':
      showSuccess(`Order #${notification.orderId} confirmed`);
      break;
    case 'payment_failed':
      showError('Payment failed. Please try another card.');
      break;
    case 'shipment_updated':
      showInfo(`Your order has been ${notification.status}`);
      break;
    case 'inventory_low':
      showWarning(`Low inventory for ${notification.itemName}`);
      break;
    default:
      showInfo(notification.message);
  }
};
