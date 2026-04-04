import api from "./api.js";
import { employeeKeys } from "./keys.js";

// ===== Employees =====
export const getEmployees = async (page = 1, limit = 10, branchId = null) => {
  const params = { page, limit };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/employees", { params });
  return res.data;
};
getEmployees.queryKey = (page = 1, limit = 10, branchId = null) =>
  employeeKeys.lists({ page, limit, branchId });

export const getEmployee = async (id) => {
  const res = await api.get(`/employees/${id}`);
  return res.data;
};
getEmployee.queryKey = (id) => employeeKeys.detail(id);

export const createEmployee = async (data) => {
  if (data instanceof FormData) {
    const res = await api.post("/employees", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const res = await api.post("/employees", data);
  return res.data;
};

export const updateEmployee = async (id, data) => {
  if (data instanceof FormData) {
    const res = await api.put(`/employees/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const res = await api.put(`/employees/${id}`, data);
  return res.data;
};

export const terminateEmployee = async (id, data) => {
  const res = await api.post(`/employees/${id}/terminate`, data);
  return res.data;
};

export const employeesApi = {
  keys: employeeKeys,
  list: getEmployees,
  detail: getEmployee,
  create: createEmployee,
  update: updateEmployee,
  terminate: terminateEmployee,
};
