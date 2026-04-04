import api from "./api.js";
import { attendanceKeys } from "./keys.js";

// ===== Attendance =====
export const getAttendanceRecords = async (page = 1, limit = 20, branchId = null) => {
  const params = { page, limit };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/attendance", { params });
  return res.data;
};
getAttendanceRecords.queryKey = (page = 1, limit = 20, branchId = null) =>
  attendanceKeys.lists({ page, limit, branchId });

export const getEmployeeAttendance = async (employeeId, startDate, endDate) => {
  const res = await api.get(`/attendance/employee/${employeeId}`, {
    params: { startDate, endDate },
  });
  return res.data;
};
getEmployeeAttendance.queryKey = (employeeId, startDate, endDate) =>
  attendanceKeys.byEmployee(employeeId, { startDate, endDate });

export const attendanceApi = {
  keys: attendanceKeys,
  list: getAttendanceRecords,
  byEmployee: getEmployeeAttendance,
};
