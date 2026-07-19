import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Printer, Download, Package, User, DollarSign, Settings, Clock, MapPin, Phone, Mail } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  WASHING: {
    label: "Washing",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  DRYING: {
    label: "Drying",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  IRONING: {
    label: "Ironing",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  READY: {
    label: "Ready",
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

export default function OrderDetailsDialog({ 
  open, 
  onOpenChange, 
  order, 
  onDownload
}) {
  if (!order) return null;

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(amt || 0);

  const formatDate = (date) => 
    new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const statusKey = order.status?.toUpperCase() || 'PENDING';
  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.PENDING;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-[#4F7DF3] p-8 text-white">
          <DialogTitle className="text-2xl font-bold text-white">
            Order Details
          </DialogTitle>
          <p className="text-slate-100 text-sm mt-2">
            View your order information and track progress
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Order Details Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Package className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Order Details</h3>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Order Number</p>
                <h2 className="text-2xl font-black text-slate-900">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</h2>
                <p className="text-sm text-slate-500 mt-1">{formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${statusConfig.color} border`}>
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Customer Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Customer Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-8 py-4 border-y border-slate-50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Customer Name</p>
                <p className="font-bold text-slate-900 text-lg">{order.customerName || "N/A"}</p>
                <p className="text-xs text-slate-500 mt-1">Customer ID: {order.customerId || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Contact</p>
                {order.customerPhone && (
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <p className="text-slate-900 font-medium text-sm">{order.customerPhone}</p>
                  </div>
                )}
                {order.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <p className="text-slate-900 font-medium text-sm break-all">{order.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Location Section */}
          {order.deliveryLocation && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Delivery Location</h3>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-slate-900 font-medium text-sm">{order.deliveryLocation}</p>
                {order.deliveryInstructions && (
                  <p className="text-slate-500 text-xs mt-2 italic">{order.deliveryInstructions}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Items Section */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Package className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Order Items ({order.items.length})</h3>
              </div>

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{item.itemName || item.name || "Item"}</p>
                      {item.quantity && (
                        <p className="text-sm text-slate-500 mt-1">Quantity: {item.quantity} {item.unit || 'pcs'}</p>
                      )}
                    </div>
                    {item.itemPrice && (
                      <p className="font-bold text-slate-900 text-right ml-4">{formatCurrency(item.itemPrice)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline/Status Progress Section */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Order Timeline</h3>
              </div>

              <div className="space-y-3">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5"></div>
                      {index < order.timeline.length - 1 && <div className="w-0.5 h-12 bg-slate-200 my-1"></div>}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-slate-900 text-sm">{event.status || event.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {event.timestamp ? formatDate(event.timestamp) : "N/A"}
                      </p>
                      {event.note && <p className="text-xs text-slate-600 mt-1">{event.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Summary Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Financial Summary</h3>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl space-y-3">
              {order.subtotal && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(order.subtotal)}</span>
                </div>
              )}
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-bold">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              {order.deliveryFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Delivery Fee</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                <span className="text-slate-900 font-black">Total Amount</span>
                <span className="text-indigo-600 font-black text-lg">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Actions</h3>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 px-6 py-3 bg-[#4F7DF3] hover:bg-[#3F6AE1] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button
                variant="outline"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => onDownload?.(order)}
              >
                <Download className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
