import { Search, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import SearchFilter from "@/components/common/SearchFilter";
import EmptyState from "@/components/common/EmptyState";

import { useTracking } from "@/components/tracking//UseTracking";
import OrderDetailsCard from "@/components/tracking/OrderDetailsCard";
import OrderTimeline from "@/components/tracking/OrderTimeline";

export default function Tracking() {
  const { query, setQuery, searchTerm, order, isFetching, notFound, handleSearch } = useTracking();

  return (
    <div className="p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Track Your Order"
          subtitle="Enter your order number or phone number to follow your laundry progress."
        />

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 my-6 w-full max-w-lg">
          <div className="relative flex-1">
            <SearchFilter
              searchValue={query}
              onSearchChange={setQuery}
              searchPlaceholder="Order # or phone number"
              className="pl-10 bg-slate-50/50 border-slate-200"
            />
          </div>
          <Button type="submit" className="bg-indigo-600" disabled={isFetching || !query.trim()}>
            {isFetching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching</> : "Track Order"}
          </Button>
        </form>

        {isFetching ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : !searchTerm ? (
          <EmptyState icon={Search} title="Track your order" description="Enter an order number or phone number." />
        ) : notFound ? (
          <EmptyState icon={AlertCircle} title="Order not found" description="We couldn’t locate an order with that input." />
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <OrderDetailsCard order={order} />
            <OrderTimeline status={order.status} />

            {/* Items List */}
            {Array.isArray(order.items) && order.items.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Items ({order.items.length})</h3>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-2 border-b last:border-0 border-slate-50">
                      <span className="text-slate-700">{item.itemType} × {item.quantity}</span>
                      {item.specialInstructions && <span className="text-xs text-slate-400 italic">{item.specialInstructions}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}