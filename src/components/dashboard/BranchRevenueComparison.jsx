import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Skeleton } from "@/components/ui/Skeleton";
import { TrendingUp } from 'lucide-react';

export default function BranchRevenueComparison({ summaryData, loading }) {
  const chartData = useMemo(() => {
    if (!summaryData?.branchLeaderboard || !Array.isArray(summaryData.branchLeaderboard)) {
      return [];
    }

    return summaryData.branchLeaderboard.slice(0, 8).map((branch, index) => ({
      name: branch.name || branch.branchCode || `Branch ${index + 1}`,
      revenue: branch.totalRevenue || 0,
      orders: branch.totalOrders || 0,
      fill: ['#10b981', '#14b8a6', '#2dd4bf', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'][index % 8]
    }));
  }, [summaryData]);

  const totalBranchRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <Skeleton className="h-6 w-56 mb-6" />
        <Skeleton className="h-[380px] w-full" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Branch Performance</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">No branch data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Branch Performance</h3>
          <p className="text-xs text-slate-500 mt-1">Revenue comparison across branches</p>
        </div>
        <div className="text-right bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
          <p className="text-xs font-semibold text-slate-600">Total Revenue</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            ₦{totalBranchRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `₦${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              formatter={(value, name) => {
                if (name === 'revenue') {
                  return [`₦${value.toLocaleString()}`, 'Revenue'];
                }
                return [value.toLocaleString(), 'Orders'];
              }}
              cursor={{ fill: 'rgba(107, 114, 128, 0.05)' }}
            />
            <Bar 
              dataKey="revenue" 
              radius={[8, 8, 0, 0]}
              animationDuration={600}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Branch Details Table */}
      <div className="mt-6 border-t pt-6">
        <h4 className="text-sm font-semibold text-slate-800 mb-3">Top Performing Branches</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {chartData.slice(0, 5).map((branch, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: branch.fill }}
                />
                <span className="text-sm font-medium text-slate-700">{branch.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">
                  ₦{branch.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">{branch.orders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
