import api from "./api.js";
import { inventoryKeys } from "./keys.js";

// ===== Inventory =====
export const getInventoryByBranch = async (branchId, page = 1, limit = 20) => {
  const res = await api.get(`/inventory/branch/${branchId}`, {
    params: { page, limit },
  });
  return res.data;
};
getInventoryByBranch.queryKey = (branchId, page = 1, limit = 20) =>
  inventoryKeys.lists(branchId, page, limit);

export const getLowStockItems = async (page = 1, limit = 20, branchId = null) => {
  const params = { page, limit };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/inventory/low-stock", { params });
  return res.data;
};
getLowStockItems.queryKey = (page = 1, limit = 20, branchId = null) =>
  inventoryKeys.lowStock(branchId, page, limit);

export const addInventoryItem = async (data) => {
  const res = await api.post("/inventory", data);
  return res.data;
};

export const adjustInventoryStock = async (branchId, itemId, amount, reason = "") => {
  const res = await api.patch(`/inventory/${itemId}/adjust`, {
    branchId,
    amount,
    reason,
  });
  return res.data;
};

export const updateInventoryItem = async (id, data) => {
  const res = await api.put(`/inventory/${id}`, data);
  return res.data;
};

export const inventoryApi = {
  keys: inventoryKeys,
  byBranch: getInventoryByBranch,
  lowStock: getLowStockItems,
  addItem: addInventoryItem,
  adjustStock: adjustInventoryStock,
  updateItem: updateInventoryItem,
};
