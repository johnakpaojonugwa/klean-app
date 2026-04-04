/**
 * Legacy entry-point for API helpers.
 *
 * This file exists for backward compatibility. Prefer importing from the
 * domain-specific modules (e.g. "@/api/analytics", "@/api/orders") when
 * adding or modifying functionality.
 */

export * from "./analytics.js";
export * from "./orders.js";
export * from "./customers.js";
export * from "./employees.js";
export * from "./inventory.js";
export * from "./invoices.js";
export * from "./branches.js";
export * from "./payroll.js";
export * from "./attendance.js";
export * from "./leaves.js";
export * from "./notifications.js";
