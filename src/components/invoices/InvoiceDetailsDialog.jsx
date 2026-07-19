import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Printer, Download, CheckCircle2, CreditCard, Banknote, Loader2, FileText, User, DollarSign, Settings } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "CASH", label: "Cash", icon: Banknote },
  { id: "POS", label: "POS", icon: CreditCard },
  { id: "TRANSFER", label: "Transfer", icon: CreditCard },
];

export default function InvoiceDetailsDialog({ 
  open, 
  onOpenChange, 
  invoice, 
  onDownload, 
  onPay, 
  isPending 
}) {
  const [selectedMethod, setSelectedMethod] = useState("CASH");

  if (!invoice) return null;

  const isPaid = invoice.paymentStatus === "PAID";

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(amt || 0);

  const formatDate = (date) => 
    new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const handlePayment = () => {
    onPay({
      paymentDetails: {
        method: selectedMethod,
        recordedAt: new Date().toISOString()
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-[#4F7DF3] p-8 text-white">
          <DialogTitle className="text-2xl font-bold text-white">
            Invoice Summary
          </DialogTitle>
          <p className="text-slate-100 text-sm mt-2">
            Review invoice details and manage payments
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Invoice Details Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Invoice Details</h3>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Invoice Number</p>
                <h2 className="text-2xl font-black text-slate-900">#{invoice.invoiceNumber}</h2>
                <p className="text-sm text-slate-500 mt-1">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={isPaid ? "bg-emerald-100 text-emerald-700 border-none" : "bg-indigo-100 text-indigo-700 border-none"}>
                  {invoice.status}
                </Badge>
                <Badge variant="outline" className={isPaid ? "border-emerald-200 text-emerald-600" : "border-amber-200 text-amber-600"}>
                  {invoice.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Billing Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Billing Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-8 py-4 border-y border-slate-50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Billed To</p>
                <p className="font-bold text-slate-900 text-lg">{invoice.customerName}</p>
                <p className="text-xs text-slate-500 break-all">{invoice.invoiceId}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Amount Due</p>
                <p className="font-black text-indigo-600 text-2xl">{formatCurrency(invoice.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Payment Recording Section (Visible only if UNPAID) */}
          {!isPaid && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Record Payment</h3>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-700">Select Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex flex-col items-center justify-center h-11 px-4 rounded-md border-2 transition-all ${
                        selectedMethod === method.id
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-600"
                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      <method.icon className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{method.label}</span>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={isPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Mark as Fully Paid
                </Button>
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
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(invoice.totalAmount)}</span>
               </div>
               <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                  <span className="text-slate-900 font-black">Total Amount</span>
                  <span className="text-slate-900 font-black">{formatCurrency(invoice.totalAmount)}</span>
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
                onClick={() => onDownload(invoice)}
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