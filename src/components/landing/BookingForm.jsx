import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Constants matching backend requirements
const SERVICE_TYPES = [
  { value: "WASH_FOLD", label: "Wash & Fold" },
  { value: "IRONING", label: "Ironing" },
  { value: "DRY_CLEANING", label: "Dry Cleaning" },
  { value: "STAIN_REMOVAL", label: "Stain Removal" },
  { value: "ALTERATIONS", label: "Alterations" },
];

const ITEM_TYPE_SUGGESTIONS = [
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

const PRIORITY_OPTIONS = [
  { value: "NORMAL", label: "Normal", multiplier: 1 },
  { value: "EXPRESS", label: "Express (+25%)", multiplier: 1.25 },
  { value: "URGENT", label: "Urgent (+50%)", multiplier: 1.5 },
];

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "POS", label: "POS" },
  { value: "TRANSFER", label: "Bank Transfer" },
  { value: "WALLET", label: "Customer Wallet" },
];

export default function BookingForm({
  onSubmit = null,
  isPending = false,
  branches = [],
  customer = null,
}) {
  const normalizeCustomer = (customerData) => {
    if (!customerData) return null;
    if (customerData.data) {
      return customerData.data.customer || customerData.data.user || customerData.data;
    }
    return customerData;
  };

  const normalizedCustomer = normalizeCustomer(customer);

  const getBranchId = (customerData) =>
    customerData?.branchId?._id || customerData?.branchId || customerData?.userId?.branchId || "";

  const getCustomerPhone = (customerData) =>
    customerData?.phoneNumber || customerData?.phone || customerData?.userId?.phoneNumber || sessionStorage.getItem("klean_user_phone") || "";

  const getCustomerName = (customerData) =>
    customerData?.fullname || customerData?.name || customerData?.userId?.fullname || "";

  const getCustomerId = (customerData) =>
    customerData?._id || customerData?.id || "";

  const getInitialState = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const phoneValue = getCustomerPhone(normalizedCustomer);

    return {
      customerId: getCustomerId(normalizedCustomer),
      customerName: getCustomerName(normalizedCustomer),
      customerPhone: phoneValue,
      branchId: getBranchId(normalizedCustomer),
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
  }, [customer]);

  const [formData, setFormData] = useState(getInitialState);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setFormData(getInitialState());
    setValidationError("");
  }, [getInitialState]);

  // Calculate pricing
  const totals = useMemo(() => {
    const rawSubtotal = formData.items.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0,
    );

    const priorityObj = PRIORITY_OPTIONS.find(
      (p) => p.value === formData.priority,
    );
    const multiplier = priorityObj?.multiplier || 1;
    const subtotal = rawSubtotal * multiplier;
    const tax = subtotal * 0.075;
    const discountAmount = Number(formData.discount) || 0;
    const total = subtotal + tax - discountAmount;

    return {
      rawItems: Number(rawSubtotal.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      total: Math.max(0, Number(total.toFixed(2))),
      multiplier,
    };
  }, [formData.items, formData.priority, formData.discount]);

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
          itemType: "",
          quantity: 1,
          unitPrice: 0,
          specialInstructions: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error("Booking must have at least one item.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  const validateStep = () => {
    setValidationError("");

    // Validate customer info
    if (!formData.customerName.trim()) {
      setValidationError("Please enter customer name");
      return false;
    }
    if (!formData.customerPhone.trim()) {
      setValidationError("Please enter customer phone");
      return false;
    }
    if (!formData.branchId) {
      setValidationError("Please select a branch");
      return false;
    }

    // Validate service details
    if (!formData.serviceType) {
      setValidationError("Please select a service type");
      return false;
    }
    if (formData.items.length === 0) {
      setValidationError("Booking must have at least one item");
      return false;
    }
    if (formData.items.some((i) => !i.itemType.trim())) {
      setValidationError("All items must have a type");
      return false;
    }
    if (formData.items.some((i) => i.quantity < 1)) {
      setValidationError("All items must have quantity ≥ 1");
      return false;
    }
    if (formData.items.some((i) => i.unitPrice <= 0)) {
      setValidationError("All items must have a unit price > 0");
      return false;
    }
    if (!formData.pickupDate) {
      setValidationError("Please select pickup date");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickup = new Date(formData.pickupDate);
    pickup.setHours(0, 0, 0, 0);
    if (pickup < today) {
      setValidationError("Pickup date cannot be in the past");
      return false;
    }

    if (formData.deliveryDate) {
      const delivery = new Date(formData.deliveryDate);
      delivery.setHours(0, 0, 0, 0);
      if (delivery < pickup) {
        setValidationError("Delivery date must be after pickup date");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const branchIdValue = formData.branchId || getBranchId(normalizedCustomer);
    const payload = {
      customerId: formData.customerId || getCustomerId(normalizedCustomer),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      branchId: branchIdValue,
      serviceType: formData.serviceType,
      items: formData.items,
      pickupDate: formData.pickupDate,
      deliveryDate: formData.deliveryDate || undefined,
      priority: formData.priority,
      discount: Math.max(0, Number(formData.discount) || 0),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim() || undefined,
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      }
      toast.success("Booking confirmed! We'll contact you shortly.");
      setFormData({
        customerId: getCustomerId(normalizedCustomer),
        customerName: getCustomerName(normalizedCustomer),
        customerPhone: getCustomerPhone(normalizedCustomer),
        branchId: getBranchId(normalizedCustomer),
        serviceType: "",
        items: [
          {
            itemType: "",
            quantity: 1,
            unitPrice: 0,
            specialInstructions: "",
          },
        ],
        pickupDate: "",
        deliveryDate: "",
        priority: "NORMAL",
        discountCode: "",
        discount: 0,
        paymentMethod: "CASH",
        notes: "",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to complete booking";
      setValidationError(message);
      toast.error(message);
    }
  };

  const controlStyles =
    "h-10 bg-white border-gray-300 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091D5]";
  const readOnlyStyles =
    "h-10 bg-slate-100 border-slate-300 text-slate-700 w-full";

  return (
  <div className="min-h-screen bg-white flex flex-col items-center py-16 px-4 font-sans text-slate-900">
    {/* Header Section */}
    <header className="text-center mb-12 max-w-xl">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0091D5] mb-4">
        Book Your Laundry Pick-Up
      </h1>
      <p className="text-slate-500 text-lg">
        Fill in your details below, and we'll arrange a pick-up at your convenience. Your information will be sent to our team for processing.
      </p>
    </header>

    {/* Form Container */}
    <main className="w-full max-w-4xl bg-white rounded-3xl p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {validationError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex gap-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{validationError}</p>
          </div>
        )}

        {/* Section 1: Customer Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">1</span>
            </div>
            <h2 className="font-bold text-lg">Customer Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="customerName" className="text-sm font-medium">Full Name</Label>
              <Input
                id="customerName"
                placeholder="John Doe"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="h-11 rounded-xl border-slate-200 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerPhone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="+234..."
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branchId" className="text-sm font-medium">Pickup Branch</Label>
                {getBranchId(normalizedCustomer) ? (
                  <div>
                    <Input
                      id="branchId"
                      readOnly
                      value={
                        branches.find((branch) =>
                          (branch._id || branch.id) === getBranchId(normalizedCustomer),
                        )?.name || getBranchId(normalizedCustomer)
                      }
                      className="h-11 rounded-xl border-slate-200 bg-slate-100"
                    />
                    <input type="hidden" name="branchId" value={getBranchId(normalizedCustomer)} />
                  </div>
                ) : (
                  <Select value={formData.branchId} onValueChange={(v) => handleInputChange("branchId", v)}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(branches) ? branches : []).map((branch) => (
                        <SelectItem key={branch._id || branch.id} value={branch._id || branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Services */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">2</span>
            </div>
            <h2 className="font-bold text-lg">Service Details</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Service Type</Label>
              <Select value={formData.serviceType} onValueChange={(v) => handleInputChange("serviceType", v)}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((serviceType) => (
                    <SelectItem key={serviceType.value} value={serviceType.value}>{serviceType.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Items List</span>
                <Button type="button" variant="ghost" size="sm" onClick={addItem} className="text-blue-600 hover:bg-blue-50 font-semibold">
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>

              {formData.items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500 font-bold">Item</Label>
                      <Select value={item.itemType} onValueChange={(v) => updateItem(idx, "itemType", v)}>
                        <SelectTrigger className="bg-white h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEM_TYPE_SUGGESTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500 font-bold">Qty</Label>
                      <Input type="number" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} className="bg-white h-10" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-slate-500 font-bold">Unit Price</Label>
                      <Input type="number" value={item.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", e.target.value)} className="bg-white h-10" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input 
                      placeholder="Special instructions (e.g. No starch)" 
                      value={item.specialInstructions} 
                      onChange={(e) => updateItem(idx, "specialInstructions", e.target.value)}
                      className="bg-white text-sm"
                    />
                    {formData.items.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Timeline & Payment */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">3</span>
            </div>
            <h2 className="font-bold text-lg">Timeline & Payment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Pickup Date</Label>
              <Input type="date" value={formData.pickupDate} onChange={(e) => handleInputChange("pickupDate", e.target.value)} className="h-11 rounded-xl border-slate-200" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Delivery Date (optional)</Label>
              <Input type="date" value={formData.deliveryDate} onChange={(e) => handleInputChange("deliveryDate", e.target.value)} className="h-11 rounded-xl border-slate-200" />
            </div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => handleInputChange("priority", v)}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(v) => handleInputChange("paymentMethod", v)}>
              <SelectTrigger className="h-11 rounded-xl border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          </div>
        </section>

        {/* Summary Card */}
        <div className="bg-[#1a1c1e] rounded-3xl p-8 text-white shadow-2xl">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>₦{totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Tax (7.5%)</span>
              <span>₦{totals.tax.toLocaleString()}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 text-sm font-medium">
                <span>Discount Applied</span>
                <span>-₦{totals.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-3xl font-black text-blue-400">₦{totals.total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-lg font-bold transition-all active:scale-[0.98] cursor-pointer"
          >
            {isPending ? <Loader2 className="animate-spin mr-2" /> : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </main>

    {/* Footer Indicators */}
    <footer className="mt-16 flex justify-center gap-8 md:gap-16 border-t border-slate-100 pt-8 w-full max-w-xl">
      <div className="text-center">
        <p className="font-bold text-blue-600">24/7</p>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Support</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-blue-600">100%</p>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Guaranteed</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-blue-600">Secure</p>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Payments</p>
      </div>
    </footer>
  </div>
);
}
