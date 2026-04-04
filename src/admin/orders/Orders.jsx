import React, { useState } from "react";
import { Package, Plus } from "lucide-react";

// Hook & Constants
import { useOrdersManager } from "@/components/orders/UseOrderManager";
import { STATUS_TABS, SORT_OPTIONS } from "@/components/orders/OrderConstants";

// UI Components
import PageHeader from "@/components/common/PageHeader";
import SearchFilter from "@/components/common/SearchFilter";
import EmptyState from "@/components/common/EmptyState";
import OrderCard from "@/components/orders/OrderCard";
import OrderForm from "@/components/orders/OrderForm";
import PaymentDialog from "@/components/orders/PaymentDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

export default function Orders() {
  const { state, actions, mutations, data, user } = useOrdersManager();
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  return (
    <div className="p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Orders Management"
        subtitle="Track laundry service cycles"
        actionLabel="New Order"
        onAction={() => actions.setShowForm(true)}
        icon={Plus}
      />

      {/* Filter & Search Bar */}
      <div className="my-6 flex flex-col md:flex-row md:items-start gap-4 justify-between">
        <Tabs
          value={state.statusFilter}
          onValueChange={actions.setStatusFilter}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-white border border-slate-200 h-11 p-1">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs font-bold uppercase px-6 cursor-pointer data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                {tab.label}
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full border bg-slate-100 text-slate-500">
                  {data.statusCounts[tab.value] || 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <SearchFilter
            placeholder="Search customer, order #..."
            value={state.search}
            onSearchChange={actions.setSearch}
          />

          <Select value={state.sortBy} onValueChange={actions.setSortBy}>
            <SelectTrigger className="bg-white border-slate-300 w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Grid Content */}
      {state.ordersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : data.filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="Try adjusting your filters or create a new order."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {data.filteredOrders.map((order) => {
            const orderId = order._id || order.id;
            return (
              <OrderCard
                key={orderId}
                order={order}
                isStatusUpdating={state.updatingStatusId === orderId}
                onEdit={() => {
                  actions.setEditOrder(order);
                  actions.setShowForm(true);
                }}
                onDelete={() => setDeleteOrderId(orderId)}
                onStatusChange={(newStatus) =>
                  mutations.updateStatus({ id: orderId, status: newStatus })
                }
                onMarkAsPaid={() => {
                  actions.setPaymentOrder(order);
                  actions.setShowPaymentDialog(true);
                }}
              />
            );
          })}
        </div>
      )}

      {/* Modals & Dialogs */}
      {state.paymentOrder && (
        <PaymentDialog
          open={state.showPaymentDialog}
          onOpenChange={actions.setShowPaymentDialog}
          order={state.paymentOrder}
          isPending={state.isActionPending}
          onSubmit={mutations.submitPayment}
        />
      )}

      {state.showForm && (
        <OrderForm
          open={state.showForm}
          user={user}
          onClose={actions.handleCloseForm}
          onSave={actions.handleSave}
          customers={data.customers}
          employees={data.employees}
          editOrder={state.editOrder}
          isPending={state.isActionPending}
        />
      )}

      <ConfirmDialog
        open={!!deleteOrderId}
        onOpenChange={(open) => {
          if (!open) setDeleteOrderId(null);
        }}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteOrderId) {
            actions.handleDelete(deleteOrderId);
          }
        }}
      />
    </div>
  );
}