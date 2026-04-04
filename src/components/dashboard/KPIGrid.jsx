import React, { useMemo } from "react";
import { TrendingUp, Package, Users, Clock, DollarSign, BarChart3 } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { ROLES } from "@/constants/roles";

export default function KPIGrid({ data, loading, userRole = ROLES.CUSTOMER }) {
  const stats = useMemo(() => {
    // 1. Define all possible card definitions
    const cards = {
      revenue: {
        title: userRole === ROLES.SUPER_ADMIN ? "Total Revenue" : "Branch Revenue",
        value: `₦${(data?.liveTotals?.revenue || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        subtitle: userRole === ROLES.SUPER_ADMIN ? "Gross earnings" : "Total earnings",
        icon: userRole === ROLES.SUPER_ADMIN ? TrendingUp : DollarSign,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        trend: (data?.liveTotals?.revenue || 0) > 0 ? "On Track" : "No Sales",
        trendUp: true,
      },
      orders: {
        title: userRole === ROLES.SUPER_ADMIN ? "Orders Count" : "Branch Orders",
        value: (data?.liveTotals?.orders || data?.branchInfo?.totalOrders || 0).toLocaleString(),
        subtitle: userRole === ROLES.SUPER_ADMIN ? "Lifetime orders" : "Total volume",
        icon: Package,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      customers: {
        title: "Customers",
        value: (data?.totalCustomers || 0).toLocaleString(),
        subtitle: "Registered users",
        icon: Users,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      workload: {
        title: "Pending Tasks",
        value: (data?.pendingWorkload || 0).toString(),
        subtitle: "Immediate action",
        icon: Clock,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        trend: (data?.pendingWorkload || 0) > 0 ? "Action Required" : null,
        trendUp: (data?.pendingWorkload || 0) <= 0,
      },
      avgValue: {
        title: "Avg Order Value",
        value: `₦${(data?.$avg?.orderValue || 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`,
        subtitle: "Per transaction",
        icon: BarChart3,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      staff: {
        title: "Staff Count",
        value: (data?.totalStaff || 0).toLocaleString(),
        subtitle: "Active personnel",
        icon: Users,
        iconBg: "bg-slate-50",
        iconColor: "text-slate-600",
      }
    };

    // 2. Map Roles to specific card keys
    const roleMapping = {
      [ROLES.SUPER_ADMIN]: ["revenue", "orders", "customers", "workload"],
      [ROLES.BRANCH_MANAGER]: ["revenue", "orders", "avgValue", "staff"],
      [ROLES.STAFF]: ["orders", "workload"],
      [ROLES.CUSTOMER]: ["orders"], // Example: Customer sees their own order count
    };

    const activeKeys = roleMapping[userRole] || roleMapping[ROLES.CUSTOMER];
    return activeKeys.map(key => ({ ...cards[key], id: key }));

  }, [data, userRole]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} loading={loading} />
      ))}
    </div>
  );
}