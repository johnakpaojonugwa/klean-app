import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";

import { getCustomers } from "@/api/customers";
import api from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/common/PageHeader";
import SearchFilter from "@/components/common/SearchFilter";
import EmptyState from "@/components/common/EmptyState";

import CustomerCard from "@/components/customers/CustomerCard";
import CustomerFormDialog from "@/components/customers/CustomerFormDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Customers() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({ 
    fullname: "", 
    email: "", 
    phoneNumber: "", 
    address: "", 
    password: "",
    avatar: null,
  });

  // --- DATA FETCHING ---
  const { data: rawCustomers, isPending: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(1, 100),
  });

  const customers = useMemo(() => {
    const data = rawCustomers?.data?.customers || rawCustomers?.customers || rawCustomers;
    return Array.isArray(data) ? data : [];
  }, [rawCustomers]);

  // --- MUTATIONS ---
  const saveMutation = useMutation({
    mutationFn: (data) => {
      const baseData = { ...data, role: "CUSTOMER" };

      const hasFile = baseData.avatar instanceof File;
      if (hasFile) {
        const formDataPayload = new FormData();
        Object.entries(baseData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formDataPayload.append(key, value);
          }
        });

        return editCustomer
          ? api.put(
              `/users/${editCustomer._id || editCustomer.id}`,
              formDataPayload,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          : api.post("/users", formDataPayload, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
      }

      return editCustomer
        ? api.put(`/users/${editCustomer._id || editCustomer.id}`, baseData)
        : api.post("/users", baseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(editCustomer ? "Customer updated!" : "Customer created!");
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Operation failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Deletion failed"),
  });

  // --- HANDLERS ---
  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setFormData({
      fullname: customer.fullname || "",
      email: customer.email || "",
      phoneNumber: customer.phoneNumber || "",
      address: customer.address || "",
      password: "", 
      avatar: customer.avatar || null,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteCustomer = () => {
    if (confirmDelete) {
      deleteMutation.mutate(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase().trim();
    return customers.filter(customer => 
      customer.fullname?.toLowerCase().includes(term) || 
      customer.email?.toLowerCase().includes(term)
    );
  }, [customers, search]);

  return (
    <div className="p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Customers"
        onAction={() => {
          setEditCustomer(null);
          setFormData({ fullname: "", email: "", phoneNumber: "", address: "", password: "", avatar: null });
          setShowForm(true);
        }}
        icon={Plus}
        actionLabel="Add Customer"
      />

      <div className="my-6 w-full md:w-72 lg:w-96">
        <SearchFilter value={search} onSearchChange={setSearch} placeholder="Search..." />
      </div>

      {customersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <EmptyState icon={Users} title="No customers" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredCustomers.map((customer, index) => (
            <CustomerCard 
              key={customer._id || customer.id} 
              customer={customer} 
              index={index} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CustomerFormDialog 
        open={showForm} 
        onOpenChange={setShowForm}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!editCustomer}
        isPending={saveMutation.isPending}
        onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeleteCustomer}
      />
    </div>
  );
}