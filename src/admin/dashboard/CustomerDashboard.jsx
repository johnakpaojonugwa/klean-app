import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, TrendingUp, Clock, CheckCircle, Eye, Inbox } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

import { ExportButton } from '@/components/dashboard/ExportButton';
import StatCard from '@/components/dashboard/StatCard';
import { getOrders } from '@/api/orders';

// Modern status configuration matching InvoiceTable design
const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    container: "bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-100",
  },
  PROCESSING: {
    label: "Processing",
    container: "bg-blue-50 text-blue-700 border-blue-200/60 hover:bg-blue-100",
  },
  WASHING: {
    label: "Washing",
    container: "bg-cyan-50 text-cyan-700 border-cyan-200/60 hover:bg-cyan-100",
  },
  DRYING: {
    label: "Drying",
    container: "bg-indigo-50 text-indigo-700 border-indigo-200/60 hover:bg-indigo-100",
  },
  IRONING: {
    label: "Ironing",
    container: "bg-purple-50 text-purple-700 border-purple-200/60 hover:bg-purple-100",
  },
  READY: {
    label: "Ready",
    container: "bg-cyan-50 text-cyan-700 border-cyan-200/60 hover:bg-cyan-100",
  },
  DELIVERED: {
    label: "Delivered",
    container: "bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100",
  },
  CANCELLED: {
    label: "Cancelled",
    container: "bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100",
  },
};

export function CustomerDashboard({ customerId }) {
  const { 
    data: ordersData, 
    isPending: ordersLoading 
  } = useQuery({
    queryKey: ['my-orders', customerId],
    queryFn: () => getOrders(1, 50, null, null, customerId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, 
    retry: 1,
  });
  

  // Derived State & Analytics
  const allOrders = ordersData?.data?.orders || [];
  const totalSpent = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const completedOrders = allOrders.filter((o) => o.status === 'DELIVERED').length;
  const activeOrders = allOrders.filter((o) => ['PENDING', 'PROCESSING', 'WASHING', 'DRYING', 'IRONING', 'READY'].includes(o.status)).length;

  const shouldShowEmptyState = !ordersLoading && allOrders.length === 0;

  return (
    <div className='p-6 space-y-8 max-w-[1440px] mx-auto animate-in fade-in duration-500'>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>My Orders</h1>
          <p className="text-slate-500 mt-1">Track your purchases and order status in real-time.</p>
        </div>
        {!ordersLoading && <ExportButton dashboardData={{ orders: allOrders }} dateRange={{}} />}
      </div>

      {/* Summary Stats */}
      <section className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
        {ordersLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
        ) : (
          <>
            <StatCard title='Total Spent' value={`₦${totalSpent.toLocaleString()}`} icon={TrendingUp} iconBg='bg-indigo-600' iconColor="text-white" />
            <StatCard title='Total Orders' value={allOrders.length} icon={ShoppingBag} iconBg='bg-slate-800' iconColor="text-white" />
            <StatCard title='Active' value={activeOrders} icon={Clock} iconBg='bg-amber-500' iconColor="text-white" />
            <StatCard title='Completed' value={completedOrders} icon={CheckCircle} iconBg='bg-emerald-600' iconColor="text-white" />
          </>
        )}
      </section>

      {/* Orders Table */}
      <Card className='shadow-sm border-slate-200 overflow-hidden'>
        <CardHeader className="pb-4">
          <CardTitle>Order History</CardTitle>
          <CardDescription>A complete list of your recent transactions and their current status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {shouldShowEmptyState ? (
            <EmptyState />
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100">
                    <TableHead className="font-bold text-slate-700">Order Number</TableHead>
                    <TableHead className="font-bold text-slate-700 hidden md:table-cell">Date</TableHead>
                    <TableHead className="font-bold text-slate-700 hidden lg:table-cell">Items</TableHead>
                    <TableHead className="font-bold text-slate-700">Amount</TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    <TableSkeleton rows={5} />
                  ) : (
                    allOrders.map((order) => {
                      const statusKey = order.status?.toUpperCase() || 'PENDING';
                      const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.PENDING;

                      return (
                        <TableRow 
                          key={order._id} 
                          className="hover:bg-slate-50/80 transition-colors border-slate-100"
                        >
                          <TableCell className='font-bold text-slate-600'>
                            #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm hidden md:table-cell">
                            {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-slate-600 text-sm hidden lg:table-cell">
                            {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                          </TableCell>
                          <TableCell className='font-bold text-slate-900'>
                            ₦{(order.totalAmount || 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant="outline"
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm ${config.container}`}
                            >
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 cursor-pointer hover:bg-slate-100"
                            >
                              <Eye className="h-4 w-4 text-slate-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Sub-components---

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <Inbox className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-900">No orders yet</h3>
      <p className="text-sm text-slate-500 max-w-[200px] mt-1">
        When you make your first purchase, it will appear here.
      </p>
    </div>
  );
}

function TableSkeleton({ rows }) {
  return Array(rows).fill(0).map((_, i) => (
    <TableRow key={i}>
      <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
    </TableRow>
  ));
}