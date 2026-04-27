import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import api from "@/api/api";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export default function Dashboard() {
  const { isSuperAdmin, user } = useApp();

  // 1. Fetch Dashboard Summary (Top Cards)
  const { data: summary, isPending: summaryLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await api.get("/analytics/dashboard");
      return res.data.data;
    },
  });

  // 2. Fetch Trends (Order & Revenue Charts)
  const { data: trends, isPending: trendsLoading } = useQuery({
    queryKey: ["order-trends"],
    queryFn: async () => {
      const res = await api.get("/analytics/trends", {
        params: { 
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString() 
        },
      });
      return res.data.data;
    },
  });

  if (summaryLoading || trendsLoading) return <DashboardSkeleton />;

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
      </header>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₦${summary?.totalRevenue?.toLocaleString()}`} 
          icon={<DollarSign className="text-emerald-600" />} 
          color="bg-emerald-50" 
          loading={summaryLoading}
        />
        <StatCard 
          title="Total Orders" 
          value={summary?.totalOrders} 
          icon={<ShoppingBag className="text-blue-600" />} 
          color="bg-blue-50" 
          loading={summaryLoading}
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`₦${summary?.averageOrderValue || 0}`} 
          icon={<TrendingUp className="text-purple-600" />} 
          color="bg-purple-50" 
          loading={summaryLoading}
        />
        <StatCard 
          title="Ready for Pickup" 
          value={summary?.readyForPickup || 0} 
          icon={<Users className="text-amber-600" />} 
          color="bg-amber-50" 
          loading={summaryLoading}
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-none">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends?.dailyOrders}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* --- STATUS BREAKDOWN --- */}
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(trends?.statusBreakdown || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="capitalize text-slate-600">{status.replace('_', ' ')}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- LEADERBOARD (Super Admin Only) --- */}
      {isSuperAdmin && summary?.branchLeaderboard && (
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle>Branch Performance Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.branchLeaderboard.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>{branch.branchCode}</TableCell>
                      <TableCell>${branch.totalRevenue.toLocaleString()}</TableCell>
                      <TableCell>{branch.totalOrders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Sub-component for clean code
function StatCard({ title, value, icon, color }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">{title}</p>
            <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
          </div>
          <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", color)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading state
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-xl bg-white shadow-sm">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 p-6 border rounded-xl bg-white shadow-sm">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-64 w-full rounded" />
        </div>
        <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-64 w-full rounded" />
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4 p-6 border rounded-xl bg-white shadow-sm">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-48 w-full rounded" />
        </div>
      </div>
    </div>
  );
}