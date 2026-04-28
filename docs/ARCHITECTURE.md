# Architecture Documentation

This document provides a comprehensive overview of the Klean Frontend application architecture, design patterns, and technical decisions.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Notification System](#notification-system)
- [Routing Architecture](#routing-architecture)
- [API Integration](#api-integration)
- [Security Architecture](#security-architecture)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)

## 🏗️ System Overview

The Klean Frontend is a modern React-based web application for managing laundry and dry cleaning services. It provides role-based access for different user types (customers, staff, managers, super admins) with comprehensive features for order management, inventory tracking, analytics, and user management.

### Key Features

- **Multi-role Authentication**: Support for customers, employees, managers, and super admins
- **Order Management**: Complete order lifecycle from creation to delivery
- **Inventory Management**: Track supplies, equipment, and stock levels
- **Analytics Dashboard**: Real-time insights and reporting
- **Real-time Notifications**: Live updates for order status changes
- **Responsive Design**: Mobile-first approach with cross-device compatibility

## 🛠️ Technology Stack

### Core Framework
- **React 19.2.0**: Modern React with concurrent features and hooks
- **Vite 7.2.4**: Fast build tool and development server
- **TypeScript**: Type safety (planned for future implementation)

### UI & Styling
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion 12.33.0**: Animation library
- **Lucide React 0.562.0**: Icon library

### State Management
- **TanStack React Query 5.90.20**: Server state management
- **React Context**: Global application state
- **Local State**: Component-level state with useState/useReducer

### HTTP & API
- **Axios 1.13.4**: HTTP client with interceptors
- **React Router DOM 7.12.0**: Client-side routing

### Development Tools
- **ESLint 9.39.1**: Code linting and quality
- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing utilities

### Additional Libraries
- **date-fns 4.1.0**: Date manipulation utilities
- **Sonner 2.0.7**: Advanced toast notification system with spring physics animations, responsive positioning, and smart timing
- **Recharts 3.7.0**: Data visualization

## 📁 Application Structure

```
src/
├── api/              # API integration layer
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── common/       # Shared components
│   ├── dashboard/    # Dashboard widgets
│   ├── ui/           # Base UI components
│   └── ...           # Feature-specific components
├── constants/        # Application constants
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── pages/            # Page components
├── router/           # Routing configuration
├── utils/            # Utility functions
└── App.jsx           # Main application component
```

### Directory Responsibilities

#### `api/`
Centralized API integration with Axios interceptors, request/response handlers, and query functions for different domains (auth, orders, inventory, etc.).

#### `components/`
Modular component architecture organized by feature and reusability:
- `ui/`: Base components (Button, Input, Card, etc.)
- `common/`: Shared components (Header, Sidebar, etc.)
- Feature folders: Domain-specific components

#### `pages/`
Page-level components that compose multiple smaller components. Each page represents a route in the application.

#### `hooks/`
Custom hooks for business logic, data fetching, and side effects:
- `useAuthGuard`: Route protection
- `useRoleGuard`: Role-based access control
- `useBookingManager`: Booking logic

#### `context/`
Global state management using React Context:
- `AppContext`: Application-wide state (user, theme, etc.)

## 🧩 Component Architecture

### Design Principles

1. **Component Composition**: Build complex UIs from smaller, reusable components
2. **Single Responsibility**: Each component has one clear purpose
3. **Props Interface**: Well-defined prop interfaces with TypeScript-like documentation
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Component Patterns

#### Container/Presentational Pattern
```jsx
// Presentational Component
const UserList = ({ users, loading, onUserSelect }) => {
  if (loading) return <LoadingSpinner />;

  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => onUserSelect(user)}
        />
      ))}
    </div>
  );
};

// Container Component
const UserListContainer = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const handleUserSelect = (user) => {
    // Navigation or state update logic
  };

  return (
    <UserList
      users={users}
      loading={isLoading}
      onUserSelect={handleUserSelect}
    />
  );
};
```

#### Compound Components
```jsx
// Modal compound component
const Modal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

const ModalTrigger = ({ children }) => {
  const { setIsOpen } = useContext(ModalContext);

  return (
    <button onClick={() => setIsOpen(true)}>
      {children}
    </button>
  );
};

const ModalContent = ({ children }) => {
  const { isOpen, setIsOpen } = useContext(ModalContext);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={() => setIsOpen(false)}>×</button>
        {children}
      </div>
    </div>
  );
};

// Usage
<Modal>
  <ModalTrigger>Open Modal</ModalTrigger>
  <ModalContent>
    <h2>Modal Title</h2>
    <p>Modal content...</p>
  </ModalContent>
</Modal>
```

#### Render Props Pattern
```jsx
const DataFetcher = ({ url, children }) => {
  const { data, loading, error } = useQuery({
    queryKey: [url],
    queryFn: () => fetch(url),
  });

  return children({ data, loading, error });
};

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

### Component Lifecycle

1. **Mounting**: Initialize state, set up subscriptions
2. **Updating**: Re-render on props/state changes
3. **Unmounting**: Clean up subscriptions, timers

```jsx
const DataComponent = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await api.get(`/users/${userId}`);
        if (isMounted) {
          setData(result.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch data:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
};
```

## 🗃️ State Management

### State Management Strategy

1. **Server State**: React Query for API data
2. **Global State**: Context API for app-wide state
3. **Local State**: useState/useReducer for component state
4. **URL State**: React Router for navigation state

### React Query Configuration

```javascript
// src/lib/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Query Keys Pattern

```javascript
// src/constants/queryKeys.js
export const QUERY_KEYS = {
  USERS: ['users'],
  USER: (id) => ['users', id],
  ORDERS: ['orders'],
  ORDER: (id) => ['orders', id],
  INVENTORY: ['inventory'],
  ANALYTICS: ['analytics'],
};
```

### Context Architecture

```jsx
// src/context/AppContext.jsx
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    setUser(response.data.user);
    return response;
  };

  const logout = () => {
    setUser(null);
    // Clear tokens, redirect, etc.
  };

  const value = {
    user,
    theme,
    setTheme,
    login,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

## � Notification System

### Overview

The application includes a comprehensive toast notification system built on Sonner 2.0.7 with advanced features including:

- **Responsive Positioning**: Bottom-right on desktop, top-center on mobile
- **Spring Physics Animations**: Smooth stacking with damping (20) and stiffness (180)
- **Type-Based Durations**: Auto-dismiss timing based on notification type
- **Interactive Gestures**: Hover pause, swipe dismiss (mobile), keyboard support
- **Color Coding**: Each type has distinctive colors with left border accents and icons

### Architecture

```
src/
├── lib/
│   └── toastConfig.js          # Configuration & constants
├── hooks/
│   └── useToast.js             # Toast utilities
├── styles/
│   └── toast.css               # Styling & animations
└── App.jsx                     # Toaster provider
```

### Key Components

#### Toast Configuration (`src/lib/toastConfig.js`)

```javascript
export const TOAST_DURATIONS = {
  success: 3000,     // Auto-dismiss in 3 seconds
  info: 4000,        // Auto-dismiss in 4 seconds
  warning: 7000,     // Auto-dismiss in 7 seconds
  error: Infinity,   // Stay until closed
};

export const TOAST_COLORS = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-500', ... },
  error: { bg: 'bg-red-50', border: 'border-red-500', ... },
  warning: { bg: 'bg-amber-50', border: 'border-amber-500', ... },
  info: { bg: 'bg-blue-50', border: 'border-blue-500', ... },
};

export const SPRING_CONFIG = {
  damping: 20,
  stiffness: 180,
  mass: 1,
};

export const TOAST_STACKING = {
  maxVisible: 3,
  offset: 12, // pixels between toasts
};
```

#### Toast Utilities (`src/hooks/useToast.js`)

```javascript
import { showSuccess, showError, showWarning, showInfo } from '@/hooks/useToast';

// Simple notifications with auto-duration
showSuccess('Action completed');
showError('Something went wrong');
showWarning('Please review this');
showInfo('New information');

// Advanced usage
import toast from '@/hooks/useToast';

toast.promise(asyncOperation(), {
  loading: 'Processing...',
  success: 'Done!',
  error: 'Failed!',
});

toast.custom(
  <CustomJSXComponent />,
  'success'
);

const id = toast.success('Message');
toast.dismiss(id);
toast.dismissAll();
```

### Responsive Behavior

#### Desktop (≥768px)
- Position: Bottom-right (20px padding)
- Max width: 420px
- Hover pause timer
- Smooth animations

#### Mobile (<768px)
- Position: Top-center
- Full width (minus 40px padding)
- Swipe to dismiss
- Touch-optimized (24px close button)

### CSS Architecture (`src/styles/toast.css`)

The toast styling system includes:

1. **Layout & Positioning**: Media queries for responsive positioning
2. **Animations**: Spring physics easing with cubic-bezier curves
3. **Color Schemes**: Type-based colors with dark mode support
4. **Interactive States**: Hover, focus, and active states
5. **Gestures**: Swipe animation handling
6. **Accessibility**: Reduced motion support, WCAG AA contrast

### Integration with Mutations

```javascript
import { useMutation } from '@tanstack/react-query';
import { showSuccess, showError } from '@/hooks/useToast';

const mutation = useMutation({
  mutationFn: async (data) => {
    // API call
  },
  onSuccess: () => {
    showSuccess('Operation successful');
  },
  onError: (error) => {
    showError(error.message);
  },
});
```

### Configuration & Customization

All toast behavior is configurable through `src/lib/toastConfig.js`:

- **Duration**: Modify `TOAST_DURATIONS` for different timing
- **Colors**: Update `TOAST_COLORS` for custom styling
- **Stacking**: Adjust `TOAST_STACKING.maxVisible` for max concurrent toasts
- **Physics**: Modify `SPRING_CONFIG` for animation behavior

### Documentation

For complete documentation and examples, see:
- [Toast System Guide](/docs/TOAST_SYSTEM.md)
- [Code Examples](/docs/TOAST_EXAMPLES.md)
- [Quick Reference](/docs/TOAST_QUICK_REFERENCE.md)
- [API Documentation](/docs/API.md#-toast-notifications)

---

## �🛣️ Routing Architecture

### Route Structure

```jsx
// src/router/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth routes */}
      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        {/* ... more admin routes */}
      </Route>
    </Routes>
  );
};
```

### Route Guards

```jsx
// src/router/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
```

```jsx
// src/router/RoleRoute.jsx
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### Lazy Loading

```jsx
// src/router/AppRouter.jsx
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        {/* ... other routes */}
      </Routes>
    </Suspense>
  );
};
```

## 🔗 API Integration

### API Layer Architecture

```
api/
├── api.js          # Base API configuration and interceptors
├── auth.js         # Authentication endpoints
├── users.js        # User management endpoints
├── orders.js       # Order management endpoints
├── inventory.js    # Inventory management endpoints
├── analytics.js    # Analytics and reporting endpoints
└── ...
```

### Request/Response Interceptors

```javascript
// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 45000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('klean_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);
```

### Error Handling

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

## 🔒 Security Architecture

### Authentication Flow

1. **Login**: User credentials → API → JWT tokens stored in sessionStorage
2. **Token Refresh**: Automatic refresh before expiration
3. **Logout**: Clear tokens and redirect to login

### Route Protection

- **Public Routes**: Accessible without authentication
- **Protected Routes**: Require valid authentication
- **Role-based Routes**: Require specific user roles

### Data Security

- **Input Validation**: Client-side validation with server-side verification
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Token-based protection for state-changing operations

### Secure Storage

```javascript
// Use sessionStorage for sensitive data (cleared on tab close)
sessionStorage.setItem('klean_token', token);
sessionStorage.setItem('klean_refresh', refreshToken);

// Avoid localStorage for sensitive data
// localStorage is persistent across sessions
```

## ⚡ Performance Optimization

### Code Splitting

```jsx
// Route-based code splitting
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));

// Component-based code splitting
const HeavyComponent = lazy(() => import('../components/HeavyComponent'));
```

### Image Optimization

```jsx
// Lazy loading images
import { lazy, Suspense } from 'react';

const LazyImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      className={isLoaded ? 'loaded' : 'loading'}
    />
  );
};
```

### Memoization

```jsx
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(dependencies);
}, [dependencies]);

// Memoize components
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data.value}</div>;
});
```

### Query Optimization

```javascript
// Prefetch related data
const prefetchUserDetails = (userId) => {
  queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDetails(userId),
    staleTime: 5 * 60 * 1000,
  });
};

// Background refetch
const { data } = useQuery({
  queryKey: ['orders'],
  queryFn: getOrders,
  refetchInterval: 30000, // Refetch every 30 seconds
});
```

## 🧪 Testing Strategy

### Testing Pyramid

1. **Unit Tests**: Test individual functions and hooks
2. **Integration Tests**: Test component interactions and API calls
3. **E2E Tests**: Test complete user flows (future implementation)

### Testing Tools

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **MSW**: Mock Service Worker for API mocking

### Test Structure

```
src/
├── components/
│   ├── Component.jsx
│   └── Component.test.jsx
├── hooks/
│   ├── useCustomHook.js
│   └── useCustomHook.test.js
├── utils/
│   ├── utility.js
│   └── utility.test.js
└── __tests__/
    ├── integration/
    └── e2e/
```

### Testing Patterns

```jsx
// Component testing
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from './UserProfile';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe('UserProfile', () => {
  it('displays user information', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

```javascript
// Hook testing
import { renderHook, waitFor } from '@testing-library/react';
import { useUserData } from './useUserData';

describe('useUserData', () => {
  it('fetches user data successfully', async () => {
    const { result } = renderHook(() => useUserData('123'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUserData);
  });
});
```

## 📊 Monitoring and Analytics

### Error Tracking

```javascript
// Error boundary for React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Performance Monitoring

```javascript
// Performance tracking
const trackPageLoad = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;

    // Send to analytics
    analytics.track('page_load', { loadTime });
  }
};

useEffect(() => {
  trackPageLoad();
}, []);
```

## 🚀 Deployment Architecture

### Build Process

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

### Environment Configuration

- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live application with optimizations

### CDN and Asset Optimization

- Static assets served from CDN
- Image optimization and lazy loading
- Code splitting for reduced bundle size
- Service worker for caching (future)

## 🔮 Future Architecture Considerations

### Planned Improvements

1. **TypeScript Migration**: Gradual adoption for better type safety
2. **Micro-frontend Architecture**: Split large application into smaller, independent apps
3. **PWA Features**: Service workers, offline support, push notifications
4. **Advanced Caching**: Implement React Query with persistent storage
5. **Real-time Features**: WebSocket integration for live updates
6. **Internationalization**: Multi-language support
7. **Accessibility**: WCAG 2.1 AA compliance improvements

### Scalability Considerations

- **Component Library**: Extract reusable components into separate package
- **Design System**: Centralized design tokens and patterns
- **API Versioning**: Support multiple API versions
- **Feature Flags**: Runtime feature toggling
- **Monitoring**: Comprehensive logging and error tracking

This architecture documentation provides a comprehensive overview of the Klean Frontend application's design and implementation. The modular, scalable architecture supports current requirements while providing a foundation for future enhancements.</content>
<parameter name="filePath">c:\Users\DELL\klean-frontend\docs\ARCHITECTURE.md