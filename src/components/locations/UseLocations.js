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

  // FIXED: Explicitly invalidate the exact list key and the general branches key
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: branchesApi.keys.lists() });
    queryClient.invalidateQueries({ queryKey: ['branches'] }); 
  };

  const mutationOptions = {
    onSuccess: (res) => {
      // Check if the backend sent a 200 but with a failure payload
      if (res.data?.success === false) {
        // Since you said it actually saves, we invalidate anyway to show the data
        invalidate();
        toast.error(res.data?.message || "Saved with warnings");
        setShowForm(false);
        return;
      }

      invalidate();
      toast.success(res.data?.message || "Success!");
      setShowForm(false);
    },
    onError: (err) => {
      // This catches actual HTTP errors (4xx, 5xx)
      const errorMsg = err.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMsg);
    },
  };

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/branch", data),
    ...mutationOptions,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/branch/${id}`, data),
    ...mutationOptions,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/branch/${id}`),
    onSuccess: () => {
      invalidate();
      toast.success("Branch removed");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
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
    if (!formData.address.street.trim()) newErrors.address = "Street address is required";
    if (!formData.address.city.trim()) newErrors.city = "City is required";
    if (!formData.address.state.trim()) newErrors.state = "State is required";

    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";

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