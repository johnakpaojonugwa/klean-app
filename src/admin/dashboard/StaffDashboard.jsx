import React, { useMemo, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showSuccess, showError } from "@/hooks/useToast";
import { CheckCircle, Clock, AlertTriangle, Loader2, Package, Phone, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { ordersApi, getOrders, updateOrderStatus } from '@/api/orders';

const LocalStatCard = React.memo(({ title, value, icon, colorClass, gradientClass }) => (
  <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
    <div className={`h-1.5 w-full ${colorClass}`} />
    <CardContent className="p-6 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${gradientClass} shadow-lg shadow-indigo-100`}>
        {icon}
      </div>
    </CardContent>
  </Card>
));

LocalStatCard.displayName = "LocalStatCard";

export function StaffDashboard({ branchId }) {
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Syncing with your API key factory
  const branchQueryKey = ordersApi.keys.lists({ page: 1, limit: 100, branchId });

  // FETCH LOGIC
  const { data: rawOrders, isPending: ordersLoading } = useQuery({
    queryKey: branchQueryKey,
    queryFn: () => getOrders(1, 100, null, branchId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    retry: 1,
    enabled: !!branchId,
  });

  // MUTATION LOGIC
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      showSuccess('Status updated');
      // Invalidate the specific branch list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: branchQueryKey });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      showError(error?.message || 'Update failed');
    },
  });

  // OPTIMIZED DATA SHAPING
  // We filter everything in one loop instead of three
  const { pending, washing, ready } = useMemo(() => {
    const allOrders = Array.isArray(rawOrders?.data?.orders) 
      ? rawOrders.data.orders 
      : Array.isArray(rawOrders) ? rawOrders : [];

    return {
      pending: allOrders.filter(o => o.status === 'PENDING'),
      washing: allOrders.filter(o => o.status === 'WASHING'),
      ready: allOrders.filter(o => o.status === 'READY'),
    };
  }, [rawOrders]);

  const handleUpdateStatus = useCallback((orderId, newStatus) => {
    updateOrderMutation.mutate({ orderId, newStatus });
  }, [updateOrderMutation]);

  const openProcessingDialog = (id) => {
    setSelectedOrderId(id);
    setIsDialogOpen(true);
  };

  return (
    <div className='p-4 md:p-8 space-y-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50'>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className='text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3'>
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Package className="text-white h-6 w-6" />
            </div>
            Staff Operations
          </h1>
          <p className="text-slate-500 font-medium">Branch ID: <span className="text-indigo-600 font-mono">{branchId}</span></p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {ordersLoading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
        ) : (
          <>
            <LocalStatCard
              title='Incoming'
              value={pending.length}
              icon={<AlertTriangle className='text-white' size={24} />}
              colorClass="bg-orange-500"
              gradientClass='bg-gradient-to-br from-orange-400 to-orange-600'
            />
            <LocalStatCard
              title='In Progress'
              value={washing.length}
              icon={<Clock className='text-white' size={24} />}
              colorClass="bg-indigo-600"
              gradientClass='bg-gradient-to-br from-indigo-500 to-indigo-700'
            />
            <LocalStatCard
              title='Ready'
              value={ready.length}
              icon={<CheckCircle className='text-white' size={24} />}
              colorClass="bg-emerald-500"
              gradientClass='bg-gradient-to-br from-emerald-400 to-emerald-600'
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Pending Section */}
        <section className="space-y-4">
           <SectionHeader title="Awaiting Action" count={pending.length} color="text-orange-600" />
           <OrderTable 
              data={pending} 
              loading={ordersLoading} 
              actionLabel="Start Washing"
              onAction={openProcessingDialog}
              actionVariant="warning"
           />
        </section>

        {/* Washing Section */}
        <section className="space-y-4">
           <SectionHeader title="Active Workflow" count={washing.length} color="text-indigo-600" />
           <OrderTable 
              data={washing} 
              loading={ordersLoading} 
              actionLabel="Mark as Ready"
              loadingAction={updateOrderMutation.isPending}
              onAction={(id) => handleUpdateStatus(id, 'READY')}
              actionVariant="indigo"
           />
        </section>

        {/* Ready Section */}
        <section className="space-y-4">
           <SectionHeader title="Ready for Pick-up" count={ready.length} color="text-emerald-600" />
           <OrderTable 
              data={ready} 
              loading={ordersLoading} 
              actionLabel="Complete Delivery"
              loadingAction={updateOrderMutation.isPending}
              onAction={(id) => handleUpdateStatus(id, 'DELIVERED')}
              actionVariant="success"
              showPhone
           />
        </section>
      </div>

      {/* Start Processing Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Begin Washing?</DialogTitle>
            <DialogDescription>This moves the order to the active cleaning queue.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleUpdateStatus(selectedOrderId, 'WASHING')}>
               Confirm Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * HELPER: SECTION HEADER
 */
const SectionHeader = ({ title, count, color }) => (
    <div className="flex items-center justify-between px-2">
        <h2 className={`font-bold text-lg flex items-center gap-2 ${color}`}>
            {title}
            <Badge variant="secondary" className="rounded-full px-2.5">{count}</Badge>
        </h2>
    </div>
);

/**
 * COMPONENT: ORDER TABLE
 */
function OrderTable({ data, loading, actionLabel, onAction, actionVariant, loadingAction, showPhone = false }) {
  if (loading) return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[120px] font-bold text-slate-700"><div className="flex items-center gap-1"><Hash size={14}/> ID</div></TableHead>
              <TableHead className="font-bold text-slate-700">Customer</TableHead>
              {showPhone && <TableHead className="font-bold text-slate-700"><div className="flex items-center gap-1"><Phone size={14}/> Contact</div></TableHead>}
              <TableHead className="font-bold text-slate-700">Order Details</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(4)].map((_, i) => (
              <TableRow key={i} className="hover:bg-slate-50/50">
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                {showPhone && <TableCell><Skeleton className="h-4 w-20" /></TableCell>}
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (data.length === 0) return (
    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
        <Package className="mx-auto h-10 w-10 mb-2 opacity-20" />
        No active orders in this stage.
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[120px] font-bold text-slate-700"><div className="flex items-center gap-1"><Hash size={14}/> ID</div></TableHead>
              <TableHead className="font-bold text-slate-700">Customer</TableHead>
              {showPhone && <TableHead className="font-bold text-slate-700"><div className="flex items-center gap-1"><Phone size={14}/> Contact</div></TableHead>}
              <TableHead className="font-bold text-slate-700">Order Details</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                <TableCell className="font-mono text-xs font-bold text-indigo-600">
                  #{order._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>
                    <div className="font-semibold text-slate-900">{order.customerName || order.customer?.fullname || 'Guest'}</div>
                </TableCell>
                {showPhone && (
                    <TableCell className="text-slate-600 font-medium">
                        {order.customerPhone || 'N/A'}
                    </TableCell>
                )}
                <TableCell>
                   <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                        {order.items?.length || 0} Items
                    </Badge>
                    <span className="text-slate-900 font-bold">
                        ₦{(order.totalAmount || order.total || 0).toLocaleString()}
                    </span>
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    className={`font-semibold shadow-sm transition-all active:scale-95 ${
                        actionVariant === 'warning' ? "bg-orange-500 hover:bg-orange-600 text-white" : 
                        actionVariant === 'indigo' ? "bg-indigo-600 hover:bg-indigo-700 text-white" : 
                        actionVariant === 'success' ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                    onClick={() => onAction(order._id)}
                    disabled={loadingAction}
                  >
                    {loadingAction && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    {actionLabel}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}