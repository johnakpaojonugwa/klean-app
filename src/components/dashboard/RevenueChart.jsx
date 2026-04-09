import React, { useMemo } from 'react';
import { Skeleton } from "@/components/ui/Skeleton";
import { TrendingUp, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function RevenueChart({ summaryData, loading }) {
  const metrics = useMemo(() => {
    if (!summaryData?.liveTotals) return [];
    
    const total = summaryData.liveTotals.revenue || 0;
    const completed = summaryData.liveTotals.completedOrders || 0;
    const pending = summaryData.liveTotals.pendingOrders || 0;
    const avgOrderValue = summaryData.$avg?.orderValue || 0;

    return [
      {
        label: 'Total Revenue',
        value: total,
        formatted: `₦${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: TrendingUp,
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-100',
      },
      {
        label: 'Completed Orders',
        value: completed,
        formatted: completed.toLocaleString(),
        icon: CheckCircle,
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        borderColor: 'border-green-100',
      },
      {
        label: 'Pending Orders',
        value: pending,
        formatted: pending.toLocaleString(),
        icon: Clock,
        color: 'amber',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-100',
      },
      {
        label: 'Avg Order Value',
        value: avgOrderValue,
        formatted: `₦${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: DollarSign,
        color: 'blue',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-100',
      },
    ];
  }, [summaryData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Revenue Metrics</h3>
        <p className="text-xs text-slate-500 mt-1">Current period overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div 
              key={idx} 
              className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${metric.bgColor} ${metric.borderColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {metric.label}
                  </p>
                </div>
                <Icon className={`h-5 w-5 ${metric.textColor} opacity-60`} />
              </div>

              <p className={`text-2xl font-bold ${metric.textColor} leading-tight`}>
                {metric.formatted}
              </p>

              <div className="mt-2 h-1 bg-gradient-to-r rounded-full" 
                   style={{
                     backgroundImage: `linear-gradient(to right, var(--color-start), var(--color-end))`,
                     '--color-start': metric.color === 'emerald' ? '#10b981' : 
                                     metric.color === 'green' ? '#16a34a' :
                                     metric.color === 'amber' ? '#f59e0b' :
                                     metric.color === 'blue' ? '#3b82f6' : '#6b7280',
                     '--color-end': metric.color === 'emerald' ? '#14b8a6' : 
                                   metric.color === 'green' ? '#22c55e' :
                                   metric.color === 'amber' ? '#fbbf24' :
                                   metric.color === 'blue' ? '#60a5fa' : '#9ca3af',
                   }}>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}