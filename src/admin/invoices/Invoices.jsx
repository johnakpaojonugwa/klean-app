import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  AlertCircle,
  Loader2,
  Activity,
  Search,
} from "lucide-react";

// Shadcn UI Imports
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

// Internal Imports
import { ordersApi, getOrders } from "@/api/orders";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import InvoiceDetailsDialog from "@/components/invoices/InvoiceDetailsDialog";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";

const STATUS_TABS = [
  { value: "ALL", label: "All Invoices" },
  { value: "PAID", label: "Paid" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "OVERDUE", label: "Overdue" },
];

const OVERDUE_THRESHOLD_DAYS = 3;

export default function Invoices() {
  const { branchId } = useApp();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // --- DATA FETCHING ---
  const { data: rawOrders, isPending } = useQuery({
    queryKey: ordersApi.keys.lists({
      branchId,
      page: 1,
      limit: 100,
    }),
    queryFn: () => getOrders(1, 100, null),
    enabled: !!branchId,
  });

  // --- DATA NORMALIZATION ---
  const invoices = useMemo(() => {
    if (!rawOrders) return [];
    const orders = rawOrders.data?.orders || rawOrders.orders || [];
    return orders.map((order) => ({
      ...order,
      invoiceId: order._id || order.id,
      invoiceNumber:
        order.orderNumber || (order._id || order.id)?.slice(-6).toUpperCase(),
      invoiceDate: order.createdAt || new Date().toISOString(),
      totalAmount: Number(order.totalAmount || 0),
      status: order.status?.toUpperCase() || "PENDING",
      paymentStatus: order.paymentStatus || "UNPAID",
      customerName: order.customerName || "Unknown Customer",
    }));
  }, [rawOrders]);

  // --- MUTATIONS ---
  const payMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      ordersApi.markAsPaid(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ordersApi.keys.all,
      });
      toast.success("Payment synchronized");
      setShowDetails(false);
    },
    onError: (err) => toast.error(err.message || "Payment update failed"),
  });

  // --- CALCULATIONS ---
  const stats = useMemo(() => {
    const now = Date.now();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    return invoices.reduce(
      (acc, inv) => {
        acc.total += inv.totalAmount;
        if (inv.paymentStatus === "PAID") acc.paid += inv.totalAmount;
        else {
          const isOverdue =
            (now - new Date(inv.invoiceDate).getTime()) / MS_PER_DAY >
            OVERDUE_THRESHOLD_DAYS;
          if (isOverdue) acc.overdueAmount += inv.totalAmount;
        }
        return acc;
      },
      { total: 0, paid: 0, overdueAmount: 0 },
    );
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesPayment =
        paymentFilter === "ALL" || inv.paymentStatus === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [invoices, search, paymentFilter]);

  if (!branchId)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600/60" />
          <p className="text-slate-400 font-medium animate-pulse">
            Establishing Secure Connection...
          </p>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 lg:p-8 space-y-6">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Billing & Revenue
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor payments and customer invoices
          </p>
        </div>
        <div className="flex gap-3">
          <StatCard
            label="Total Revenue"
            value={`₦${stats.total.toLocaleString()}`}
            icon={Activity}
            color="indigo"
          />
          <StatCard
            label="Overdue"
            value={`₦${stats.overdueAmount.toLocaleString()}`}
            icon={AlertCircle}
            color="amber"
            highlight={stats.overdueAmount > 0}
          />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search invoices or customers..."
              className="pl-10 bg-slate-50/50 border-slate-200 h-11 focus-visible:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <Tabs value={paymentFilter} onValueChange={setPaymentFilter}>
              <TabsList className="bg-slate-100 h-11">
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-xs font-bold uppercase px-6 cursor-pointer data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-indigo-100"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button
              onClick={() => toast.info("Redirecting to POS...")}
              className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-md shadow-indigo-100 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" /> New Invoice
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm bg-white/70 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            {isPending ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="text-slate-400 text-sm font-medium">
                  Loading ledger...
                </span>
              </div>
            ) : filteredInvoices.length > 0 ? (
              <InvoiceTable
                data={filteredInvoices}
                onView={(inv) => {
                  setSelectedInvoice(inv);
                  setShowDetails(true);
                }}
              />
            ) : (
              <div className="py-20">
                <EmptyState
                  icon={FileText}
                  title="No invoices found"
                  description="Adjust filters or search terms."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <InvoiceDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        invoice={selectedInvoice}
        onPay={(payload) =>
          payMutation.mutate({ id: selectedInvoice.invoiceId, payload })
        }
        isPending={payMutation.isPending}
      />
    </main>
  );
}

function StatCard({ label, value, icon: Icon, color, highlight }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: highlight
      ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse"
      : "bg-slate-50 text-slate-500 border-slate-100",
  };

  return (
    <div
      className={`flex items-center gap-4 px-5 py-3 rounded-2xl border ${colors[color]} min-w-[180px]`}
    >
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">
          {label}
        </p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </div>
  );
}
