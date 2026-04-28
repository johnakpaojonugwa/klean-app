import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  inventoryApi,
  getInventoryByBranch,
  updateInventoryItem,
  addInventoryItem,
  adjustInventoryStock,
} from "@/api/inventory";
import { apiFromUi, normalizeApiList } from "@/lib/inventoryUtils";
import { useApp } from "@/context/AppContext";
import { showSuccess, showError } from "@/hooks/useToast";
import { Package, Loader2, AlertCircle, Activity, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// Components
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryFormDialog } from "@/components/inventory/InventoryFormDialog";
import { StockAdjustDialog } from "@/components/inventory/StockAdjustDialog";
import EmptyState from "@/components/common/EmptyState";

// Static constants
const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "DETERGENT", label: "Detergents" },
  { value: "SOFTENER", label: "Softeners" },
  { value: "PACKAGING", label: "Packaging" },
  { value: "CHEMICALS", label: "Chemicals" },
  { value: "EQUIPMENTS", label: "Equipments" },
  { value: "HANGERS", label: "Hangers" },
  { value: "STAIN_REMOVAL", label: "Stain Removal" },
  { value: "OTHER", label: "Other" },
];

export default function Inventory() {
  const { branchId } = useApp();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [formState, setFormState] = useState({ open: false, data: null });
  const [adjustItem, setAdjustItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

  // --- DATA FETCHING ---
  const { data: inventoryData, isPending } = useQuery({
    // Uses the central key factory for consistent caching
    queryKey: inventoryApi.keys.lists(branchId),
    queryFn: () => getInventoryByBranch(branchId, 1, 100),
    enabled: !!branchId,
  });

  const inventory = useMemo(() => {
    // Normalizes backend response to ensure consistent field names
    return normalizeApiList(inventoryData?.data?.items || []);
  }, [inventoryData]);

  const stats = useMemo(() => {
    const lowStockCount = inventory.filter(
      (i) => (i.currentStock || 0) <= (i.minimumStock || 0)
    ).length;
    const totalItems = inventory.length;
    return { lowStockCount, totalItems };
  }, [inventory]);

  // --- MUTATIONS ---
  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (!branchId) throw new Error("Branch session expired.");
      const payload = { ...apiFromUi(data), branchId };
      return data.id
        ? updateInventoryItem(data.id, payload)
        : addInventoryItem(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryApi.keys.lists(branchId) });
      showSuccess("Inventory synchronized");
      setFormState({ open: false, data: null });
    },
    onError: (err) => {
      const msg = err.response?.data?.errors?.[0] || err.response?.data?.message || err.message;
      showError(msg);
    },
  });

  const adjustMutation = useMutation({
  mutationFn: ({ id, payload }) => {
    const finalAmount = Math.round(Number(payload)) || 0;

    if (finalAmount === 0) {
      throw new Error("Adjustment amount cannot be zero.");
    }

    const reason = "Manual Adjustment"; 

    return adjustInventoryStock(branchId, id, finalAmount, reason);
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryApi.keys.lists(branchId) });
      showSuccess("Stock level updated");
      setAdjustItem(null);
    },
    onError: (err) => {
      const backendErrors = err.response?.data?.errors;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((msg) => showError(msg));
      } else {
        showError(err.response?.data?.message || "Adjustment failed");
      }
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id) => updateInventoryItem(id, { isActive: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryApi.keys.lists(branchId) });
      showSuccess("Item archived");
    },
    onError: (err) => {
      const msg = err.response?.data?.errors?.[0] || err.response?.data?.message || err.message;
      showError(msg || "Failed to archive item");
    },
  });

  const handleDelete = (item) => {
    setDeleteConfirm({ open: true, item });
  };

  const confirmDelete = () => {
    if (deleteConfirm.item) {
      deleteMutation.mutate(deleteConfirm.item._id || deleteConfirm.item.id);
      setDeleteConfirm({ open: false, item: null });
    }
  };

  const filteredData = useMemo(() =>
  inventory.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.sku || "").toLowerCase().includes(search.toLowerCase());

    const itemCategory = (item.category || "").toUpperCase();
    const selectedCategory = (category || "").toUpperCase();

    const matchesCategory = 
      category === "all" || 
      itemCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  }),
  [inventory, search, category]
);

  // Loading state while checking branch context
  if (!branchId) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600/60" />
        <p className="text-slate-400 font-medium animate-pulse">Establishing Secure Connection...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 space-y-6">
      {/* 1. Header Section */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supply Inventory</h1>
          <p className="text-slate-500 text-sm">Real-time stock monitoring and replenishment</p>
        </div>

        <div className="flex gap-3">
          <StatCard label="Total Items" value={stats.totalItems} icon={Activity} color="indigo" />
          <StatCard
            label="Low Stock"
            value={stats.lowStockCount}
            icon={AlertCircle}
            color="amber"
            highlight={stats.lowStockCount > 0}
          />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* 2. Search and Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full max-w-4xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by item name or SKU..."
              className="pl-10 bg-slate-50/50 border-slate-200 focus-visible:ring-indigo-500 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px] h-11 bg-slate-50/50 border-slate-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setFormState({ open: true, data: null })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 shadow-md shadow-indigo-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supply
            </Button>
          </div>
        </div>

        {/* 3. Main Data Table */}
        <Card className="border-none shadow-sm bg-white/70 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            {isPending ? (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-indigo-50 border-b border-slate-100">
                    <tr className="hover:bg-transparent">
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-24" /></th>
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-16" /></th>
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-28" /></th>
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-20" /></th>
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-24" /></th>
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-20" /></th>
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-16" /></th>
                      <th className="px-6 py-3 text-xs"><Skeleton className="h-4 w-12" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-indigo-50/50">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded" /><Skeleton className="h-4 w-32" /></div></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                        <td className="px-6 py-4"><div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-2 w-full" /></div></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-12" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-8 w-8 rounded" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : filteredData.length > 0 ? (
              <InventoryTable
                data={filteredData}
                onEdit={(item) => setFormState({ open: true, data: item })}
                onAdjust={setAdjustItem}
                onDelete={handleDelete}
              />
            ) : (
              <div className="py-20">
                <EmptyState
                  icon={Package}
                  title="No matches found"
                  description="Adjust your filters or try adding a new supply item."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overlays */}
      <InventoryFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((prev) => ({ ...prev, open }))}
        initialData={formState.data}
        onSave={(data) => saveMutation.mutate(data)}
        isPending={saveMutation.isPending}
      />

      <StockAdjustDialog
        item={adjustItem}
        onClose={() => setAdjustItem(null)}
        onConfirm={(id, payload) => adjustMutation.mutate({ id, payload })}
        isPending={adjustMutation.isPending}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm({ open: false, item: null });
        }}
        title="Archive Item"
        description={`Are you sure you want to archive "${deleteConfirm.item?.name}" from inventory? This action cannot be undone.`}
        confirmText="Archive"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </main>
  );
}

// Fixed StatCard with proper template literals
function StatCard({ label, value, icon: Icon, color, highlight }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: highlight
      ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse"
      : "bg-slate-50 text-slate-500 border-slate-100",
  };

  return (
    <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl border ${colors[color]} min-w-[160px]`}>
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider font-bold opacity-70">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </div>
  );
}