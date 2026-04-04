import api from "./api.js";
import { payrollKeys } from "./keys.js";

// ===== Payroll =====
export const getPayrollCycles = async (page = 1, limit = 10, branchId = null) => {
  const params = { page, limit };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/payroll/cycles", { params });
  return res.data;
};
getPayrollCycles.queryKey = (page = 1, limit = 10, branchId = null) =>
  payrollKeys.cycles({ page, limit, branchId });

export const getEmployeePayroll = async (employeeId) => {
  const res = await api.get(`/payroll/employee/${employeeId}`);
  return res.data;
};
getEmployeePayroll.queryKey = (employeeId) =>
  payrollKeys.byEmployee(employeeId);

export const createSalaryStructure = async (data) => {
  const res = await api.post("/payroll/structure/create", data);
  return res.data;
};

export const getSalaryStructures = async (branchId = null, isActive = null) => {
  const params = {};
  if (branchId) params.branchId = branchId;
  if (isActive !== null) params.isActive = isActive;
  const res = await api.get("/payroll/structure/list", { params });
  return res.data;
};
getSalaryStructures.queryKey = (branchId = null, isActive = null) =>
  payrollKeys.salaryStructures({ branchId, isActive });

export const updateSalaryStructure = async (id, data) => {
  const res = await api.put(`/payroll/structure/${id}`, data);
  return res.data;
};

export const processPayroll = async (data) => {
  const res = await api.post("/payroll/process", data);
  return res.data;
};

export const processBranchPayroll = async (data) => {
  const res = await api.post("/payroll/process-branch", data);
  return res.data;
};

export const getPayrolls = async (params) => {
  const res = await api.get("/payroll/list", { params });
  return res.data;
};
getPayrolls.queryKey = (params = {}) => payrollKeys.lists(params);

export const getPayrollById = async (id) => {
  const res = await api.get(`/payroll/${id}`);
  return res.data;
};
getPayrollById.queryKey = (id) => payrollKeys.detail(id);

export const approvePayroll = async (id) => {
  const res = await api.put(`/payroll/${id}/approve`);
  return res.data;
};

export const markPayrollAsPaid = async (id, paymentDetails) => {
  const res = await api.put(`/payroll/${id}/mark-paid`, paymentDetails);
  return res.data;
};

export const getSalarySlip = async (id) => {
  const res = await api.get(`/payroll/${id}/salary-slip`);
  return res.data;
};
getSalarySlip.queryKey = (id) => payrollKeys.salarySlip(id);

export const payrollApi = {
  keys: payrollKeys,
  cycles: getPayrollCycles,
  byEmployee: getEmployeePayroll,
  list: getPayrolls,
  detail: getPayrollById,
  process: processPayroll,
  processBranch: processBranchPayroll,
  approve: approvePayroll,
  markPaid: markPayrollAsPaid,
  salarySlip: getSalarySlip,
  structures: {
    list: getSalaryStructures,
    create: createSalaryStructure,
    update: updateSalaryStructure,
  },
};
