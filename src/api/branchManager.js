import api from "./api.js";
import { branchManagerKeys } from "./keys.js";

// ===== Branch Managers =====
export const getBranchManagers = async (page = 1, limit = 10, branchId = null, search = "") => {
  const params = { page, limit };
  if (branchId) params.branchId = branchId;
  if (search) params.search = search;

  const res = await api.get("/branch-managers", { params });
  return res.data;
};
getBranchManagers.queryKey = (page = 1, limit = 10) =>
  branchManagerKeys.lists({ page, limit });

export const getBranchManager = async (id) => {
  const res = await api.get(`/branch-managers/${id}`);
  return res.data;
};
getBranchManager.queryKey = (id) => branchManagerKeys.detail(id);

export const createBranchManager = async (data) => {
  const res = await api.post("/branch-managers", data);
  return res.data;
};

export const updateBranchManager = async (id, data) => {
  const res = await api.put(`/branch-managers/${id}`, data);
  return res.data;
};

export const deleteBranchManager = async (id) => {
  const res = await api.delete(`/branch-managers/${id}`);
  return res.data;
};

export const branchManagerApi = {
    keys: branchManagerKeys,
    list: getBranchManagers,
    detail: getBranchManager,
    create: createBranchManager,
    update: updateBranchManager,
    delete: deleteBranchManager,
};