import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { PRIORITY_COLORS } from "@/components/tracking/TrackingConstants";

export default function OrderDetailsCard({ order }) {
  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500">Order Number</p>
          <p className="text-xl font-bold text-slate-800">#{order.orderNumber || order._id}</p>
        </div>
        <Badge className={`${PRIORITY_COLORS[order.priority?.toLowerCase()] || PRIORITY_COLORS.normal} border-0`}>
          {order.priority || "Normal"} priority
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <DetailItem label="Customer" value={order.customerName || order.customer?.name || "—"} />
        <DetailItem label="Service" value={order.serviceType?.replace("_", " ") || "—"} className="capitalize" />
        <DetailItem 
            label="Est. Delivery" 
            value={order.deliveryDate ? format(new Date(order.deliveryDate), "MMM d, yyyy") : "To be confirmed"} 
        />
        <DetailItem 
            label="Total" 
            value={typeof order.totalAmount === "number" ? currencyFormatter.format(order.totalAmount) : "—"} 
        />
      </div>
    </div>
  );
}

function DetailItem({ label, value, className = "" }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className={`font-medium text-slate-800 ${className}`}>{value}</p>
    </div>
  );
}