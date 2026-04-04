import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Camera, MapPin } from "lucide-react";

const CATEGORY_ABBREV = {
  detergent: "DET",
  softener: "SOF",
  packaging: "PAK",
  hangers: "HAN",
  chemicals: "CHM",
  stain_removal: "STN",
  equipments: "EQP",
  other: "OTH",
};

export function InventoryFormDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
  isPending,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "detergent",
    sku: "",
    currentStock: 0,
    minimumStock: 5,
    unit: "pieces",
    unitCost: 0,
    supplierContact: "",
    lastRestock: "",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Map backend fields (reorderLevel) to UI fields (minimumStock)
        setFormData({
          ...initialData,
          minimumStock: initialData.reorderLevel || 5,
          unitCost: initialData.unitCost || 0,
          supplierContact: initialData.supplierContact || "",
           lastRestock:
             initialData.lastRestock ||
             initialData.lastRestocked ||
             initialData.last_restock ||
             initialData.last_restocked ||
             "",
        });
      } else {
        setFormData({
          name: "",
          category: "detergent",
          sku: `${CATEGORY_ABBREV["detergent"]}-${nanoid(4).toUpperCase()}`,
          currentStock: "0",
          minimumStock: "5",
          unit: "pieces",
          unitCost: "0",
          supplierContact: "",
          lastRestock: "",
        });
      }
    }
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      currentStock: Number(formData.currentStock) || 0,
      minimumStock: Number(formData.minimumStock) || 0,
      unitCost: Number(formData.unitCost) || 0,
      supplierContact: formData.supplierContact,
      lastRestock: formData.lastRestock, 
    };
    
    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <DialogTitle className="text-2xl font-bold text-white">
            {initialData ? "Edit Supply" : "Add Supply"}
          </DialogTitle>
          <p className="text-indigo-100 text-sm mt-2">
            {initialData ? "Update inventory item details" : "Add a new inventory item"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Item Identity</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Item Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="e.g., Premium Detergent"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => {
                    setFormData((prev) => ({
                      ...prev,
                      category: v,
                      sku: initialData
                        ? prev.sku
                        : `${CATEGORY_ABBREV[v] || "GEN"}-${nanoid(4).toUpperCase()}`,
                    }));
                  }}
                  className="h-11"
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORY_ABBREV).map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">SKU</Label>
                <Input
                  readOnly
                  value={formData.sku}
                  className="h-11 bg-slate-100 border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Stock & Pricing</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Current Stock</Label>
                <Input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Minimum Stock</Label>
                <Input
                  type="number"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(v) => setFormData({ ...formData, unit: v })}
                  className="h-11"
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="rolls">Rolls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Unit Cost (₦)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Camera className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Supplier & Restock</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Supplier Contact</Label>
                <Input
                  value={formData.supplierContact}
                  onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Last Restock Date</Label>
                <Input
                  type="date"
                  value={
                    formData.lastRestock
                      ? String(formData.lastRestock).split("T")[0]
                      : ""
                  }
                  onChange={(e) => setFormData({ ...formData, lastRestock: e.target.value })}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
