import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

function ProgressBar({ label, value = 0, total = 0, colorClass = "bg-emerald-500" }) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-slate-600">
        <span>{label}</span>
        <span>₦{Number(value).toLocaleString()}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="text-[10px] text-slate-500 text-right">
        {percentage.toFixed(0)}% of branch revenue
      </div>
    </div>
  );
}

export default function BranchRevenueAnalytics({ orders = [], loading }) {
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  }, [orders]);

  const serviceBreakdown = useMemo(() => {
    const groups = orders.reduce((acc, order) => {
      const service = order.serviceType ? order.serviceType.replace(/_/g, " ").toLowerCase() : "unknown";
      acc[service] = (acc[service] || 0) + (Number(order.totalAmount) || 0);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([service, amount]) => ({ service, amount }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [orders]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Revenue Analytics</h3>
          <p className="text-xs text-slate-500 mt-1">Revenue by service type from current branch orders</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Branch Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₦{Number(totalRevenue).toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-slate-600">Top services by revenue</p>
            <p className="text-xs text-slate-500">Derived from current orders, independent of date range</p>
          </div>
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>

        {serviceBreakdown.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">No order revenue data available</div>
        ) : (
          <div className="space-y-4">
            {serviceBreakdown.map((item, idx) => (
              <ProgressBar
                key={item.service}
                label={item.service}
                value={item.amount}
                total={totalRevenue}
                colorClass={["bg-emerald-500", "bg-sky-500", "bg-violet-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"][idx % 6]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
