import api from "./api.js";
import { analyticsKeys } from "./keys.js";

// ===== Analytics =====
export const getDashboardSummary = async (branchId = null) => {
  const params = branchId ? { branchId } : {};
  const res = await api.get("/analytics/dashboard", { params });
  return res.data;
};
getDashboardSummary.queryKey = (branchId = null) =>
  analyticsKeys.summary({ branchId });

export const getAnalyticsPeriod = async (startDate, endDate, branchId = null) => {
  const params = { startDate, endDate };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/analytics/period", { params });
  return res.data;
};
getAnalyticsPeriod.queryKey = (startDate, endDate, branchId = null) =>
  analyticsKeys.period({ startDate, endDate, branchId });

export const getDailyAnalytics = async (date, branchId = null) => {
  const params = { date };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/analytics/daily", { params });
  return res.data;
};
getDailyAnalytics.queryKey = (date, branchId = null) =>
  analyticsKeys.daily({ date, branchId });

export const getOrderTrends = async (startDate, endDate, branchId = null) => {
  const params = { startDate, endDate };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/analytics/orders/trends", { params });
  return res.data;
};
getOrderTrends.queryKey = (startDate, endDate, branchId = null) =>
  analyticsKeys.orders({ startDate, endDate, branchId });

export const getRevenueAnalytics = async (startDate, endDate, branchId = null) => {
  const params = { startDate, endDate };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/analytics/revenue", { params });
  return res.data;
};
getRevenueAnalytics.queryKey = (startDate, endDate, branchId = null) =>
  analyticsKeys.revenue({ startDate, endDate, branchId });

export const getCustomerAnalytics = async (startDate, endDate, branchId = null) => {
  const params = { startDate, endDate };
  if (branchId) params.branchId = branchId;
  const res = await api.get("/analytics/customers", { params });
  return res.data;
};
getCustomerAnalytics.queryKey = (startDate, endDate, branchId = null) =>
  analyticsKeys.customers({ startDate, endDate, branchId });

export const getSuperAdminSummary = async () => {
  const res = await api.get("/analytics/super-admin");
  return res.data;
};
getSuperAdminSummary.queryKey = () => ["super-admin-summary"];

export const exportDashboardPdf = async (dashboardData, dateRange) => {
  const res = await api.post(
    "/analytics/export/pdf",
    { dashboardData, dateRange },
    { responseType: "blob" }
  );
  return res.data;
};

export const analyticsApi = {
  keys: analyticsKeys,
  summary: getDashboardSummary,
  period: getAnalyticsPeriod,
  daily: getDailyAnalytics,
  trends: getOrderTrends,
  revenue: getRevenueAnalytics,
  customers: getCustomerAnalytics,
  superAdmin: getSuperAdminSummary,
  exportPdf: exportDashboardPdf,
};
