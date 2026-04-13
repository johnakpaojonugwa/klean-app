import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { branchesApi } from "@/api/branches";
import { employeesApi, getEmployees } from "@/api/employees";
import { toast } from "sonner";

const INITIAL_FORM_STATE = {
  name: "",
  address: { street: "", city: "", state: "", zip: "" },
  contactNumber: "",
  email: "",
  manager: "",
  isActive: true,
  operatingHours: "",
  servicesOffered: "",
};

export const useLocations = () => {
  const [showForm, setShowForm] = useState(false);
  const [editBranches, setEditBranches] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const { data: branchesResponse, isPending: isBranchesPending } = useQuery({
    queryKey: branchesApi.list.queryKey(1, 100, true),
    queryFn: () => branchesApi.list(1, 100, true),
  });

  const { data: employeesResponse, isPending: isEmployeesPending } = useQuery({
    queryKey: employeesApi.keys.lists(1, 200),
    queryFn: () => getEmployees(1, 200),
  });

  const branches = useMemo(() => branchesResponse?.data?.branches || [], [branchesResponse]);
  const employees = useMemo(() => {
    const data = employeesResponse?.data;
    return Array.isArray(data) ? data : data?.employees || [];
  }, [employeesResponse]);

  const staffCounts = useMemo(() => {
    return employees.reduce((acc, employee) => {
      const branchId = employee.branchId || employee.branch?._id;
      if (branchId) acc[branchId] = (acc[branchId] || 0) + 1;
      return acc;
    }, {});
  }, [employees]);

  // Aggressive invalidation to ensure UI updates
  const invalidateAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['branches'] });
    await queryClient.invalidateQueries({ queryKey: branchesApi.keys.lists() });
    await queryClient.refetchQueries({ queryKey: branchesApi.list.queryKey(1, 100, true) });
  };

  const mutationOptions = {
    onSettled: () => {
      // Runs whether the request succeeded OR failed
      invalidateAll();
    },
    onSuccess: (res) => {
      // If the backend returns success: false inside a 200 OK
      if (res.data?.success === false) {
        toast.error(res.data?.message || "Something went wrong, but checking for updates...");
      } else {
        toast.success(res.data?.message || "Operation successful");
        setShowForm(false);
      }
    },
    onError: (err) => {
      // This is what you're currently hitting
      const serverMessage = err.response?.data?.message;
      
      // Since you know the branch is actually created, we treat this as a "Soft Success"
      if (serverMessage === "An error occurred. Please try again later.") {
        toast.info("Updating list...");
        setShowForm(false);
        invalidateAll();
      } else {
        toast.error(serverMessage || "Connection error");
      }
    },
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/branch", data);
      return response;
    },
    ...mutationOptions,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/branch/${id}`, data);
      return response;
    },
    ...mutationOptions,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/branch/${id}`),
    onSettled: () => invalidateAll(),
    onSuccess: () => toast.success("Branch removed"),
  });

  const handleEdit = (branch) => {
    setEditBranches(branch);
    setFormData({
      name: branch.name || "",
      address: {
        street: branch.address?.street || "",
        city: branch.address?.city || "",
        state: branch.address?.state || "",
        zip: branch.address?.zip || "",
      },
      contactNumber: branch.contactNumber || "",
      email: branch.email || "",
      manager: branch.manager?._id || branch.manager || "",
      isActive: branch.isActive ?? true,
      operatingHours: branch.operatingHours || "",
      servicesOffered: Array.isArray(branch.servicesOffered)
        ? branch.servicesOffered.join(", ")
        : branch.servicesOffered || "",
    });
    setShowForm(true);
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      servicesOffered: formData.servicesOffered
        ? formData.servicesOffered.split(",").map((s) => s.trim().toUpperCase().replace(/\s+/g, "_"))
        : [],
      manager: formData.manager || undefined,
    };

    if (editBranches) {
      updateMutation.mutate({ id: editBranches._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    if (!showForm) {
      setFormData(INITIAL_FORM_STATE);
      setEditBranches(null);
      setErrors({});
    }
  }, [showForm]);

  return {
    branches,
    isBranchesPending,
    employees,
    isEmployeesPending,
    staffCounts,
    search,
    setSearch,
    showForm,
    setShowForm,
    formData,
    errors,
    editBranches,
    handleEdit,
    handleInputChange,
    handleSave,
    deleteMutation,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};