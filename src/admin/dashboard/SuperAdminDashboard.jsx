import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { analyticsApi, getDashboardSummary } from "@/api/analytics";
import { ordersApi, getOrders } from "@/api/orders";
import { branchesApi, getAllBranches } from "@/api/branches";
import { inventoryApi, getLowStockItems } from "@/api/inventory";
import { getCustomers } from "@/api/customers";
import { ROLES } from "@/constants/roles";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BranchRevenueComparison from "@/components/dashboard/BranchRevenueComparison";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import KPIGrid from "@/components/dashboard/KPIGrid";

export function SuperAdminDashboard() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [dateRange, setDateRange] = useState("7");
  const user = { role: ROLES.SUPER_ADMIN }; 

  // Fetch list of branches for the branch selector
  const { data: branchesData } = useQuery({
    queryKey: branchesApi.keys.lists(),
    queryFn: () => getAllBranches(),
  });

  const branchId = selectedBranch === "all" ? null : selectedBranch;

  // Memoize parameters to keep Query Keys stable
  const params = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - parseInt(dateRange));
    return {
      start,
      end: new Date(),
      branchId,
    };
  }, [dateRange, branchId]);

  const queryConfig = {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  }
  const { data: summary, isPending: summaryLoading, } = useQuery({
    queryKey: analyticsApi.keys.summary({ branchId }),
    queryFn: () => getDashboardSummary(branchId),
    ...queryConfig,
  });

  const { data: rawOrders, isPending: ordersLoading } = useQuery({
    queryKey: ordersApi.keys.lists({ page: 1, limit: 100, status: null, branchId }),
    queryFn: () => getOrders(1, 100, null, branchId),
    placeholderData: keepPreviousData,
    ...queryConfig,
  });

  const { data: lowStock, isPending: lowStockLoading, } = useQuery({
    queryKey: inventoryApi.keys.lowStock({ branchId }),
    queryFn: () => getLowStockItems(1, 5, branchId),
    ...queryConfig,
  });

  // Fetch customers count for Super Admin
  const { data: customersData, isPending: customersLoading } = useQuery({
    queryKey: ["customers-total", branchId],
    queryFn: () => getCustomers(1, 1, branchId), 
    ...queryConfig,
  });

  // Extract orders array safely
  const ordersArray = useMemo(() => {
    if (!rawOrders) return [];
    if (rawOrders.data && Array.isArray(rawOrders.data.orders)) return rawOrders.data.orders;
    if (Array.isArray(rawOrders)) return rawOrders;
    return rawOrders.orders || [];
  }, [rawOrders]);

  // Merge customer count with summary data
  const summaryWithCustomers = useMemo(() => {
    if (!summary?.data) return null;
    const customerCount = customersData?.data?.pagination?.total || 0;
    return {
      ...summary.data,
      totalCustomers: customerCount,
    };
  }, [summary?.data, customersData]);


  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      <DashboardHeader
        userRole={user?.role || ROLES.CUSTOMER}
        dateRange={dateRange}
        onRangeChange={setDateRange}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        branches={branchesData?.data || []} 
        summaryData={summary}
        startDate={params.start}
      />

      {/* KPI Grid */}
      <KPIGrid
        data={summaryWithCustomers}
        loading={summaryLoading || customersLoading}
        userRole={ROLES.SUPER_ADMIN}
      />

      {/* Branch Performance Section */}
      <div className="grid grid-cols-1 gap-6">
        <BranchRevenueComparison
          summaryData={summaryWithCustomers}
          loading={summaryLoading}
        />
      </div>

      {/* Inventory & Orders Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders data={ordersArray} loading={ordersLoading} />
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
