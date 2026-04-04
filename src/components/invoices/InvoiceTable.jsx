import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Updated Config with Dot Colors
const STATUS_CONFIG = {
  PAID: {
    label: "Paid",
    container: "bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100",
    dot: "bg-emerald-500",
  },
  UNPAID: {
    label: "Unpaid",
    container: "bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-100",
    dot: "bg-amber-500",
  },
  OVERDUE: {
    label: "Overdue",
    container: "bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100",
    dot: "bg-rose-500", 
  },
};

export function InvoiceTable({ data, onView }) {
  return (
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow className="border-slate-100">
          <TableHead className="font-bold text-slate-700">Invoice ID</TableHead>
          <TableHead className="font-bold text-slate-700">Customer</TableHead>
          <TableHead className="font-bold text-slate-700">Date</TableHead>
          <TableHead className="font-bold text-slate-700">Amount</TableHead>
          <TableHead className="font-bold text-slate-700 text-center">Status</TableHead>
          <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((inv) => {
          // 2. Safe Fallback Logic
          const config = STATUS_CONFIG[inv.paymentStatus?.toUpperCase()] || STATUS_CONFIG.UNPAID;

          return (
            <TableRow key={inv.invoiceId || inv._id} className="hover:bg-slate-50/80 transition-colors border-slate-100">
              <TableCell className="font-bold text-slate-600">
                #{inv.invoiceNumber}
              </TableCell>
              
              <TableCell className="font-medium text-slate-900">
                {inv.customerName}
              </TableCell>
              
              <TableCell className="text-slate-500 text-sm">
                {new Date(inv.invoiceDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
              
              <TableCell className="font-bold text-slate-900">
                ₦{inv.totalAmount.toLocaleString()}
              </TableCell>
              
              <TableCell className="text-center">
                <Badge 
                  variant="outline"
                  className={cn(
                    "inline-flex items-center gap-2 px-2 py-1 rounded-full w-fit font-bold text-[10px] uppercase tracking-wider shadow-sm transition-all",
                    config.container
                  )}
                >
                  {/* The Animated Pulse Indicator */}
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
                  {config.label}
                </Badge>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onView(inv)} 
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}