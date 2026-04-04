import api from "./api.js";
import { branchKeys } from "./keys.js";

// ===== Branches =====
export const createBranch = async (data) => {
  const res = await api.post("/branch", data);
  return res.data;
};

export const getAllBranches = async (page = 1, limit = 10, isActive = true) => {
  const res = await api.get("/branch", {
    params: { page, limit, isActive },
  });
  return res.data;
};
getAllBranches.queryKey = (page = 1, limit = 10, isActive = true) =>
  branchKeys.lists({ page, limit, isActive });

export const getBranchById = async (id) => {
  const res = await api.get(`/branch/${id}`);
  return res.data;
};
getBranchById.queryKey = (id) => branchKeys.detail(id);

export const branchesApi = {
  keys: branchKeys,
  list: getAllBranches,
  detail: getBranchById,
};
