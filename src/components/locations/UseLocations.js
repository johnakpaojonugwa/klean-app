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

  // 1. Fetch Branches
  const { data: branchesResponse, isPending: isBranchesPending } = useQuery({
    queryKey: branchesApi.list.queryKey(1, 100, true),
    queryFn: () => branchesApi.list(1, 100, true),
  });

  // 2. Fetch Employees
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: branchesApi.keys.lists() });

  const mutationOptions = {
    onSuccess: (res) => {
      invalidate();
      toast.success(res.data?.message || "Success!");
      setShowForm(false);
    },
    onError: (err) => {
      // For timeout errors, refetch data after a delay (branch may have been created)
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        toast.error("Connection timeout - checking for changes...");
        setTimeout(() => invalidate(), 2000);
      } else {
        toast.error(err.response?.data?.message || "Action failed");
      }
    },
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/branch", data, { timeout: 60000 });
      // Check if response indicates failure even with 200 status
      if (res.data && res.data.success === false) {
        const error = new Error(res.data.message || "Failed to create branch");
        error.response = { data: res.data };
        throw error;
      }
      return res;
    },
    ...mutationOptions,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/branch/${id}`, data, { timeout: 60000 });
      // Check if response indicates failure even with 200 status
      if (res.data && res.data.success === false) {
        const error = new Error(res.data.message || "Failed to update branch");
        error.response = { data: res.data };
        throw error;
      }
      return res;
    },
    ...mutationOptions,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/branch/${id}`, { timeout: 60000 }),
    onSuccess: () => {
      invalidate();
      toast.success("Branch removed");
    },
    onError: (err) => {
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        toast.error("Connection timeout - checking for changes...");
        setTimeout(() => invalidate(), 2000);
      } else {
        toast.error(err.response?.data?.message || "Failed to remove branch");
      }
    },
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
    if (errors[field] || errors[field.split(".")[1]]) {
      setErrors((prev) => ({ ...prev, [field]: "", [field.split(".")[1]]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Branch name is required";
    else if (formData.name.trim().length < 2) newErrors.name = "Branch name must be at least 2 characters";

    if (!formData.address.street.trim()) newErrors.address = "Street address is required";
    if (!formData.address.city.trim()) newErrors.city = "City is required";
    if (!formData.address.state.trim()) newErrors.state = "State is required";

    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";

    const phoneTrimmed = formData.contactNumber.trim();
    if (phoneTrimmed) {
      if (!/^\+?[\d\s\-()]{7,20}$/.test(phoneTrimmed)) newErrors.contactNumber = "Please enter a valid phone number";
      else if (phoneTrimmed.replace(/\D/g, "").length < 7) newErrors.contactNumber = "Phone number is too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      operatingHours: formData.operatingHours,
      servicesOffered: formData.servicesOffered
        ? formData.servicesOffered.split(",").map((s) => s.trim().toUpperCase().replace(/\s+/g, "_"))
        : [],
      address: formData.address,
      manager: formData.manager && formData.manager !== "" ? formData.manager : undefined,
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