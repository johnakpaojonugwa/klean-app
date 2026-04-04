import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { RevenueChart, StatusBreakdownChart } from "@/admin/dashboard/DashboardComponents";

const AnalyticsCharts = ({ revenueData, statusData, loading }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Revenue Chart (Occupies 2/3 of the width on large screens) */}
      <div className="lg:col-span-2">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {loading ? (
            <div className="h-96 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <RevenueChart data={Array.isArray(revenueData) ? revenueData : []} />
          )}
        </div>
      </div>

      {/* Status Breakdown (Occupies 1/3 of the width) */}
      <div>
        <div className="bg-white p-4 rounded-lg shadow-sm h-full">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <StatusBreakdownChart data={statusData || {}} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;