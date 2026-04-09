import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function LogisticsCard({ analytics }) {
  const totals = analytics?.totals || {};
  const sum = (totals.pendingOrders || 0) + (totals.processingOrders || 0) + (totals.readyOrders || 0) + (totals.deliveredOrders || 0);

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Order Logistics</CardTitle>
        <CardDescription>Breakdown of current order lifecycle phases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgressBar label="Pending" value={totals.pendingOrders} total={sum} color="bg-orange-400" />
        <ProgressBar label="Processing" value={[totals.processingOrders, totals.washingOrders, totals.dryingOrders, totals.ironingOrders]} total={sum} color="bg-blue-400" />
        <ProgressBar label="Ready" value={totals.readyOrders} total={sum} color="bg-emerald-400" />
        <ProgressBar label="Delivered" value={totals.deliveredOrders} total={sum} color="bg-indigo-500" />
      </CardContent>
    </Card>
  );
}

export function ServicePerformanceCard({ revenue }) {
  const hasData = revenue?.revenueByService?.length > 0;

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Service Performance</CardTitle>
        <CardDescription>Revenue distribution across service categories</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
            <p>No revenue data for this period</p>
          </div>
        ) : (
          <div className="space-y-6">
            {revenue.revenueByService.map((item, idx) => (
              <ProgressBar
                key={idx}
                label={item.service || item.category}
                value={item.amount}
                total={revenue.totalRevenue}
                displayValue={`₦${Number(item.amount).toLocaleString()}`}
                suffix={`${((item.amount / revenue.totalRevenue) * 100).toFixed(1)}% of total`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, value = 0, total, displayValue, color = "bg-primary", suffix }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold">{displayValue ?? value}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={`h-full ${color}`} />
      </div>
      {suffix && <p className="text-[10px] text-muted-foreground text-right">{suffix}</p>}
    </div>
  );
}