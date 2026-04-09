import { useMemo, useState } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import KPIGrid from "@/components/dashboard/KPIGrid";
import { ROLES } from "@/constants/roles";
import {
  analyticsApi,
  getDashboardSummary,
  getRevenueAnalytics,
} from "@/api/analytics";
import { ordersApi, getOrders } from "@/api/orders";
import { employeesApi, getEmployees } from "@/api/employees";
import { inventoryApi, getLowStockItems } from "@/api/inventory";

export function BranchManagerDashboard({ branchId }) {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState("7");
  const user = { role: ROLES.BRANCH_MANAGER };

  // --- Configuration ---
  const queryConfig = {
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000,    
    gcTime: 10 * 60 * 1000,     
    retry: 1,
    enabled: !!branchId,        
  };

  // --- Date Logic ---
  const params = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - parseInt(dateRange));
    start.setHours(0, 0, 0, 0);
    return { start: start.toISOString(), end: end.toISOString(), branchId };
  }, [dateRange, branchId]);

  // --- Data Fetching ---
  const { data: summary, isPending: summaryLoading } = useQuery({
    queryKey: analyticsApi.keys.summary({ branchId }),
    queryFn: () => getDashboardSummary(branchId),
    ...queryConfig,
  });

  const { data: revenue, isPending: revenueLoading } = useQuery({
    queryKey: analyticsApi.keys.period({ startDate: params.start, endDate: params.end, branchId }),
    queryFn: () => getRevenueAnalytics(params.start, params.end, branchId),
    ...queryConfig,
  });

  const { data: rawOrders, isPending: ordersLoading } = useQuery({
    queryKey: ordersApi.keys.lists({ page: 1, limit: 100, status: null, branchId }),
    queryFn: () => getOrders(1, 100, null, branchId),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });

  const { data: employees, isPending: employeesLoading } = useQuery({
    queryKey: employeesApi.keys.lists({ page: 1, limit: 10, branchId }),
    queryFn: () => getEmployees(1, 10, branchId),
    ...queryConfig,
  });

  const { data: lowStock, isPending: lowStockLoading } = useQuery({
    queryKey: inventoryApi.keys.lowStock({ branchId }),
    queryFn: () => getLowStockItems(1, 5, branchId),
    ...queryConfig,
  });

  // --- Memoized Derived State ---
  const orders = useMemo(() => {
    if (!rawOrders) return [];
    if (Array.isArray(rawOrders.data?.orders)) return rawOrders.data.orders;
    if (Array.isArray(rawOrders)) return rawOrders;
    return rawOrders.orders || [];
  }, [rawOrders]);

  const summaryWithStaff = useMemo(() => {
    if (!summary?.data) return null;
    const staffCount = employees?.data?.employees?.length || 0;
    
    const totalValue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalValue / orders.length : 0;

    return {
      ...summary.data,
      totalStaff: staffCount,
      $avg: { orderValue: avgOrderValue },
    };
  }, [summary?.data, employees?.data?.employees, orders]);

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      <DashboardHeader
        userRole={user.role}
        dateRange={dateRange}
        onRangeChange={setDateRange}
        summaryData={summary}
        startDate={params.start}
      />

      <KPIGrid
        data={summaryWithStaff}
        loading={summaryLoading}
        userRole={ROLES.BRANCH_MANAGER}
      />

      {/* Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            summaryData={summaryWithStaff}
            loading={summaryLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusChart
            data={orders}
            loading={ordersLoading}
          />
        </div>
      </div>

      {/* Inventory & Orders Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders data={orders} loading={ordersLoading} />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlert
            data={lowStock?.data?.items || []}
            loading={lowStockLoading}
          />
        </div>
      </div>
    </div>
  );
}