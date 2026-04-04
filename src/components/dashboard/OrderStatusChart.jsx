import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from "@/components/ui/Skeleton";

const STATUS_COLOR_MAP = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  washing: '#06b6d4',
  drying: '#8b5cf6',
  ironing: '#6366f1',
  ready: '#10b981',
  delivered: '#64748b',
  cancelled: '#ef4444',
};

const DEFAULT_COLORS = ['#0d9488', '#14b8a6', '#2dd4bf'];

// Changed prop name to 'data' to reflect the summary object
export default function OrderStatusChart({ data: inputData, loading }) {
  const chartData = useMemo(() => {
    if (!inputData) return [];

    // CASE 1: Data is an Object (e.g., { pending: 5, washing: 10 })
    if (typeof inputData === 'object' && !Array.isArray(inputData)) {
      return Object.entries(inputData).map(([status, value]) => ({
        name: status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        rawStatus: status.toLowerCase(),
        value: value
      })).filter(item => item.value > 0); // Only show statuses that have orders
    }

    // CASE 2: Fallback if data is an Array (your old logic)
    if (Array.isArray(inputData)) {
      const counts = inputData.reduce((acc, order) => {
        const status = (order.status || 'pending').toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).map(([name, value]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        rawStatus: name,
        value
      }));
    }

    return [];
  }, [inputData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <Skeleton className="h-6 w-56 mb-6" />
        <div className="flex justify-center items-center h-[280px]">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Status Distribution</h3>
      
      <div className="w-full">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={200}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={STATUS_COLOR_MAP[entry.rawStatus] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 600 }}
            />
            <Legend 
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}