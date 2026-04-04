export const STATUS_GROUPS = {
  PENDING: ["PENDING"],
  PROCESSING: ["PROCESSING", "WASHING", "DRYING", "IRONING", "READY"],
  DELIVERED: ["DELIVERED"],
};

export const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "In Progress" },
  { value: "DELIVERED", label: "Completed" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priority", label: "High Priority First" },
  { value: "customer", label: "Customer Name (A-Z)" },
];