import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Clock, Package } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  WASHING: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DRYING: "bg-purple-50 text-purple-700 border-purple-200",
  IRONING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  READY: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DELIVERED: "bg-slate-50 text-slate-700 border-slate-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200"
};

const paymentColors = {
  UNPAID: "text-rose-600",
  PARTIAL: "text-amber-600",
  PAID: "text-emerald-600"
};

export default function RecentOrders({ data = [], loading }) {
  // Defensive check for data array
  const safeData = Array.isArray(data) ? data : [];
  const recentOrders = safeData.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
        {/* Header skeleton */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        {/* Order list skeleton */}
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
          <Link to={createPageUrl("Orders")}>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
              View All
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100">
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No orders yet
          </div>
        ) : (
          recentOrders.map((order) => {
            const displayId = order.orderNumber || (order._id ? order._id.slice(-6) : "---");
            const customerName = order.customerName || order.customer?.name || "Unknown Customer";
            const date = order.createdAt;
            const amount = order.totalAmount || order.total || 0;
            const status = (order.status || 'PENDING').toUpperCase();
            const paymentStatus = order.paymentStatus || 'UNPAID';

            return (
              <div key={order._id || order.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800">
                        #{displayId}
                      </span>
                      <Badge className={`${statusColors[status] || "bg-slate-50"} border font-medium shadow-none`}>
                        {status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-slate-700 font-semibold">{customerName}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {date ? format(new Date(date), 'MMM d, h:mm a') : 'Date unknown'}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Package className="w-3 h-3" />
                        {order.items?.length || 0} items
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-lg font-bold text-slate-800">₦{amount.toFixed(2)}</p>
                    <p className={`text-xs font-medium ${paymentColors[paymentStatus] || 'text-slate-600'}`}>
                      {paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}