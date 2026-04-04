import { motion } from "framer-motion";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const Status_Color = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  WASHING: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DRYING: "bg-purple-50 text-purple-700 border-purple-200",
  IRONING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  READY: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DELIVERED: "bg-slate-50 text-slate-700 border-slate-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

const getStatusColor = (status) => Status_Color[status?.toUpperCase()] || Status_Color.PENDING;

export default function InvoiceCard({ invoice, index, onView, onDownload }) {
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amt || 0);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col h-full overflow-hidden"
    >
      {/* Header Area */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-900 leading-none truncate">
            #{invoice.invoiceNumber}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
            {formatDate(invoice.invoiceDate)}
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
          <FileText className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow space-y-1.5 mb-5">
        <p className="text-sm font-bold text-slate-800 truncate" title={invoice.customerName}>
          {invoice.customerName}
        </p>
        <p className="text-[10px] text-slate-400 font-mono italic opacity-70">
          ID: {invoice.invoiceId?.slice(-10) || "N/A"}
        </p>
      </div>

      {/* Pricing Area */}
      <div className="mb-5 bg-slate-50/50 p-3 rounded-lg border border-slate-50">
        <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Total Amount</p>
        <p className="text-xl font-black text-slate-900 tracking-tight leading-none mt-1">
          ₦{formatCurrency(invoice.totalAmount)}
        </p>
      </div>

      {/* Footer Actions (Pinned to bottom) */}
      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <Badge className={`${getStatusColor(invoice.status)} shadow-none border font-bold text-[9px] px-2 py-0.5 uppercase tracking-tighter`}>
            {invoice.status}
          </Badge>
          {invoice.paymentStatus && (
            <Badge className={`text-[9px] px-2 py-0.5 uppercase tracking-tighter border ${
              invoice.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              invoice.paymentStatus === 'PARTIAL' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              {invoice.paymentStatus}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors" 
            onClick={onView}
          >
            <Eye className="h-4 w-4 text-slate-600" />
          </Button>
          <Button 
            size="icon" 
            className="h-8 w-8 rounded-md bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all active:scale-95" 
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}