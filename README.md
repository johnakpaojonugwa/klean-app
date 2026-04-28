# Klean Frontend

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive React-based frontend application for managing a laundry and cleaning service business. This application provides role-based dashboards for administrators, managers, staff, and customers, along with features for booking services, managing inventory, processing orders, and generating reports.

## 🚀 Features

### 👥 User Management & Authentication
- **Role-Based Access Control**: Separate dashboards for Super Admin, Branch Managers, Staff, and Customers
- **Multi-level Authentication**: Admin login, customer registration, and secure session management
- **Profile Management**: User profile updates, password changes, and account settings

### 🏢 Business Management
- **Branch Management**: Handle multiple service locations with location-specific operations
- **Employee Management**: Staff scheduling, role assignments, and performance tracking
- **Customer Management**: Customer profiles, service history, and communication
- **Manager Tools**: Branch-specific oversight and team management

### 📦 Inventory & Operations
- **Inventory Tracking**: Monitor cleaning supplies, equipment, and stock levels
- **Order Processing**: Complete order lifecycle from booking to delivery
- **Invoice Generation**: Automated invoicing with payment tracking
- **Quality Control**: Service standards and customer satisfaction monitoring

### 📊 Analytics & Reporting
- **Business Intelligence**: Comprehensive reporting on revenue, orders, and performance
- **Real-time Dashboards**: Live updates on key metrics and KPIs
- **Data Visualization**: Charts and graphs for trend analysis
- **Export Capabilities**: Data export for external analysis

### 🛒 Customer Experience
- **Online Booking**: Intuitive booking system with service selection
- **Order Tracking**: Real-time status updates and delivery notifications
- **Service History**: Complete order history and invoice access
- **Customer Support**: Integrated communication and feedback systems

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Accessibility**: WCAG compliant components and navigation
- **Performance**: Optimized loading and smooth animations

## 🛠️ Tech Stack

### Core Framework
- **React 19.2.0** - Modern React with latest features and hooks
- **Vite 7.2.4** - Fast build tool and development server
- **React Router DOM 7.12.0** - Client-side routing with protected routes

### State Management & Data
- **TanStack React Query 5.90.20** - Server state management and caching
- **React Context** - Global application state
- **Axios 1.13.4** - HTTP client with interceptors

### UI & Styling
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React 0.562.0** - Beautiful icon library
- **Framer Motion 12.33.0** - Animation library

### Development Tools
- **ESLint 9.39.1** - Code linting and quality
- **TypeScript Types** - Type definitions for better DX
- **Vite Plugins** - Optimized development experience

### Additional Libraries
- **Recharts 3.7.0** - Data visualization components
- **date-fns 4.1.0** - Modern date utility library
- **Sonner 2.0.7** - Advanced toast notification system with spring physics
- **nanoid 5.0.7** - Unique ID generation

### Notification System
- **Responsive Toast Notifications**: Automatic positioning (bottom-right desktop, top-center mobile)
- **Spring Physics Animations**: Smooth stacking with customizable damping and stiffness
- **Type-Based Durations**: Auto-dismiss timing based on notification type (success 3s, info 4s, warning 7s)
- **Smart Interactions**: Pause on hover, swipe to dismiss (mobile), keyboard support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control

You can verify your installations by running:
```bash
node --version
npm --version
git --version
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd klean-frontend
```

### 2. Install Dependencies
```bash
npm install
```
or if using yarn:
```bash
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# API Configuration
VITE_API_BASE=https://your-api-endpoint.com/api/v1

# Optional: Development settings
VITE_APP_ENV=development
```

### 4. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
klean-frontend/
├── 📁 public/                    # Static assets served directly
│   ├── favicon.ico
│   └── ...
├── 📁 src/
│   ├── 📁 admin/                 # Admin-specific pages & components
│   │   ├── 📁 admin-auth/        # Admin authentication
│   │   ├── 📁 customers/         # Customer management pages
│   │   ├── 📁 dashboard/         # Role-based dashboard pages
│   │   ├── 📁 employees/         # Employee management
│   │   ├── 📁 inventory/         # Inventory management
│   │   ├── 📁 invoices/          # Invoice handling
│   │   ├── 📁 layout/            # Admin layout wrapper
│   │   ├── 📁 locations/         # Branch/location management
│   │   ├── 📁 managers/          # Manager tools
│   │   ├── 📁 orders/            # Order processing
│   │   ├── 📁 reports/           # Reporting & analytics
│   │   ├── 📁 tracking/          # Order tracking
│   │   └── 📁 unauthorized/      # Access denied page
│   ├── 📁 api/                   # API client functions
│   │   ├── analytics.js          # Analytics API calls
│   │   ├── api.js               # Base API configuration
│   │   ├── bookings.js           # Booking-related API
│   │   ├── branches.js           # Branch management API
│   │   └── ...                  # Other API modules
│   ├── 📁 assets/                # Static assets (images, icons)
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 auth/              # Authentication components
│   │   ├── 📁 common/            # Shared/common components
│   │   ├── 📁 customers/         # Customer-specific components
│   │   ├── 📁 dashboard/         # Dashboard widgets & charts
│   │   ├── 📁 employees/         # Employee components
│   │   ├── 📁 inventory/         # Inventory components
│   │   ├── 📁 landing/           # Landing page components
│   │   ├── 📁 layout/            # Layout components
│   │   ├── 📁 managers/          # Manager components
│   │   ├── 📁 orders/            # Order components
│   │   ├── 📁 reports/           # Report components
│   │   ├── 📁 tracking/          # Tracking components
│   │   └── 📁 ui/                # Base UI library components
│   ├── 📁 constants/             # Application constants & config
│   │   ├── roles.js             # User roles & permissions
│   │   └── ...
│   ├── 📁 context/               # React Context providers
│   │   └── AppContext.jsx       # Main app context
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── useAuthGuard.jsx     # Authentication guard hook
│   │   ├── useBookingManager.js # Booking management hook
│   │   ├── useRoleGuard.js      # Role-based access hook
│   │   └── useToast.js          # Toast notification utilities
│   ├── 📁 lib/                   # Utility libraries
│   │   ├── toastConfig.js       # Toast configuration & constants
│   │   ├── inventoryUtils.js    # Inventory calculations
│   │   └── utils.js             # General utilities
│   ├── 📁 styles/                # Global styles
│   │   └── toast.css            # Toast notification styles
│   ├── 📁 pages/                 # Public page components
│   │   ├── 📁 about/             # About page
│   │   ├── 📁 auth/              # Authentication pages
│   │   ├── 📁 booking/           # Booking flow pages
│   │   ├── 📁 contact/           # Contact page
│   │   ├── 📁 home/              # Home/landing page
│   │   ├── 📁 notfound/          # 404 page
│   │   └── 📁 services/          # Services page
│   ├── 📁 router/                # Routing configuration
│   │   ├── AdminRoute.jsx       # Admin route protection
│   │   ├── ProtectedRoute.jsx   # General route protection
│   │   └── RoleRoute.jsx        # Role-specific routing
│   └── 📁 utils/                 # Utility functions
│       ├── index.js             # General utilities
│       └── ScrollToTop.jsx      # Scroll restoration
├── 📄 .env.example              # Environment variables template
├── 📄 eslint.config.js          # ESLint configuration
├── 📄 index.html                # Main HTML template
├── 📄 package.json              # Dependencies & scripts
├── 📄 tailwind.config.js        # Tailwind CSS configuration
├── 📄 vite.config.js            # Vite build configuration
├── 📄 vercel.json               # Vercel deployment config
└── 📄 README.md                 # This documentation
```

## 🏗️ Architecture

### Application Structure
Klean Frontend follows a modular, component-based architecture with clear separation of concerns:

#### **1. Presentation Layer (Components)**
- **Pages**: Route-level components that compose the UI
- **Components**: Reusable UI elements and business logic components
- **UI Library**: Base components built on Radix UI primitives

#### **2. Business Logic Layer**
- **Hooks**: Custom React hooks for shared logic
- **Context**: Global state management for user sessions and app state
- **Utils**: Pure utility functions and helpers

#### **3. Data Layer**
- **API**: Centralized API client with interceptors
- **Queries**: React Query for server state management
- **Constants**: Application-wide configuration and enums

### State Management Strategy

#### **Server State (React Query)**
```jsx
// Data fetching with caching and synchronization
const { data: orders, isLoading, error } = useQuery({
  queryKey: ['orders'],
  queryFn: fetchOrders,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

#### **Client State (Context + Local State)**
```jsx
// Global app state
const { user, isAuthenticated } = useApp();

// Component-specific state
const [formData, setFormData] = useState(initialData);
```

### Routing & Authentication

#### **Route Protection**
```jsx
// Admin routes require specific roles
<Route path="/dashboard" element={
  <AdminRoute>
    <AdminLayout />
  </AdminRoute>
}>
```

#### **Role-Based Access Control**
- **Super Admin**: Full system access
- **Branch Manager**: Branch-specific operations
- **Staff**: Daily operations and customer service
- **Customer**: Personal account and booking access

## 🔌 API Integration

### Base Configuration
```javascript
// src/api/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 45000,
});

// Request/Response interceptors for auth and error handling
```

### API Modules
Each feature has a dedicated API module:
- `api/branches.js` - Branch management
- `api/customers.js` - Customer operations
- `api/orders.js` - Order processing
- `api/inventory.js` - Inventory management

### Error Handling
```javascript
// Global error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);
```

## 🎨 UI Components

### Design System
- **Colors**: Consistent color palette with CSS custom properties
- **Typography**: Hierarchical text styles and responsive sizing
- **Spacing**: Standardized spacing scale
- **Components**: Reusable component library built on Radix UI

### Key UI Patterns

#### **Form Components**
```jsx
// Consistent form validation and error display
<Input
  value={value}
  onChange={handleChange}
  className={errors.field ? 'border-red-500' : ''}
/>
{errors.field && <ErrorMessage message={errors.field} />}
```

#### **Loading States**
```jsx
{isLoading ? <SkeletonLoader /> : <DataComponent />}
```

#### **Data Tables**
```jsx
// Consistent table patterns with sorting and filtering
<DataTable
  data={items}
  columns={columns}
  onSort={handleSort}
  searchValue={search}
/>
```

## 🧪 Development Guidelines

### Code Style
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components focused and single-responsibility

### Component Patterns
```jsx
// Prefer functional components with hooks
const UserProfile = ({ userId }) => {
  const { data: user, isLoading } = useUser(userId);
  
  if (isLoading) return <SkeletonLoader />;
  
  return (
    <div className="user-profile">
      {/* Component JSX */}
    </div>
  );
};
```

### State Management
- Use React Query for server state
- Use Context for global app state
- Use local state for component-specific UI state
- Avoid prop drilling with compound components

### Performance
- Implement code splitting with lazy loading
- Use React.memo for expensive components
- Optimize re-renders with useMemo and useCallback
- Implement proper loading and error states

## 📊 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Code Quality
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript checking (if implemented)
```

## 🔧 Configuration

### Environment Variables
```env
# Required
VITE_API_BASE=https://api.klean.com/api/v1

# Optional
VITE_APP_ENV=development
VITE_APP_NAME=Klean
VITE_SENTRY_DSN=your-sentry-dsn
```

### Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

## � Documentation

This project includes comprehensive documentation to help developers understand and contribute to the codebase:

### 📖 Core Documentation
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System overview, design patterns, and technical decisions
- **[API Documentation](./docs/API.md)** - Complete API integration guide with examples
- **[Component Library](./docs/COMPONENTS.md)** - UI components, patterns, and usage guidelines
### 🔔 Notification System
- **[Toast System Guide](./docs/TOAST_SYSTEM.md)** - Complete toast notification documentation with features and configuration
- **[Toast Examples](./docs/TOAST_EXAMPLES.md)** - Code examples and best practices
- **[Toast Quick Reference](./docs/TOAST_QUICK_REFERENCE.md)** - Quick reference guide for common use cases
### 🛠️ Development Resources
- **[Environment Setup](./docs/ENVIRONMENT.md)** - Detailed setup instructions and troubleshooting
- **[Contributing Guidelines](./docs/CONTRIBUTING.md)** - How to contribute, coding standards, and workflow

### 📋 Quick Links
- [Project Structure](#project-structure) - Codebase organization
- [Available Scripts](#available-scripts) - Development commands
- [Configuration](#configuration) - Environment and build setup

## �🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```
