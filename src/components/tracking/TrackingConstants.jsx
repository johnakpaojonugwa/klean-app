import { Clock, Zap, Shirt, Wind, Package, Truck } from "lucide-react";

export const STAGES = [
  {
    key: "PENDING",
    label: "Order Received",
    icon: Clock,
    description: "Your order has been received and is waiting to be processed.",
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: Zap,
    description: "Your items are being sorted and prepared.",
  },
  {
    key: "WASHING",
    label: "Washing",
    icon: Shirt,
    description: "Your items are currently being washed.",
  },
  {
    key: "DRYING",
    label: "Drying",
    icon: Wind,
    description: "Your items are being dried.",
  },
  {
    key: "IRONING",
    label: "Ironing & Finishing",
    icon: Zap,
    description: "Your items are being ironed and finished.",
  },
  {
    key: "READY",
    label: "Ready for Pickup",
    icon: Package,
    description: "Your order is ready! Come pick it up.",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: Truck,
    description: "Your order has been delivered. Thank you!",
  },
];

export const PRIORITY_COLORS = {
  normal: "bg-slate-100 text-slate-600",
  express: "bg-orange-100 text-orange-700",
  urgent: "bg-rose-100 text-rose-700",
};