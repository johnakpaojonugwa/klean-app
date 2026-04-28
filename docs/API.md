# API Documentation

This document outlines the API integration patterns and available endpoints used in the Klean Frontend application.

## 📋 Overview

The application uses Axios for HTTP requests with React Query for caching and state management. All API calls are centralized in the `src/api/` directory.

## 🏗️ Architecture

### Base API Configuration

```javascript
// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://klean-dev.onrender.com/api/v1",
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
```

### Request Interceptor

```javascript
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("klean_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData for file uploads
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error("Request timed out");
    }

    // Handle 401 errors (token refresh)
    if (error.response?.status === 401 && !error.config._retry) {
      // Attempt token refresh logic
    }

    return Promise.reject(error);
  }
);
```

## 📚 API Modules

### Authentication (`api/api.js`)

#### Login
```javascript
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
```

#### Register Customer
```javascript
export const registerCustomer = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
```

#### Get Current User
```javascript
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
```

### Branches (`api/branches.js`)

#### Get All Branches
```javascript
export const getAllBranches = async (page = 1, limit = 10, activeOnly = false) => {
  const params = new URLSearchParams({ page, limit });
  if (activeOnly) params.append('active', 'true');

  const response = await api.get(`/branches?${params}`);
  return response.data;
};
```

#### Create Branch
```javascript
export const createBranch = async (branchData) => {
  const response = await api.post('/branches', branchData);
  return response.data;
};
```

#### Update Branch
```javascript
export const updateBranch = async (id, branchData) => {
  const response = await api.put(`/branches/${id}`, branchData);
  return response.data;
};
```

### Customers (`api/customers.js`)

#### Get Customers
```javascript
export const getCustomers = async (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);

  const response = await api.get(`/customers?${params}`);
  return response.data;
};
```

#### Create Customer
```javascript
export const createCustomer = async (customerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};
```

### Orders (`api/orders.js`)

#### Get Orders
```javascript
export const getOrders = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await api.get(`/orders?${params}`);
  return response.data;
};
```

#### Create Order
```javascript
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
```

#### Update Order Status
```javascript
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};
```

### Inventory (`api/inventory.js`)

#### Get Inventory Items
```javascript
export const getInventory = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/inventory?${params}`);
  return response.data;
};
```

#### Create Inventory Item
```javascript
export const createInventoryItem = async (itemData) => {
  const response = await api.post('/inventory', itemData);
  return response.data;
};
```

#### Update Stock Level
```javascript
export const updateStockLevel = async (itemId, stockData) => {
  const response = await api.patch(`/inventory/${itemId}/stock`, stockData);
  return response.data;
};
```

### Employees (`api/employees.js`)

#### Get Employees
```javascript
export const getEmployees = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page, limit, ...filters });
  const response = await api.get(`/employees?${params}`);
  return response.data;
};
```

#### Create Employee
```javascript
export const createEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};
```

### Analytics (`api/analytics.js`)

#### Get Dashboard Analytics
```javascript
export const getDashboardAnalytics = async (timeRange = '30d') => {
  const response = await api.get(`/analytics/dashboard?range=${timeRange}`);
  return response.data;
};
```

#### Get Revenue Analytics
```javascript
export const getRevenueAnalytics = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/analytics/revenue?${params}`);
  return response.data;
};
```

## 🔄 React Query Integration

### Query Keys Pattern
```javascript
// src/constants/queryKeys.js
export const QUERY_KEYS = {
  BRANCHES: ['branches'],
  CUSTOMERS: ['customers'],
  ORDERS: ['orders'],
  INVENTORY: ['inventory'],
  ANALYTICS: ['analytics'],
  USER: ['user'],
};
```

### Usage in Components
```jsx
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/orders';

const OrdersPage = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {orders?.data?.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
```

## 🔔 Toast Notifications

The application includes a comprehensive toast notification system built on Sonner with advanced features like responsive positioning, spring physics animations, and type-based auto-dismissal.

### Quick Start

```javascript
import { showSuccess, showError, showWarning, showInfo } from '@/hooks/useToast';

// Success (auto-dismisses in 3 seconds)
showSuccess('Order created successfully');

// Error (stays until user closes)
showError('Failed to create order');

// Warning (auto-dismisses in 7 seconds)
showWarning('Your session is expiring soon');

// Info (auto-dismisses in 4 seconds)
showInfo('New orders available');
```

### Toast Types & Durations

| Type | Duration | Use Case | Styling |
|------|----------|----------|---------|
| **success** | 3 seconds | Operation completed | 🟢 Green background + border |
| **error** | Until closed | Critical failures | 🔴 Red background + border |
| **warning** | 7 seconds | Cautions needing attention | 🟡 Amber background + border |
| **info** | 4 seconds | General information | 🔵 Blue background + border |

### Advanced Toast Features

#### With Description
```javascript
import toast from '@/hooks/useToast';

toast.error('Payment Failed', {
  description: 'Your card was declined. Please try another payment method.'
});
```

#### Promise-Based (for async operations)
```javascript
import toast from '@/hooks/useToast';

toast.promise(submitForm(), {
  loading: 'Submitting your form...',
  success: 'Form submitted successfully!',
  error: 'Failed to submit form. Please try again.'
});
```

#### Custom JSX Content
```javascript
import toast from '@/hooks/useToast';

toast.custom(
  (toastId) => (
    <div className="flex items-center gap-3">
      <CustomIcon />
      <div>
        <p className="font-semibold">Action Complete</p>
        <p className="text-sm opacity-75">Click to see details</p>
      </div>
    </div>
  ),
  'success'
);
```

#### Manual Dismiss
```javascript
import toast from '@/hooks/useToast';

// Dismiss specific toast
const toastId = toast.success('Undo action?');
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismissAll();
```

### Toast Functions Reference

#### `showSuccess(message, options?)`
Shows a success notification that auto-dismisses in 3 seconds.

#### `showError(message, options?)`
Shows an error notification that stays until the user closes it.

#### `showWarning(message, options?)`
Shows a warning notification that auto-dismisses in 7 seconds.

#### `showInfo(message, options?)`
Shows an info notification that auto-dismisses in 4 seconds.

#### `toast.promise(promise, messages, options?)`
Tracks an async operation with different toasts for loading, success, and error states.

#### `toast.custom(content, type, options?)`
Displays custom JSX content in a toast.

### Features

- **Responsive Positioning**: Bottom-right on desktop, top-center on mobile
- **Spring Physics**: Smooth animations with damping (20) and stiffness (180)
- **Smart Stacking**: Maximum 3 visible toasts with automatic overflow handling
- **Mobile Gestures**: Swipe to dismiss on touch devices
- **Hover Pause**: Timer pauses when hovering over a toast
- **Keyboard Support**: ESC key to dismiss
- **Color Coded**: Each type has distinctive colors and left border accent
- **Icons**: Automatic icons for each toast type

### Usage in React Components

#### With Mutations
```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { showSuccess, showError } from '@/hooks/useToast';

const CreateOrderForm = () => {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showSuccess('Order created successfully');
    },
    onError: (error) => {
      showError(error.message || 'Failed to create order');
    },
  });

  const handleSubmit = (orderData) => {
    createOrderMutation.mutate(orderData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button
        type="submit"
        disabled={createOrderMutation.isPending}
      >
        {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
      </button>
    </form>
  );
};
```

#### Async Operations
```javascript
import { showSuccess, showError } from '@/hooks/useToast';

export async function deleteOrder(orderId) {
  try {
    await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    showSuccess('Order deleted successfully');
  } catch (error) {
    showError(`Failed to delete: ${error.message}`);
  }
}
```

### Responsive Behavior

**Desktop (≥768px)**:
- Position: Bottom-right corner
- Padding: 20px from edges
- Max width: 420px

**Mobile (<768px)**:
- Position: Top-center
- Full width minus padding
- Touch-optimized close button (24px)
- Swipe gestures enabled

### Accessibility

- ✅ Respects `prefers-reduced-motion` for animations
- ✅ Keyboard navigation (ESC to dismiss)
- ✅ WCAG AA color contrast compliant
- ✅ Screen reader support via Sonner
- ✅ Touch-friendly targets (24px minimum)

### Configuration

For detailed configuration and customization, see:
- [Toast System Documentation](/docs/TOAST_SYSTEM.md)
- [Code Examples](/docs/TOAST_EXAMPLES.md)
- [Quick Reference](/docs/TOAST_QUICK_REFERENCE.md)
- [Configuration File](/src/lib/toastConfig.js)

---

## 🔄 React Query Integration

### Query Keys Pattern
```javascript
// src/constants/queryKeys.js
export const QUERY_KEYS = {
  BRANCHES: ['branches'],
  CUSTOMERS: ['customers'],
  ORDERS: ['orders'],
  INVENTORY: ['inventory'],
  ANALYTICS: ['analytics'],
  USER: ['user'],
};
```

### Usage in Components
```jsx
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api/orders';

const OrdersPage = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {orders?.data?.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
```

### Mutations
```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { showSuccess, showError } from '@/hooks/useToast';

const CreateOrderForm = () => {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showSuccess('Order created successfully');
    },
    onError: (error) => {
      showError('Failed to create order');
      console.error('Order creation error:', error);
    },
  });

  const handleSubmit = (orderData) => {
    createOrderMutation.mutate(orderData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button
        type="submit"
        disabled={createOrderMutation.isPending}
      >
        {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
      </button>
    </form>
  );
};
```

## 🛡️ Error Handling

### Global Error Handler
```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || error.message;

  switch (status) {
    case 400:
      return { type: 'validation', message };
    case 401:
      return { type: 'auth', message: 'Please log in again' };
    case 403:
      return { type: 'permission', message: 'Access denied' };
    case 404:
      return { type: 'not_found', message: 'Resource not found' };
    case 500:
      return { type: 'server', message: 'Server error. Please try again.' };
    default:
      return { type: 'unknown', message: 'An unexpected error occurred' };
  }
};
```

### Usage in Components
```jsx
import { handleApiError } from '@/utils/errorHandler';

const MyComponent = () => {
  const { data, error, isError } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  if (isError) {
    const { type, message } = handleApiError(error);
    return <ErrorDisplay type={type} message={message} />;
  }

  return <div>{/* Component content */}</div>;
};
```

## 🔐 Authentication Flow

### Token Management
```javascript
// Automatic token attachment via interceptor
// Tokens stored in sessionStorage for security

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  // Store tokens
  sessionStorage.setItem('klean_token', response.data.token);
  sessionStorage.setItem('klean_refresh', response.data.refreshToken);

  return response.data;
};
```

### Token Refresh
```javascript
const refreshToken = async () => {
  const refreshToken = sessionStorage.getItem('klean_refresh');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post('/auth/refresh-token', { refreshToken });

  // Update stored tokens
  sessionStorage.setItem('klean_token', response.data.token);
  sessionStorage.setItem('klean_refresh', response.data.refreshToken);

  return response.data;
};
```

## 📊 Response Format

All API responses follow a consistent format:

```javascript
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response Format
```javascript
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": {
    // Additional error information
  }
}
```

## 🔧 Development Tips

### Mocking API Calls
```javascript
// For development/testing
const mockApi = {
  get: (url) => Promise.resolve({ data: mockData }),
  post: (url, data) => Promise.resolve({ data: mockResponse }),
};

// Use in development
if (import.meta.env.DEV) {
  // Replace api with mockApi for testing
}
```

### API Testing
```javascript
// Test API functions
describe('API Functions', () => {
  it('should fetch orders successfully', async () => {
    const orders = await getOrders();
    expect(orders).toBeDefined();
    expect(Array.isArray(orders.data)).toBe(true);
  });
});
```

## 📝 API Conventions

- **HTTP Methods**: Standard REST conventions (GET, POST, PUT, DELETE, PATCH)
- **Status Codes**: Standard HTTP status codes
- **Content Type**: JSON for requests/responses
- **Authentication**: Bearer token in Authorization header
- **Pagination**: Cursor-based or offset-based pagination
- **Filtering**: Query parameters for filtering and searching
- **Sorting**: `sort` and `order` query parameters
- **Rate Limiting**: Implemented on backend, respect headers

This documentation provides a comprehensive overview of the API integration patterns used in the Klean Frontend application. For backend API documentation, please refer to the separate backend documentation.</content>
<parameter name="filePath">c:\Users\DELL\klean-frontend\docs\API.md