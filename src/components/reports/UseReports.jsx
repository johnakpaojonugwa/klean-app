import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, DollarSign, Users, TrendingUp } from "lucide-react";
import { showSuccess } from "@/hooks/useToast";
import { 
  getDashboardSummary, 
  getAnalyticsPeriod, 
  getRevenueAnalytics, 
  analyticsApi 
} from "@/api/analytics";
import { getCustomers } from "@/api/customers";
import { useApp } from "@/context/AppContext";

export function useReports() {
  const { branchId } = useApp();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState("month");

  const toDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(() => toDate(-30));
  const [endDate, setEndDate] = useState(() => toDate());

  const queryConfig = { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 };

  // Queries
  const { data: dashboardData, isPending: summaryLoading } = useQuery({
    queryKey: analyticsApi.keys.summary({ branchId }),
    queryFn: () => getDashboardSummary(branchId),
    ...queryConfig,
  });

  const { data: periodAnalytics, isPending: analyticsLoading } = useQuery({
    queryKey: analyticsApi.keys.period({ startDate, endDate, branchId }),
    queryFn: () => getAnalyticsPeriod(startDate, endDate, branchId),
    ...queryConfig,
  });

  const { data: revenueData } = useQuery({
    queryKey: analyticsApi.keys.revenue({ startDate, endDate, branchId }),
    queryFn: () => getRevenueAnalytics(startDate, endDate, branchId),
    ...queryConfig,
  });

  const { data: customerData } = useQuery({
    queryKey: ["customers-report", branchId],
    queryFn: () => getCustomers(1, 100),
    ...queryConfig,
  });

  // Transformation logic
  const normalizedData = useMemo(() => ({
    summary: dashboardData?.data || {},
    analytics: periodAnalytics?.data || {},
    revenue: revenueData?.data || {},
    customers: customerData?.data || {},
  }), [dashboardData, periodAnalytics, revenueData, customerData]);

  const kpis = useMemo(() => {
    const { summary, analytics, revenue, customers } = normalizedData;
    const totalOrders = summary?.liveTotals?.orders ?? analytics?.totals?.totalOrders ?? 0;
    const totalRev = summary?.liveTotals?.revenue ?? revenue?.totalRevenue ?? 0;
    const activeCust = customers?.pagination?.total ?? 0;

    const calculateTrend = (cur, prev) => (!prev ? 0 : parseFloat((((cur - prev) / prev) * 100).toFixed(1)));
    const aov = totalOrders > 0 ? totalRev / totalOrders : 0;

    return [
      { title: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart, color: "bg-blue-500 text-white", trend: calculateTrend(totalOrders, analytics?.previousPeriod?.totalOrders) },
      { title: "Total Revenue", value: `₦${Number(totalRev).toLocaleString()}`, icon: DollarSign, color: "bg-emerald-500 text-white", trend: calculateTrend(totalRev, revenue?.previousPeriod?.totalRevenue) },
      { title: "Active Customers", value: activeCust.toLocaleString(), icon: Users, color: "bg-violet-500 text-white", trend: calculateTrend(activeCust, customers?.previousPeriod?.total) },
      { title: "Avg Order Value", value: `₦${aov.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "bg-amber-500 text-white", trend: 0 },
    ];
  }, [normalizedData]);

  const handleDateRangeChange = (range) => {
    const offsets = { week: -7, month: -30, quarter: -90, year: -365 };
    setDateRange(range);
    setStartDate(toDate(offsets[range] || -30));
    setEndDate(toDate());
  };

  const applyFilters = () => {
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    showSuccess("Filters applied successfully!");
  };

  return {
    states: { startDate, endDate, dateRange, isLoading: summaryLoading || analyticsLoading },
    setStartDate, setEndDate, handleDateRangeChange, applyFilters,
    data: normalizedData, kpis
  };
}