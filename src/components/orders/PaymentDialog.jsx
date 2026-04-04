import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "POS", label: "POS" },
  { value: "TRANSFER", label: "Bank Transfer" },
  { value: "WALLET", label: "Customer Wallet" },
];

export default function PaymentDialog({ open, onOpenChange, order, onSubmit, isPending }) {
  const [formData, setFormData] = useState({
    amount: order?.totalAmount || 0,
    method: "CASH",
    reference: "",
  });

  useEffect(() => {
    if (open && order) {
      setFormData({
        amount: order.totalAmount || 0,
        method: "CASH",
        reference: "",
      });
    }
  }, [open, order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;

    const payload = {
      paymentStatus: "PAID",
      paymentDetails: {
        amount: Number(formData.amount) || 0,
        method: formData.method,
        reference: formData.reference.trim(),
        paidAt: new Date().toISOString(),
      },
    };

    try {
      await onSubmit(order._id || order.id, payload);
      toast.success("Payment recorded");
      onOpenChange(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to record payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold" htmlFor="amount">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold" htmlFor="method">
              Method
            </Label>
            <Select
              value={formData.method}
              onValueChange={(v) => setFormData((f) => ({ ...f, method: v }))}
            >
              <SelectTrigger id="method" className="h-9 bg-white border-slate-300">
                <SelectValue placeholder="Choose method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold" htmlFor="reference">
              Reference / Notes
            </Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData((f) => ({ ...f, reference: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
