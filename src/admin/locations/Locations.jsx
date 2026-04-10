import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees } from "@/api/employees";
import api from "@/api/api";
import { branchesApi } from "@/api/branches";
import {
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Clock,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Skeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/common/PageHeader";
import SearchFilter from "@/components/common/SearchFilter";
import EmptyState from "@/components/common/EmptyState";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { employeesApi } from "@/api/employees"; 

const INITIAL_FORM_STATE = {
  name: "",
  address: "",
  contactNumber: "",
  email: "",
  manager: "",
  isActive: true,
  operatingHours: "",
  servicesOffered: "", 
};

export default function Locations() {
  const [showForm, setShowForm] = useState(false);
  const [editBranches, setEditBranches] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  // 1. Fetch Branches (Aligned with your JSON structure)
  const { data: branchesResponse, isPending: isBranchesPending } = useQuery({
    queryKey: branchesApi.list.queryKey(1, 100, true),
    queryFn: () => branchesApi.list(1, 100, true),
  });

  // 2. Fetch Employees for Manager Selection
  const { data: employeesResponse, isPending: isEmployeesPending } = useQuery({
    queryKey: employeesApi.keys.lists(1, 200),
    queryFn: () => getEmployees(1, 200),
  });

  // --- DATA EXTRACTION ---
  const branches = useMemo(
    () => branchesResponse?.data?.branches || [],
    [branchesResponse],
  );

  const employees = useMemo(() => {
    const data = employeesResponse?.data;
    return Array.isArray(data) ? data : data?.employees || [];
  }, [employeesResponse]);

  // Optimized Staff Counter Map (prevents .filter() inside .map())
  const staffCounts = useMemo(() => {
    return employees.reduce((acc, employee) => {
      const branchId = employee.branchId || employee.branch?._id;
      if (branchId) acc[branchId] = (acc[branchId] || 0) + 1;
      return acc;
    }, {});
  }, [employees]);

  // --- MUTATIONS ---
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: branchesApi.keys.lists() });

  const mutationOptions = {
    onSuccess: (res) => {
      invalidate();
      toast.success(res.data?.message || "Success!");
      setShowForm(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Action failed"),
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
  });

  // --- HANDLERS ---
  const handleEdit = (branch) => {
  setEditBranches(branch);
  setFormData({
    name: branch.name || "",
    address: branch.address?.street 
      ? `${branch.address.street}, ${branch.address.city}, ${branch.address.state}`
      : branch.address || "",
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

  const validateForm = () => {
    const newErrors = {};

    // Branch Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Branch name must be at least 2 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Number validation (optional but if provided, validate)
    const phoneTrimmed = formData.contactNumber.trim();
    if (phoneTrimmed) {
      if (!/^\+?[\d\s\-()]{7,20}$/.test(phoneTrimmed)) {
        newErrors.contactNumber = 'Please enter a valid phone number';
      } else if ((phoneTrimmed.replace(/\D/g, '').length) < 7) {
        newErrors.contactNumber = 'Phone number is too short';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const parts = (formData.address || "").split(",").map((p) => p.trim());
  
  const payload = {
    name: formData.name,
    email: formData.email,
    contactNumber: formData.contactNumber,
    operatingHours: formData.operatingHours,
    servicesOffered: formData.servicesOffered
      ? formData.servicesOffered
          .split(",")
          .map(s => s.trim().toUpperCase().replace(/\s+/g, '_')) 
      : [],
    
    address: {
      street: parts[0] || "",
      city: parts[1] || "",
      state: parts[2] || "",
      zip: parts[3] || "000000" 
    },

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

  const filteredLocations = branches.filter((branch) =>
    [branch.name, branch.address, branch.branchCode].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div className="p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Branch Locations"
        actionLabel="Add Branch"
        onAction={() => setShowForm(true)}
      />

      <SearchFilter searchValue={search} onSearchChange={setSearch} />

      {isBranchesPending ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredLocations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No branches found"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {filteredLocations.map((branch) => (
            <motion.div
              key={branch._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden group"
            >
              {/* Top Section: Branding & Status */}
              <div className="p-5 pb-0 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {branch.branchCode || "LOC-100"}
                    </span>
                    <Badge
                      className={
                        branch.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50"
                          : "bg-slate-50 text-slate-600 border-slate-100"
                      }
                      variant="outline"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${branch.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                      />
                      {branch.isActive ? "Online" : "Closed"}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl tracking-tight leading-none pt-1">
                    {branch.name}
                  </h3>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleEdit(branch)}>
                      <Edit className="w-4 h-4 mr-2 text-slate-400" /> Edit
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteMutation.mutate(branch._id)}
                      className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Branch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Main Info */}
              <div className="p-5 space-y-4">
                <div className="space-y-2.5 text-sm text-slate-600">
                  <div className="flex gap-3 items-start group/info">
                    <div className="p-2 rounded-lg bg-slate-50 text-indigo-600 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="leading-snug pt-0.5">
                      {typeof branch.address === "object"
                        ? `${branch.address.street}, ${branch.address.city}`
                        : branch.address}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center group/info">
                    <div className="p-2 rounded-lg bg-slate-50 text-indigo-600 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{branch.contactNumber}</span>
                  </div>

                  <div className="flex gap-3 items-center group/info">
                    <div className="p-2 rounded-lg bg-slate-50 text-indigo-600 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-colors">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>{branch.operatingHours}</span>
                  </div>
                </div>

                {/* Footer: Manager & Staffing */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Manager
                    </span>
                    <span className="text-sm font-semibold text-indigo-950">
                      {branch.manager?.fullname || "Unassigned"}
                    </span>
                  </div>

                  <div className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                    <Users className="w-3.5 h-3.5 text-indigo-600 mr-2" />
                    <span className="text-xs font-bold text-indigo-700">
                      {staffCounts[branch._id] || 0} Staff
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* FORM DIALOG */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editBranches ? "Edit" : "Register New"} Branch
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Branch Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label>Full Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  className={errors.address ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.contactNumber}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      });
                      if (errors.contactNumber) setErrors(prev => ({ ...prev, contactNumber: '' }));
                    }}
                    className={errors.contactNumber ? 'border-red-500 focus:border-red-500' : ''}
                  />
                  {errors.contactNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>
                  )}
                </div>
                <div>
                  <Label>Operating Hours</Label>
                  <Input
                    placeholder="e.g. 9AM - 6PM"
                    value={formData.operatingHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operatingHours: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Manager</Label>
                <Select
                  value={formData.manager}
                  onValueChange={(v) =>
                    setFormData({ ...formData, manager: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isEmployeesPending
                          ? "Loading staff..."
                          : "Select Manager"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.employeeJobRole}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Services (Comma separated)</Label>
                <Input
                  placeholder="Sales, Support, Repair"
                  value={formData.servicesOffered}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesOffered: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : "Save Branch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
