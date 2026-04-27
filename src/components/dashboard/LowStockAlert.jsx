import React from "react";
import { AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { normalizeApiList } from "@/lib/inventoryUtils";

export default function LowStockAlert({ data = [], loading }) {
  const inventory = Array.isArray(data) ? data : [];
  
  // Normalize API data and filter unresolved alerts
  const activeAlerts = normalizeApiList(inventory)
    .filter(item => !item.isResolved)
    .map(item => ({
      ...item,
      branchName: inventory.find(raw => raw._id === item.id || raw.id === item.id)?.branchId?.name || 
                  inventory.find(raw => raw._id === item.id || raw.id === item.id)?.branch?.name || ""
    }));

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
          <Skeleton className="h-5 w-32" />
        </div>
        {/* Alert items skeleton */}
        <div className="space-y-3 flex-grow">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
              <div className="max-w-[140px] space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use 'activeAlerts' for the empty state check
  if (activeAlerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-50">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Inventory Status</h3>
        </div>
        <p className="text-emerald-600 font-medium bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center text-sm">
          ✨ All stock levels are healthy!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-amber-50">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Low Stock Alert</h3>
      </div>

      <div className="space-y-3 flex-grow">
        {/* 3. Use 'activeAlerts' for the list rendering */}
        {activeAlerts.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-amber-50/50 border border-amber-100 rounded-xl transition-all hover:bg-amber-50"
          >
            <div className="max-w-[140px]">
              <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold truncate">
                {item.branchName || item.category?.replace("_", " ")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-amber-600 text-sm">
                {item.currentStock} <span className="text-xs font-normal">{item.unit}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Min: {item.minimumStock}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activeAlerts.length > 4 && (
        <Link to={createPageUrl("Inventory")}>
          <Button variant="ghost" size="sm" className="w-full mt-4 text-teal-600 hover:bg-teal-50">
            View {activeAlerts.length - 4} more items
          </Button>
        </Link>
      )}
    </div>
  );
}