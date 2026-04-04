import api from "./api.js";
import { invoiceKeys } from "./keys.js";

// ===== Invoices =====
export const createInvoice = async (payload) => {
  const res = await api.post("/invoices", payload);
  return res.data;
};
createInvoice.queryKey = () => invoiceKeys.all;

export const getInvoices = async (
  page = 1,
  limit = 20,
  branchId = null
) => {
  const params = { page, limit };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/invoices", { params });
  return res.data;
};
getInvoices.queryKey = (page = 1, limit = 20, branchId = null) =>
  invoiceKeys.lists({ page, limit, branchId });

export const getInvoiceById = async (id) => {
  const res = await api.get(`/invoices/${id}`);
  return res.data;
};
getInvoiceById.queryKey = (id) => invoiceKeys.detail(id);

export const getInvoiceByOrderId = async (orderId) => {
  const res = await api.get(`/orders/${orderId}/invoice`);
  return res.data;
};
getInvoiceByOrderId.queryKey = (orderId) => invoiceKeys.byOrder(orderId);

export const invoicesApi = {
  keys: invoiceKeys,
  create: createInvoice,
  list: getInvoices,
  detail: getInvoiceById,
  byOrder: getInvoiceByOrderId,
};
