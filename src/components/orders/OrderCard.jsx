import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/DropdownMenu";
import { MoreVertical, Eye, Edit, Trash2, FileText, CheckCircle, Truck, Package, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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

const priorityColors = {
  NORMAL: "bg-slate-100 text-slate-600",
  EXPRESS: "bg-orange-100 text-orange-700",
  URGENT: "bg-rose-100 text-rose-700"
};

const paymentColors = {
  UNPAID: "text-rose-600",
  PARTIAL: "text-amber-600",
  PAID: "text-emerald-600"
};

export default function OrderCard({
  order,
  onEdit,
  onDelete,
  onStatusChange,
  onMarkAsPaid,
  onGenerateInvoice,
  isStatusUpdating = false,
}) {
  const statusFlow = ['PENDING', 'PROCESSING', 'WASHING', 'DRYING', 'IRONING', 'READY', 'DELIVERED'];
  const currentStatus = order.status?.toUpperCase();
  const currentIndex = statusFlow.indexOf(currentStatus);
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  
  // Check if order is paid
  const isPaid = order.paymentStatus === 'PAID';
  // Check if trying to move from PENDING to PROCESSING
  const isBlockedTransition = currentStatus === 'PENDING' && nextStatus === 'PROCESSING' && !isPaid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col h-full overflow-hidden"
    >
      {/* HEADER SECTION: Fixed layout to prevent scattering */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="min-w-0 flex-1"> {/* min-w-0 is critical for truncation */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-slate-800 shrink-0">
              #{order.orderNumber || (order._id || order.id)?.slice(-6)}
            </span>
            <Badge className={`${priorityColors[order.priority] || priorityColors.NORMAL} border-0 font-medium text-[10px] uppercase tracking-wider`}>
              {order.priority}
            </Badge>
          </div>
          <h3 className="text-slate-900 font-bold truncate leading-tight" title={order.customerName}>
            {order.customerName}
          </h3>
          <p className="text-xs text-slate-400 truncate">{order.customerPhone || 'No Phone'}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Badge className={`${statusColors[currentStatus] || statusColors.PENDING} border font-bold text-[10px] whitespace-nowrap`}>
            {currentStatus?.replace('_', ' ')}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(order)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onGenerateInvoice(order)}>
                <FileText className="w-4 h-4 mr-2" /> View Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {currentStatus === 'PENDING' && !isPaid ? (
                <DropdownMenuItem onClick={() => onMarkAsPaid(order)} className="text-emerald-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark as Paid
                </DropdownMenuItem>
              ) : null}
              {nextStatus && !isBlockedTransition && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(nextStatus)}
                  disabled={isStatusUpdating}
                  className="text-indigo-600 font-medium"
                >
                  {isStatusUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  {isStatusUpdating ? "Updating..." : `Move to ${nextStatus.replace('_', ' ')}`}
                </DropdownMenuItem>
              )}
              {isBlockedTransition && (
                <DropdownMenuItem disabled className="text-rose-600 cursor-not-allowed">
                  <AlertCircle className="w-4 h-4 mr-2" /> Payment Required
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(order._id || order.id)} 
                className="text-rose-600 focus:bg-rose-50 focus:text-rose-600"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* BODY SECTION: Pushed to fill space */}
      <div className="space-y-3 flex-grow">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-tight">Service</span>
          <span className="font-semibold text-slate-700 capitalize truncate ml-4">
            {order.serviceType?.replace('_', ' ').toLowerCase()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-tight">Items</span>
          <span className="font-semibold text-slate-700">{order.items?.length || 0} pcs</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-tight">Due Date</span>
          <span className="font-semibold text-slate-700">
            {order.deliveryDate ? format(new Date(order.deliveryDate), 'MMM d, yyyy') : 'Not set'}
          </span>
        </div>
        
        {/* PAYMENT & AMOUNT */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            {order.paymentStatus?.toUpperCase()}
          </span>
          <span className="text-lg font-black text-slate-900 leading-none">
            ₦{order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </span>
        </div>
      </div>

      {/* FOOTER ACTION: Fixed at bottom */}
      <div className="mt-5 shrink-0">
        {currentStatus === 'PENDING' && !isPaid ? (
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-100 transition-all active:scale-[0.98] cursor-pointer"
            onClick={() => onMarkAsPaid(order)}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Mark as Paid
          </Button>
        ) : isBlockedTransition ? (
          <Button variant="outline" disabled className="w-full border-rose-200 text-rose-600 bg-rose-50">
            <AlertCircle className="w-4 h-4 mr-2" /> Payment Required
          </Button>
        ) : nextStatus ? (
          <Button 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-100 transition-all active:scale-[0.98] cursor-pointer"
            onClick={() => onStatusChange(nextStatus)}
            disabled={isStatusUpdating}
          >
            {isStatusUpdating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
            ) : nextStatus === 'DELIVERED' ? (
              <><Truck className="w-4 h-4 mr-2" /> Complete Delivery</>
            ) : nextStatus === 'READY' ? (
              <><Package className="w-4 h-4 mr-2" /> Mark as Ready</>
            ) : (
              <><CheckCircle className="w-4 h-4 mr-2" /> Start {nextStatus?.toLowerCase()}</>
            )}
          </Button>
        ) : (
          <Button variant="outline" disabled className="w-full border-slate-100 text-slate-500 bg-slate-50">
            Order Completed
          </Button>
        )}
      </div>
    </motion.div>
  );
}