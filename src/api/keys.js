export const orderKeys = {
  all: ['orders'],
  lists: (filters = {}) => [...orderKeys.all, 'list', filters],
  detail: (id) => [...orderKeys.all, 'detail', id],
};

export const inventoryKeys = {
  all: ['inventory'],
  lists: (branchId) => [...inventoryKeys.all, 'list', branchId],
  lowStock: (branchId = null) => [...inventoryKeys.all, 'low-stock', branchId],
};

export const branchKeys = {
  all: ['branches'],
  lists: (filters = {}) => [...branchKeys.all, 'list', filters],
  detail: (id) => [...branchKeys.all, 'detail', id],
};

export const customerKeys = {
  all: ['customers'],
  lists: (filters = {}) => [...customerKeys.all, 'list', filters],
  detail: (id) => [...customerKeys.all, 'detail', id],
  profile: () => [...customerKeys.all, 'profile'],
};

export const invoiceKeys = {
  all: ['invoices'],
  lists: (filters = {}) => [...invoiceKeys.all, 'list', filters],
  detail: (id) => [...invoiceKeys.all, 'detail', id],
  byOrder: (orderId) => [...invoiceKeys.all, 'order', orderId],
};

export const employeeKeys = {
  all: ['employees'],
  lists: (filters = {}) => [...employeeKeys.all, 'list', filters],
  detail: (id) => [...employeeKeys.all, 'detail', id],
};

export const analyticsKeys = {
  all: ['analytics'],
  lists: (filters = {}) => [...analyticsKeys.all, 'list', filters],
  summary: (filters = {}) => [...analyticsKeys.all, 'summary', filters],
  revenue: (filters = {}) => [...analyticsKeys.all, 'revenue', filters],
  orders: (filters = {}) => [...analyticsKeys.all, 'orders', filters],
  daily: (filters = {}) => [...analyticsKeys.all, 'daily', filters],
  period: (filters = {}) => [...analyticsKeys.all, 'period', filters],
  customers: (filters = {}) => [...analyticsKeys.all, 'customers', filters],
};

export const notificationKeys = {
  all: ['notifications'],
  lists: (filters = {}) => [...notificationKeys.all, 'list', filters],
};

export const branchManagerKeys = {
  all: ['branchManagers'],
  lists: (filters = {}) => [...branchManagerKeys.all, 'list', filters],
  detail: (id) => [...branchManagerKeys.all, 'detail', id],
}

