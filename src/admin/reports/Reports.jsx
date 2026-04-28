import React from "react";
import { Download, TrendingUp } from "lucide-react";
import { showPromise } from "@/hooks/useToast";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/common/PageHeader";

import { useReports } from "@/components/reports/UseReports";
import ReportFilterBar from "@/components/reports/ReportFilterBar";
import { LogisticsCard, ServicePerformanceCard } from "@/components/reports/AnalyticsCharts";
import ReportKpiCard  from "@/components/reports/ReportKpiCard"; 

export default function Reports() {
  const { states, setStartDate, setEndDate, handleDateRangeChange, applyFilters, data, kpis } = useReports();

  const handleExport = () => {
    showPromise(new Promise(res => setTimeout(res, 1500)), {
      loading: 'Preparing report...',
      success: 'Report downloaded successfully',
      error: 'Failed to generate report',
    });
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-slate-50/30 min-h-screen">
      <PageHeader
        title="Business Analytics"
        subtitle="Comprehensive performance tracking and branch insights"
        actionLabel="Export PDF"
        onAction={handleExport}
        icon={Download}
      />

      <ReportFilterBar 
        states={states}
        onRangeChange={handleDateRangeChange}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        onApply={applyFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <ReportKpiCard key={i} {...kpi} colorClass={kpi.color} loading={states.isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LogisticsCard analytics={data.analytics} loading={states.isLoading} />
        <ServicePerformanceCard revenue={data.revenue} loading={states.isLoading} />
      </div>

      {/* Footer Metrics Card */}
      <Card className="border-none shadow-sm bg-indigo-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="h-32 w-32" />
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <FooterStat label="New Acquisitions" value={data.customers?.total_new_customers} loading={states.isLoading} />
            <FooterStat label="Daily Avg" value={Number(data.customers?.averageNewCustomersPerDay || 0).toFixed(1)} loading={states.isLoading} />
            <FooterStat label="Active Branches" value={data.summary?.branchCount || 1} loading={states.isLoading} />
            <FooterStat label="Retention Rate" value={`${Number(data.customers?.growth || 0).toFixed(1)}%`} loading={states.isLoading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FooterStat({ label, value, loading }) {
  if (loading) {
    return (
      <div>
        <Skeleton className="h-4 w-32 bg-indigo-400/20" />
        <Skeleton className="h-8 w-24 mt-3 bg-indigo-400/20" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-indigo-200 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-1">{value || 0}</p>
    </div>
  );
}