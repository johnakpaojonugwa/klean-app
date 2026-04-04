import api from "./api.js";
import { customerKeys } from "./keys.js";

// ===== Customers =====
export const getCustomers = async (page = 1, limit = 10) => {
  const res = await api.get("/users/customers", {
    params: { page, limit },
  });
  return res.data;
};
getCustomers.queryKey = (page = 1, limit = 10) =>
  customerKeys.lists({ page, limit });

export const assignCustomerToBranch = async (customerId, branchId) => {
  const res = await api.put(`/users/${customerId}`, { branchId });
  return res.data;
};

export const unassignCustomer = async (customerId) => {
  const res = await api.put(`/users/${customerId}`, { branchId: null });
  return res.data;
};

export const getCurrentUserProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};
getCurrentUserProfile.queryKey = () => customerKeys.profile();

export const customersApi = {
  keys: customerKeys,
  list: getCustomers,
  profile: getCurrentUserProfile,
  assignToBranch: assignCustomerToBranch,
  unassignFromBranch: unassignCustomer,
};
