import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

export function StockAdjustDialog({ item, onClose, onConfirm, isPending }) {
  const [adjustment, setAdjustment] = useState(0);

  useEffect(() => { setAdjustment(0); }, [item]);

  if (!item) return null;

  const newTotal = Math.max(0, (Number(item.currentStock) || 0) + adjustment);

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Adjust Stock: {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between px-4">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setAdjustment(prev => prev - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <span className="text-4xl font-bold text-slate-800">{adjustment > 0 ? `+${adjustment}` : adjustment}</span>
              <p className="text-xs text-slate-500 uppercase mt-1">Adjustment</p>
            </div>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setAdjustment(prev => prev + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2 text-sm">
          <div className="flex justify-between">
              <span className="text-slate-500">Current Stock:</span>
              <span className="font-medium">{item.currentStock} {item.unit}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Final Stock:</span>
              <span className="font-bold text-teal-600">{newTotal} {item.unit}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button 
              className="flex-1 bg-teal-600 hover:bg-teal-700" 
              disabled={adjustment === 0 || isPending}
              onClick={() => onConfirm(item.id, adjustment)}
            >
              {isPending ? "Updating..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}