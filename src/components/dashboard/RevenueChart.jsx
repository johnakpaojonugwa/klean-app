import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subDays, startOfDay, isSameDay } from 'date-fns';
import { Skeleton } from "@/components/ui/Skeleton";

export default function RevenueChart({ data = [], loading }) {
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(dayDate);

      const dayData = data.find(item => 
        item.date && isSameDay(parseISO(item.date), dayStart)
      );

      return {
        date: format(dayDate, 'EEE'),
        fullDate: format(dayDate, 'MMM dd'),
        revenue: dayData ? Number(dayData.revenue) : 0, 
        paid: dayData ? dayData.paid : 0
      };
    });
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-[380px]">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-[280px] w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Revenue Analytics</h3>
          <p className="text-xs text-slate-500">Daily performance overview</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 uppercase">
             <span className="w-2 h-2 rounded-full bg-teal-500"></span> Revenue
           </span>
        </div>
      </div>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => `₦${val >= 1000 ? `${val/1000}k` : val}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
              formatter={(val) => [`₦${val.toLocaleString()}`, 'Total Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#0d9488" 
              strokeWidth={3}
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}