import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "@/hooks/useToast";

// API Imports
import { ordersApi, getOrders } from "@/api/orders";
import { inventoryApi } from "@/api/inventory";
import { invoicesApi, getInvoiceByOrderId } from "@/api/invoices";
import { customersApi, getCustomers } from "@/api/customers";
import { employeesApi, getEmployees } from "@/api/employees";
import { useApp } from "@/context/AppContext";
import { usePagination } from "@/hooks/usePagination";

// Constants
import { STATUS_GROUPS } from "@/components/orders/OrderConstants";

export function useOrdersManager() {
  const { user } = useApp();
  const queryClient = useQueryClient();
  const branchId = user?.branchId ?? null;

  // --- UI STATE ---
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // --- QUERIES ---
  const queryConfig = {
    staleTime: 1000 * 60 * 5,
    enabled: !!branchId,
  };

  const { data: rawOrders, isPending: ordersLoading } = useQuery({
    queryKey: ordersApi.keys.lists({ page: 1, limit: 100, branchId }),
    queryFn: () => getOrders(1, 100, null, branchId),
    ...queryConfig,
  });

  const { data: customersData } = useQuery({
    queryKey: customersApi.keys.lists({ page: 1, limit: 100 }),
    queryFn: () => getCustomers(1, 100),
  });

  const { data: employeesData } = useQuery({
    queryKey: employeesApi.keys.lists({ page: 1, limit: 100 }),
    queryFn: () => getEmployees(1, 100),
  });

  // --- DATA NORMALIZATION ---
  const orders = useMemo(() => {
    if (!rawOrders) return [];
    if (rawOrders.data?.orders) return rawOrders.data.orders;
    if (Array.isArray(rawOrders)) return rawOrders;
    return rawOrders.orders || [];
  }, [rawOrders]);

  // --- MUTATIONS ---

  // Create Order
  const createOrderMutation = useMutation({
    mutationFn: (newOrder) => ordersApi.create(newOrder),
    onSuccess: async (createdOrder) => {
      queryClient.invalidateQueries({ queryKey: ordersApi.keys.all });
      
      // Invalidate Inventory
      if (createdOrder.branchId) {
        queryClient.invalidateQueries({ queryKey: inventoryApi.keys.lists(createdOrder.branchId) });
      }

      // Handle Invoices (Fetching the new invoice immediately)
      if (createdOrder._id || createdOrder.id) {
        const id = createdOrder._id || createdOrder.id;
        await queryClient.fetchQuery({
          queryKey: invoicesApi.keys.byOrder(id),
          queryFn: () => getInvoiceByOrderId(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: invoicesApi.keys.lists() });

      toast.success("Order created successfully!");
      handleCloseForm();
    },
    onError: (err) => toast.error(err.response?.data?.errors?.[0] || err.message),
  });

  // Update Status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => ordersApi.updateStatus(id, status),
    onMutate: ({ id }) => setUpdatingStatusId(id),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ordersApi.keys.all });
      
      // Refresh inventory for the branch of the specific order
      const order = orders.find(o => (o._id || o.id) === vars.id);
      const targetBranch = order?.branchId || branchId;
      if (targetBranch) {
        queryClient.invalidateQueries({ queryKey: inventoryApi.keys.lists(targetBranch) });
      }

      toast.success("Status updated");
    },
    onSettled: () => setUpdatingStatusId(null),
  });

  // Delete Order
  const deleteOrderMutation = useMutation({
    mutationFn: (id) => ordersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersApi.keys.all });
      toast.success("Order deleted");
    },
    onError: (err) => toast.error(err.response?.data?.errors?.[0] || err.message),
  });

  // Record Payment
  const payOrderMutation = useMutation({
    mutationFn: ({ id, payload }) => ordersApi.markAsPaid(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersApi.keys.all });
      toast.success("Payment recorded!");
      setShowPaymentDialog(false);
    },
  });

  // --- HANDLERS ---
  const handleCloseForm = () => {
    setShowForm(false);
    setEditOrder(null);
  };

  const handleDelete = (id) => {
    deleteOrderMutation.mutate(id);
  };

  // --- FILTERING & SORTING ---
  const filteredAndSortedOrders = useMemo(() => {
    const term = search.toLowerCase().trim();
    const allowed = statusFilter !== "ALL" ? STATUS_GROUPS[statusFilter] : null;

    return orders
      .filter((order) => {
        const matchesStatus = allowed ? allowed.includes(order.status?.toUpperCase()) : true;
        const matchesSearch = !term || 
          (order.customerName?.toLowerCase().includes(term) || 
           order.orderNumber?.toLowerCase().includes(term) || 
           (order._id || order.id).toString().includes(term));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
          case "priority": {
            const pMap = { URGENT: 3, HIGH: 2, NORMAL: 1, LOW: 0 };
            return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
          }
          case "customer": return (a.customerName || "").localeCompare(b.customerName || "");
          default: return 0;
        }
      });
  }, [orders, search, statusFilter, sortBy]);

  // Pagination
  const {
    paginatedItems: paginatedOrders,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination(filteredAndSortedOrders, 12);

  // Reset pagination when filters change
  const handleSearchChange = (value) => {
    setSearch(value);
    resetPagination();
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    resetPagination();
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    resetPagination();
  };

  const statusCounts = useMemo(() => {
    const counts = { ALL: orders.length, PENDING: 0, PROCESSING: 0, DELIVERED: 0 };
    orders.forEach((order) => {
      const s = order.status?.toUpperCase();
      if (STATUS_GROUPS.PENDING.includes(s)) counts.PENDING++;
      if (STATUS_GROUPS.PROCESSING.includes(s)) counts.PROCESSING++;
      if (STATUS_GROUPS.DELIVERED.includes(s)) counts.DELIVERED++;
    });
    return counts;
  }, [orders]);

  return {
    state: {
      search,
      statusFilter,
      sortBy,
      ordersLoading,
      showForm,
      editOrder,
      updatingStatusId,
      showPaymentDialog,
      paymentOrder,
      isActionPending: createOrderMutation.isPending || payOrderMutation.isPending,
      // Pagination
      currentPage,
      totalPages,
      totalItems,
    },
    actions: {
      setSearch: handleSearchChange,
      setStatusFilter: handleStatusFilterChange,
      setSortBy: handleSortChange,
      setShowForm,
      setEditOrder,
      setShowPaymentDialog,
      setPaymentOrder,
      handleCloseForm,
      handleDelete,
      goToPage,
      handleSave: (formData) => editOrder 
        ? ordersApi.update(editOrder._id || editOrder.id, formData).then(() => queryClient.invalidateQueries({ queryKey: ordersApi.keys.all }))
        : createOrderMutation.mutate(formData),
    },
    mutations: {
      updateStatus: updateStatusMutation.mutate,
      submitPayment: (id, payload) => payOrderMutation.mutate({ id, payload }),
    },
    data: {
      filteredOrders: paginatedOrders,
      allFilteredOrders: filteredAndSortedOrders, // For status counts
      statusCounts,
      customers: customersData?.data?.customers || [],
      employees: employeesData?.data?.employees || [],
    },
    user
  };
}