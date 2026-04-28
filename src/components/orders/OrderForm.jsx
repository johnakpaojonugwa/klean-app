import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Briefcase,
  Clock,
  Zap,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { showSuccess, showError, showWarning } from "@/hooks/useToast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";

// Constants
const ITEM_TYPES = [
  "Shirt",
  "Pants",
  "Dress",
  "Suit",
  "Jacket",
  "Coat",
  "Bed Sheet",
  "Towel",
  "Other",
];
const PRIORITY_MULTIPLIERS = { NORMAL: 1, EXPRESS: 1.25, URGENT: 1.5 };
const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "POS", label: "POS" },
  { value: "TRANSFER", label: "Bank Transfer" },
  { value: "WALLET", label: "Customer Wallet" },
];
const SERVICE_TYPES = [
  { value: "WASH_FOLD", label: "Wash & Fold" },
  { value: "IRONING", label: "Ironing" },
  { value: "DRY_CLEANING", label: "Dry Cleaning" },
  { value: "STAIN_REMOVAL", label: "Stain Removal" },
  { value: "ALTERATIONS", label: "Alterations" },
];

export default function OrderForm({
  open,
  onClose,
  onSave,
  user,
  customers = [],
  employees = [],
  editOrder = null,
  isPending = false,
}) {
  const getInitialState = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const defaultData = {
      customerId: "",
      customerName: "",
      customerPhone: "",
      branchId: user?.branchId?._id || user?.branchId || "",
      serviceType: "WASH_FOLD",
      priority: "NORMAL",
      items: [
        {
          itemType: "Shirt",
          quantity: 1,
          unitPrice: 0,
          specialInstructions: "",
        },
      ],
      pickupDate: today,
      deliveryDate: "",
      assignedEmployee: "",
      paymentMethod: "CASH",
      discount: 0,
      notes: "",
    };

    if (editOrder) {
      return {
        ...defaultData,
        ...editOrder,
        customerId: editOrder.customerId?._id || editOrder.customerId || "",
        branchId:
          editOrder.branchId?._id || editOrder.branchId || defaultData.branchId,
        assignedEmployee:
          editOrder.assignedEmployee?._id || editOrder.assignedEmployee || "",
        pickupDate: editOrder.pickupDate
          ? new Date(editOrder.pickupDate).toISOString().split("T")[0]
          : today,
        deliveryDate: editOrder.deliveryDate
          ? new Date(editOrder.deliveryDate).toISOString().split("T")[0]
          : "",
      };
    }
    return defaultData;
  }, [editOrder, user]);

  const [formData, setFormData] = useState(getInitialState);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (open) {
      setFormData(getInitialState());
      setValidationError("");
    }
  }, [open, editOrder, getInitialState]);

  const totals = useMemo(() => {
    const rawSubtotal = formData.items.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0,
    );
    const multiplier = PRIORITY_MULTIPLIERS[formData.priority] || 1;
    const subtotal = rawSubtotal * multiplier;
    const tax = subtotal * 0.075;
    const total = subtotal + tax - (Number(formData.discount) || 0);

    return {
      rawItems: Number(rawSubtotal.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Math.max(0, Number(total.toFixed(2))),
    };
  }, [formData.items, formData.priority, formData.discount]);

  const handleCustomerSelect = (id) => {
    const customer = customers.find(
      (customer) => (customer._id || customer.id) === id,
    );
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerId: id,
        customerName: customer.fullname || customer.name || "",
        customerPhone: customer.phoneNumber || customer.phone || "",
      }));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === "quantity") {
      newItems[index][field] = Math.max(1, parseInt(value, 10) || 1);
    } else if (field === "unitPrice") {
      newItems[index][field] = Math.max(0, parseFloat(value) || 0);
    } else {
      newItems[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemType: "Shirt",
          quantity: 1,
          unitPrice: 0,
          specialInstructions: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error("Order must have at least one item.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!formData.customerId) {
      setValidationError("Please select a customer.");
      showWarning("Please select a customer");
      return;
    }
    if (formData.serviceType === "") {
      setValidationError("Please select a service type.");
      showWarning("Please select a service type");
      return;
    }
    if (formData.items.length === 0) {
      setValidationError("Order must have at least one item.");
      showWarning("Order must have at least one item");
      return;
    }
    if (formData.items.some((i) => i.quantity < 1)) {
      setValidationError("All items must have quantity ≥ 1.");
      showWarning("All items must have quantity ≥ 1");
      return;
    }
    if (formData.items.some((i) => i.unitPrice <= 0)) {
      setValidationError("All items must have a unit price > 0.");
      showWarning("All items must have a unit price > 0");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickup = new Date(formData.pickupDate);
    pickup.setHours(0, 0, 0, 0);
    if (pickup < today) {
      setValidationError("Pickup date cannot be in the past.");
      return;
    }

    const branchId = formData.branchId || user?.branchId?._id || user?.branchId;
    const payload = {
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      branchId,
      assignedEmployee: formData.assignedEmployee || undefined,
      serviceType: formData.serviceType,
      items: formData.items,
      pickupDate: formData.pickupDate,
      deliveryDate: formData.deliveryDate || undefined,
      priority: formData.priority,
      discount: Math.max(0, Number(formData.discount) || 0),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    };

    if (formData.assignedEmployee && formData.assignedEmployee !== "") {
      payload.assignedEmployee = formData.assignedEmployee;
    }

    try {
      await onSave(payload);
      showSuccess(
        editOrder ? "Order updated successfully" : "Order created successfully",
      );
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save order.";
      setValidationError(message);
      showError(message);
    }
  };

  const branchName =
    user?.branchName || user?.branchId?.name || "Active Branch";

  // Shared CSS class for consistent height and appearance
  const controlStyles = "h-10 bg-white border-slate-300 w-full";
  const readOnlyStyles =
    "h-10 bg-slate-100 border-slate-300 text-slate-700 w-full";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <DialogTitle className="text-2xl font-bold text-white">
            {editOrder ? "Update Laundry Order" : "Create New Laundry Order"}
          </DialogTitle>
          <p className="text-indigo-100 text-sm mt-2">
            Branch: <span className="font-semibold">{branchName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{validationError}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Customer Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Select Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={handleCustomerSelect}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                    <SelectValue placeholder="Choose customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c._id || c.id} value={c._id || c.id}>
                        {c.fullname || c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                <Input
                  value={formData.customerName}
                  readOnly
                  className="h-11 bg-slate-100 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Phone</Label>
                <Input
                  value={formData.customerPhone}
                  readOnly
                  className="h-11 bg-slate-100 border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Service Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Service Type</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(v) => setFormData({ ...formData, serviceType: v })}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                    <SelectValue placeholder="Choose service type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" /> Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => setFormData((p) => ({ ...p, priority: v }))}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal (1x)</SelectItem>
                    <SelectItem value="EXPRESS">Express (+25%)</SelectItem>
                    <SelectItem value="URGENT">Urgent (+50%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Assign Employee</Label>
                <Select
                  value={formData.assignedEmployee}
                  onValueChange={(v) => setFormData((p) => ({ ...p, assignedEmployee: v }))}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                    <SelectValue placeholder="Optional..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.employeeJobRole || employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Service Items</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                onClick={addItem}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-end p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Item Type</Label>
                      <Select
                        value={item.itemType}
                        onValueChange={(v) => updateItem(idx, "itemType", v)}
                      >
                        <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEM_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                        className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Unit Price (₦)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                        className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-slate-700">Instructions</Label>
                      <Input
                        value={item.specialInstructions}
                        onChange={(e) => updateItem(idx, "specialInstructions", e.target.value)}
                        placeholder="e.g., No starch"
                        className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeItem(idx)}
                    disabled={formData.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Schedule & Payment</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Pickup Date
                </Label>
                <Input
                  type="date"
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData((p) => ({ ...p, pickupDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Delivery Date
                </Label>
                <Input
                  type="date"
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData((p) => ({ ...p, deliveryDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-blue-500" /> Payment Method
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(v) => setFormData((p) => ({ ...p, paymentMethod: v }))}
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
                    <SelectValue />
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
                <Label className="text-sm font-medium text-slate-700">Discount (₦)</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  value={formData.discount}
                  onChange={(e) => setFormData((p) => ({
                    ...p,
                    discount: Math.max(0, parseFloat(e.target.value) || 0),
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal</span>
                <span>₦{totals.rawItems.toLocaleString()}</span>
              </div>
              {formData.priority !== "NORMAL" && (
                <div className="flex justify-between text-slate-400">
                  <span>{formData.priority} Multiplier</span>
                  <span>×{PRIORITY_MULTIPLIERS[formData.priority]}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₦{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (7.5%)</span>
                <span>₦{totals.tax.toLocaleString()}</span>
              </div>
              {Number(formData.discount) > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Discount</span>
                  <span>-₦{Number(formData.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-700 mt-3 flex justify-between items-center">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Total Amount
                </span>
                <span className="text-2xl font-black text-indigo-400">{`₦${totals.total.toLocaleString()}`}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="ghost"
              className="px-6 text-slate-600"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : editOrder ? (
                "Save Changes"
              ) : (
                "Create Order"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
