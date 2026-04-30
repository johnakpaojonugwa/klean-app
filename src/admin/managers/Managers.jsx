import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Package } from "lucide-react";
import toast from "@/hooks/useToast";
import { getBranchManagers, branchManagerApi } from "@/api/branchManager";

import { useApp } from "@/context/AppContext";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import SearchFilter from "@/components/common/SearchFilter";
import { Pagination } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";

import ManagerCard from "@/components/managers/ManagerCard";
import ManagerForm from "@/components/managers/ManagerForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Managers() {
  const { user } = useApp();
  const queryClient = useQueryClient();
  const branchId = user?.branchId ?? null;

  const [showForm, setShowForm] = useState(false);
  const [editManager, setEditManager] = useState(null);
  const { searchValue: search, setSearchValue: setSearch, debouncedSearchValue: debouncedSearch } = useDebouncedSearch("", 300);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // --- DATA FETCHING ---
  const { data: rawManagers, isPending: managersLoading } = useQuery({
    queryKey: branchManagerApi.keys.lists({
      page: 1,
      limit: 10,
      branchId,
      search: debouncedSearch,
    }),
    queryFn: () => getBranchManagers(1, 10, branchId, debouncedSearch),
  });

  const managers = useMemo(() => {
    const baseData = rawManagers?.data?.managers || [];

    return baseData.map((manager) => ({
      ...manager,
      fullname: manager.fullname || "Unknown User",
      email: manager.email || "No Email",
      designation: manager.designation || "Manager",
      status: manager.status?.toLowerCase() || "active",
      branchName: manager.branchId?.name || "Unassigned",
    }));
  }, [rawManagers]);

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: branchManagerApi.keys.lists({ branchId }),
    });

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: (data) => branchManagerApi.create(data),
    onSuccess: () => {
      invalidate();
      toast.success("Manager created successfully");
      setShowForm(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create manager");
      console.error("Create Manager Error:", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      branchManagerApi.update(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Manager updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update manager");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => branchManagerApi.delete(id),
    onSuccess: () => {
      invalidate();
      toast.success("Manager deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete manager");
    },
  });

  const handleSave = (formData) => {
    const status = (formData.status || "active").toUpperCase();
    const payload = { ...formData, status };

    const useFormData = payload.avatar instanceof File;
    let dataToSend = payload;

    if (useFormData) {
    dataToSend = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        dataToSend.append(key, value);
      }
    });
  }

    if (editManager) {
      updateMutation.mutate({
        id: editManager._id || editManager.id,
        data: dataToSend,
      });
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteManager = () => {
    if (confirmDelete) {
      deleteMutation.mutate(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const filteredManagers = useMemo(() => {
    if (!search) return managers;
    return managers.filter(
      (manager) =>
        manager.fullname.toLowerCase().includes(search.toLowerCase()) ||
        manager.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [managers, search]);

  // Pagination
  const {
    paginatedItems: paginatedManagers,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination(filteredManagers, 12);

  // Reset pagination when search changes
  const handleSearchChange = (value) => {
    setSearch(value);
    resetPagination();
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Branch Managers"
        actionLabel="Add Manager"
        onAction={() => {
          setEditManager(null);
          setShowForm(true);
        }}
        icon={Plus}
      />

      <div className="w-full md:w-72 lg:w-96 mb-6">
        <SearchFilter
          placeholder="Search managers..."
          value={search}
          onSearchChange={handleSearchChange}
        />
      </div>

      {managersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filteredManagers.length === 0 ? (
        <EmptyState icon={Package} title="No manager found" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {paginatedManagers.map((manager, i) => (
              <ManagerCard
                key={manager._id || manager.id}
                manager={manager}
                index={i}
                onEdit={(e) => {
                  setEditManager(e);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={12}
            onPageChange={goToPage}
            isLoading={managersLoading}
          />
        </>
      )}

      <ManagerForm
        key={editManager?._id || editManager?.id || "new"}
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSave}
        initialData={editManager}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this manager? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeleteManager}
      />
    </div>
  );
}
