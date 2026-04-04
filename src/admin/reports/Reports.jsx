import React from "react";
import { Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/common/PageHeader";

import { useReports } from "@/components/reports/useReports";
import ReportFilterBar from "@/components/reports/ReportFilterBar";
import { LogisticsCard, ServicePerformanceCard } from "@/components/reports/AnalyticsCharts";
import ReportKpiCard  from "@/components/reports/ReportKpiCard"; 

export default function Reports() {
  const { states, setStartDate, setEndDate, handleDateRangeChange, applyFilters, data, kpis } = useReports();

  const handleExport = () => {
    toast.promise(new Promise(res => setTimeout(res, 1500)), {
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
        <LogisticsCard analytics={data.analytics} />
        <ServicePerformanceCard revenue={data.revenue} />
      </div>

      {/* Footer Metrics Card */}
      <Card className="border-none shadow-sm bg-indigo-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="h-32 w-32" />
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <FooterStat label="New Acquisitions" value={data.customers?.total_new_customers} />
            <FooterStat label="Daily Avg" value={Number(data.customers?.averageNewCustomersPerDay || 0).toFixed(1)} />
            <FooterStat label="Active Branches" value={data.summary?.branchCount || 1} />
            <FooterStat label="Retention Rate" value={`${Number(data.customers?.growth || 0).toFixed(1)}%`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FooterStat({ label, value }) {
  return (
    <div>
      <p className="text-indigo-200 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-1">{value || 0}</p>
    </div>
  );
}