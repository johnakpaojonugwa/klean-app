import api from "./api.js";
import { leaveKeys } from "./keys.js";

// ===== Leaves =====
export const getLeaveRequests = async (page = 1, limit = 10, status = null) => {
  const params = { page, limit };
  if (status) params.status = status;
  const res = await api.get("/leaves/requests", { params });
  return res.data;
};
getLeaveRequests.queryKey = (page = 1, limit = 10, status = null) =>
  leaveKeys.lists({ page, limit, status });

export const approveLeaveRequest = async (leaveId) => {
  const res = await api.patch(`/leaves/${leaveId}/approve`);
  return res.data;
};

export const rejectLeaveRequest = async (leaveId, reason = "") => {
  const res = await api.patch(`/leaves/${leaveId}/reject`, { reason });
  return res.data;
};

export const leavesApi = {
  keys: leaveKeys,
  list: getLeaveRequests,
  approve: approveLeaveRequest,
  reject: rejectLeaveRequest,
};
