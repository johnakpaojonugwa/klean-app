/**
 * Centralized role and permission constants
 * Single source of truth for all role-related definitions
 */
import { 
  Home, 
  ShoppingCart, 
  Package, 
  FileText, 
  UserCircle, 
  Users, 
  BarChart3, 
  MapPinned, 
  Zap,
} from "lucide-react";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  BRANCH_MANAGER: "BRANCH_MANAGER",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
};

// Admin roles that can access the admin dashboard
export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.BRANCH_MANAGER,
  ROLES.STAFF,
  ROLES.CUSTOMER,
];

/**
 * NEW: Sidebar Navigation Definition
 * Each item specifies which roles are allowed to view it.
 */
export const SIDEBAR_NAV_ITEMS = [
  { 
    href: "/dashboard", 
    label: "Overview", 
    icon: Home, 
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.STAFF] 
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ShoppingCart,
    allowedRoles: [ROLES.BRANCH_MANAGER, ROLES.STAFF],
  },
  {
    href: "/dashboard/inventory",
    label: "Inventory",
    icon: Package,
    allowedRoles: [ROLES.BRANCH_MANAGER],
  },
  {
    href: "/dashboard/invoices",
    label: "Invoices",
    icon: FileText,
    allowedRoles: [ROLES.BRANCH_MANAGER, ROLES.STAFF],
  },
  {
    href: "/dashboard/employees",
    label: "Employees",
    icon: UserCircle,
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER],
  },
  {
    href: "/dashboard/customers",
    label: "Customers",
    icon: Users,
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER, ROLES.STAFF],
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: BarChart3,
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.BRANCH_MANAGER],
  },
  {
    href: "/dashboard/locations",
    label: "Locations",
    icon: MapPinned,
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
  {
    href: "/dashboard/tracking",
    label: "Tracking",
    icon: Zap,
    allowedRoles: [ROLES.BRANCH_MANAGER, ROLES.CUSTOMER],
  },
  {
    href: "/dashboard/managers",
    label: "Managers",
    icon: Users,
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
];

// Role information for UI display
export const RBAC_INFO = [
  {
    role: ROLES.SUPER_ADMIN,
    label: "Super Administrator",
    icon: "👑",
    color: "red",
    permissions: ["Global Analytics", "System Settings"],
  },
  {
    role: ROLES.BRANCH_MANAGER,
    label: "Branch Manager",
    icon: "🏢",
    color: "orange",
    permissions: ["Staff Management", "Inventory"],
  },
  {
    role: ROLES.STAFF,
    label: "Staff Member",
    icon: "👔",
    color: "blue",
    permissions: ["Order Fulfillment", "Tasks"],
  },
  {
    role: ROLES.CUSTOMER,
    label: "Customer",
    icon: "👤",
    color: "green",
    permissions: ["View Personal Orders", "Track Orders"],
  },
];

/**
 * --- UTILITY FUNCTIONS ---
 */

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

export const normalizeRole = (role) => String(role || "").toUpperCase(); 

export const hasRequiredRole = (userRole, allowedRoles = []) => {
  if (!allowedRoles.length) return true;

  const normalizedUserRole = normalizeRole(userRole).trim();
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole).map((role) => role.trim());

  return normalizedAllowedRoles.includes(normalizedUserRole);
};

/**
 * Helper to get navigation items filtered by role
 * @param {string} userRole 
 * @returns {Array} List of allowed navigation items
 */
export const getNavItemsForRole = (userRole) => {
  return SIDEBAR_NAV_ITEMS.filter(item => 
    item.allowedRoles.includes(userRole)
  );
};