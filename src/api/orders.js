import api from "./api.js";
import { orderKeys } from "./keys.js";
import { adjustInventoryStock } from "./inventory.js";
import { getInvoiceByOrderId } from "./invoices.js";

// ===== Orders =====
export const createOrder = async (payload) => {
  const res = await api.post("/orders", payload);
  return res.data;
};
createOrder.queryKey = () => orderKeys.all;

export const getOrders = async (
  page = 1,
  limit = 50,
  status = null,
  branchId = null,
  customerId = null,
  query = null
) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (branchId) params.branchId = branchId;
  if (customerId) params.customerId = customerId;
  if (query) params.query = query;

  const res = await api.get("/orders", { params });
  return res.data;
};
getOrders.queryKey = (
  page = 1,
  limit = 50,
  status = null,
  branchId = null,
  customerId = null,
  query = null
) => orderKeys.lists({ page, limit, status, branchId, customerId, query });

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};
getOrderById.queryKey = (id) => orderKeys.detail(id);

export const updateOrder = async (id, updates) => {
  const res = await api.put(`/orders/${id}`, updates);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data;
};

export const markOrderAsPaid = async (id, payload = {}) => {
  const res = await api.put(`/orders/${id}/mark-paid`, payload);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};

export const placeOrder = async (orderPayload) => {
  const order = await createOrder(orderPayload);

  if (order.adjustments && order.adjustments.length) {
    await Promise.all(
      order.adjustments.map((adj) =>
        adjustInventoryStock(adj.branchId, adj.itemId, adj.quantity, adj.reason)
      )
    );
  }

  if (!order.invoiceId && order._id) {
    order.invoice = await getInvoiceByOrderId(order._id);
  }

  return order;
};

export const ordersApi = {
  keys: orderKeys,
  create: createOrder,
  list: getOrders,
  detail: getOrderById,
  update: updateOrder,
  updateStatus: updateOrderStatus,
  markAsPaid: markOrderAsPaid,
  remove: deleteOrder,
};
