# Component Documentation

This document provides an overview of the reusable components and UI patterns used throughout the Klean Frontend application.

## 📋 Overview

The application uses a modular component architecture with reusable UI components built on top of Radix UI primitives and styled with Tailwind CSS.

## 🏗️ Component Architecture

### Directory Structure
```
src/components/
├── auth/           # Authentication-related components
├── common/         # Shared/common components
├── customers/      # Customer-specific components
├── dashboard/      # Dashboard widgets and charts
├── employees/      # Employee management components
├── inventory/      # Inventory management components
├── invoices/       # Invoice-related components
├── landing/        # Landing page components
├── layout/         # Layout components
├── managers/       # Manager-specific components
├── orders/         # Order management components
├── profile/        # User profile components
├── reports/        # Reporting components
├── tracking/       # Order tracking components
└── ui/            # Base UI components
```

## 🎨 UI Components (`src/components/ui/`)

### Button Component
```jsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

### Input Component
```jsx
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={error}
  helperText="Helper text"
/>
```

### Card Component
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Dialog/Modal Component
```jsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

### Table Component
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Badge Component
```jsx
import { Badge } from '@/components/ui/badge';

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Select Component
```jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

## 🔧 Common Components (`src/components/common/`)

### Header Component
```jsx
import { Header } from '@/components/common/Header';

<Header
  title="Page Title"
  subtitle="Optional subtitle"
  actions={<Button>Create New</Button>}
/>
```

### Sidebar Component
```jsx
import { Sidebar } from '@/components/common/Sidebar';

<Sidebar
  navigation={navigationItems}
  user={currentUser}
  onLogout={handleLogout}
/>
```

### SearchFilter Component
```jsx
import { SearchFilter } from '@/components/common/SearchFilter';

<SearchFilter
  placeholder="Search items..."
  value={searchTerm}
  onChange={setSearchTerm}
  filters={[
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]}
  onFilterChange={handleFilterChange}
/>
```

### EmptyState Component
```jsx
import { EmptyState } from '@/components/common/EmptyState';

<EmptyState
  icon={<PackageIcon />}
  title="No items found"
  description="Get started by creating your first item"
  action={<Button>Create Item</Button>}
/>
```

### NotificationsDropdown Component
```jsx
import { NotificationsDropdown } from '@/components/common/NotificationsDropdown';

<NotificationsDropdown
  notifications={notifications}
  onMarkAsRead={handleMarkAsRead}
  onMarkAllAsRead={handleMarkAllAsRead}
/>
```

## 📊 Dashboard Components (`src/components/dashboard/`)

### AnalyticsCharts Component
```jsx
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';

<AnalyticsCharts
  data={analyticsData}
  timeRange="30d"
  chartType="revenue"
/>
```

### KPIGrid Component
```jsx
import { KPIGrid } from '@/components/dashboard/KPIGrid';

<KPIGrid
  kpis={[
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'positive'
    },
    {
      title: 'Active Orders',
      value: '2,350',
      change: '+180.1%',
      changeType: 'positive'
    }
  ]}
/>
```

### DashboardTable Component
```jsx
import { DashboardTable } from '@/components/dashboard/DashboardTable';

<DashboardTable
  columns={columns}
  data={tableData}
  loading={isLoading}
  onRowClick={handleRowClick}
  pagination={{
    page: currentPage,
    limit: pageSize,
    total: totalItems,
    onPageChange: setCurrentPage
  }}
/>
```

### ExportButton Component
```jsx
import { ExportButton } from '@/components/dashboard/ExportButton';

<ExportButton
  data={exportData}
  filename="report"
  formats={['csv', 'pdf', 'excel']}
  onExport={handleExport}
/>
```

## 👥 Customer Components (`src/components/customers/`)

### CustomerCard Component
```jsx
import { CustomerCard } from '@/components/customers/CustomerCard';

<CustomerCard
  customer={customerData}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewDetails={handleViewDetails}
/>
```

### CustomerFormDialog Component
```jsx
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog';

<CustomerFormDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  customer={selectedCustomer}
  onSubmit={handleSubmit}
  mode={isEditing ? 'edit' : 'create'}
/>
```

## 📦 Inventory Components (`src/components/inventory/`)

### InventoryTable Component
```jsx
import { InventoryTable } from '@/components/inventory/InventoryTable';

<InventoryTable
  items={inventoryItems}
  onUpdateStock={handleUpdateStock}
  onEditItem={handleEditItem}
  onDeleteItem={handleDeleteItem}
/>
```

### StockLevelIndicator Component
```jsx
import { StockLevelIndicator } from '@/components/inventory/StockLevelIndicator';

<StockLevelIndicator
  currentStock={currentStock}
  minStock={minStock}
  maxStock={maxStock}
/>
```

## 📋 Order Components (`src/components/orders/`)

### OrderStatusBadge Component
```jsx
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';

<OrderStatusBadge status="pending" />
<OrderStatusBadge status="confirmed" />
<OrderStatusBadge status="processing" />
<OrderStatusBadge status="completed" />
<OrderStatusBadge status="cancelled" />
```

### OrderTimeline Component
```jsx
import { OrderTimeline } from '@/components/orders/OrderTimeline';

<OrderTimeline
  orderId={orderId}
  statusHistory={statusHistory}
  currentStatus={currentStatus}
/>
```

## 🔐 Authentication Components (`src/components/auth/`)

### LoginForm Component
```jsx
import { LoginForm } from '@/components/auth/LoginForm';

<LoginForm
  onSubmit={handleLogin}
  loading={isLoading}
  error={loginError}
/>
```

### AuthHeader Component
```jsx
import { AuthHeader } from '@/components/auth/AuthHeader';

<AuthHeader
  title="Welcome Back"
  subtitle="Sign in to your account"
/>
```

### RoleAccessList Component
```jsx
import { RoleAccessList } from '@/components/auth/RoleAccessList';

<RoleAccessList
  roles={availableRoles}
  selectedRole={selectedRole}
  onRoleSelect={setSelectedRole}
/>
```

## 🎯 Best Practices

### Component Props
- Use TypeScript interfaces for complex props
- Provide default values for optional props
- Document prop types and usage

```jsx
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  // Component implementation
};
```

### State Management
- Use local state for component-specific data
- Use React Query for server state
- Use Context for global app state

### Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Lazy load heavy components

```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* Component JSX */}</div>;
});
```

### Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Styling
- Use Tailwind CSS classes
- Follow design system tokens
- Maintain consistent spacing and colors
- Use responsive design patterns

## 🧪 Testing Components

### Unit Testing
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing
```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerList } from '@/components/customers/CustomerList';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe('CustomerList', () => {
  it('displays customers from API', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CustomerList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

## 📝 Component Documentation Template

When creating new components, follow this documentation template:

```jsx
/**
 * ComponentName - Brief description of what the component does
 *
 * @param {Object} props - Component props
 * @param {string} props.propName - Description of propName
 * @param {Function} props.onEvent - Description of event handler
 * @returns {JSX.Element} - Rendered component
 *
 * @example
 * <ComponentName
 *   propName="value"
 *   onEvent={handleEvent}
 * />
 */
const ComponentName = ({ propName, onEvent }) => {
  // Component implementation
};
```

This documentation provides a comprehensive overview of the component architecture and patterns used in the Klean Frontend application. Components are designed to be reusable, accessible, and maintainable.</content>
<parameter name="filePath">c:\Users\DELL\klean-frontend\docs\COMPONENTS.md