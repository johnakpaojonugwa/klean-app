import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  employeesApi,
  getEmployees,
  createEmployee,
  updateEmployee,
  terminateEmployee,
} from "@/api/employees";
import { useApp } from "@/context/AppContext";

import { Skeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/common/PageHeader";
import SearchFilter from "@/components/common/SearchFilter";
import EmptyState from "@/components/common/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";

import EmployeeCard from "@/components/employees/EmployeeCard";
import EmployeeForm from "@/components/employees/EmployeeForm";

export default function Employees() {
  const { user } = useApp();
  const queryClient = useQueryClient();
  const branchId = user?.branchId ?? null;

  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [search, setSearch] = useState("");

  // --- DATA FETCHING ---
  const { data: rawEmployees, isPending: employeesLoading } = useQuery({
    queryKey: employeesApi.keys.lists({ page: 1, limit: 50, branchId }),
    queryFn: () => getEmployees(1, 50, branchId),
  });

  const employees = useMemo(() => {
    const baseData = Array.isArray(rawEmployees)
      ? rawEmployees
      : rawEmployees?.data?.employees || [];
    return baseData.map((employee) => ({
      ...employee,
      fullname: employee.userId?.fullname || "Unknown User",
      email: employee.userId?.email || "No Email",
      designation: employee.designation || "Staff",
      status: employee.status?.toLowerCase() || "active",
    }));
  }, [rawEmployees]);

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: employeesApi.keys.lists({ branchId }),
    });

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: (data) => createEmployee(data),
    onSuccess: () => {
      invalidate();
      toast.success("Added!");
      setShowForm(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateEmployee(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Updated!");
      setShowForm(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, data }) => terminateEmployee(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Terminated!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Termination failed"),
  });

  const handleSave = (formData) => {
    let payload = { ...formData };

    if (editEmployee) {
      // For updates, only send changed fields
      payload = {};
      const initial = editEmployee;
      
      if (formData.fullname !== initial.userId?.fullname) payload.fullname = formData.fullname;
      if (formData.email !== initial.userId?.email) payload.email = formData.email;
      if (formData.phoneNumber !== initial.userId?.phoneNumber) payload.phoneNumber = formData.phoneNumber;
      if (formData.password && formData.password !== initial.userId?.password) payload.password = formData.password;
      if (formData.designation !== initial.designation) payload.designation = formData.designation;
      if (formData.department !== initial.department) payload.department = formData.department;
      if (formData.branchId !== initial.branchId) payload.branchId = formData.branchId;
      if (formData.joinDate !== initial.joinDate) payload.joinDate = formData.joinDate;
      if (formData.employeeJobRole !== initial.employeeJobRole) payload.employeeJobRole = formData.employeeJobRole;
      if (formData.status !== initial.status) payload.status = formData.status;
      if (formData.avatar) payload.avatar = formData.avatar;

      // If no changes, don't send update
      if (Object.keys(payload).length === 0) {
        toast.info("No changes detected");
        setShowForm(false);
        return;
      }
    }

    const useFormData = payload.avatar instanceof File;
    let dataToSend = payload;

    if (useFormData) {
      const fd = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });
      dataToSend = fd;
    }

    if (editEmployee) {
      updateMutation.mutate({
        id: editEmployee._id || editEmployee.id,
        data: dataToSend,
      });
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const handleConfirmTerminate = (employeeId) => {
    deleteMutation.mutate({
      id: employeeId,
      data: {
        terminationDate: new Date().toISOString(),
        terminationReason: "Administrative Action",
        exitNotes: "Processed via dashboard",
      },
    });
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullname.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const {
    paginatedItems: paginatedEmployees,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    resetPagination
  } = usePagination(filteredEmployees, 12);

  // Reset pagination when search changes
  const handleSearchChange = (value) => {
    setSearch(value);
    resetPagination();
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} members`}
        actionLabel="Add Employee"
        onAction={() => {
          setEditEmployee(null);
          setShowForm(true);
        }}
        icon={Plus}
      />

      <div className="w-full md:w-72 lg:w-96 mb-6">
        <SearchFilter
          placeholder="Search..."
          value={search}
          onSearchChange={handleSearchChange}
        />
      </div>

      {employeesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState icon={UserCircle} title="No employees found" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {paginatedEmployees.map((employee, i) => (
              <EmployeeCard
                key={employee._id}
                employee={employee}
                index={i}
                onEdit={(e) => {
                  setEditEmployee(e);
                  setShowForm(true);
                }}
                onDelete={() => handleConfirmTerminate(employee._id)}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={12}
            onPageChange={goToPage}
            isLoading={employeesLoading}
          />
        </>
      )}

      <EmployeeForm
        key={editEmployee?._id || editEmployee?.id || "new"}
        open={showForm}
        onOpenChange={setShowForm}
        initialData={editEmployee}
        onSubmit={handleSave}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
