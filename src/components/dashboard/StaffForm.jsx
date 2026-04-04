import React from "react";
import {
  UserCheck,
  Pencil,
  Briefcase,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const StaffForm = ({
  onSave,
  onOpenChange,
  initialData = null,
  branches = [],
  salaryStructures = [],
}) => {
  const isEditing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Backend-Specific Formatting
    if (data.joinDate) {
      data.joinDate = new Date(data.joinDate).toISOString();
    }

    // Pass structured data back to the mutation handler
    onSave(data);
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-indigo-600 text-xl">
          {isEditing ? (
            <Pencil className="h-5 w-5" />
          ) : (
            <UserCheck className="h-5 w-5" />
          )}
          {isEditing ? "Update Staff Profile" : "Employee Onboarding"}
        </DialogTitle>
        <DialogDescription>
          This will create both a User account and a professional Employee
          profile in one transaction.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-2 max-h-[65vh] overflow-y-auto px-1 scrollbar-hide">
        {/* SECTION: USER ACCOUNT DATA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider border-b border-b-slate-400 pb-1">
            <ShieldCheck className="h-4 w-4" /> Account Credentials
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                name="fullname"
                id="fullname"
                defaultValue={initialData?.fullname}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                defaultValue={initialData?.email}
                placeholder="john@laundry.com"
                required
              />
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          )}
        </div>

        {/* SECTION: EMPLOYEE DATA (Required by onboardEmployee Controller) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-wider border-b border-b-slate-400 pb-1">
            <Briefcase className="h-4 w-4" /> Professional Profile
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">System Access Level</Label>
              <Select name="role" defaultValue={initialData?.role || "STAFF"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Staff (Standard)</SelectItem>
                  <SelectItem value="BRANCH_MANAGER">Branch Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Functional Role</Label>
              <Select
                name="employeeJobRole"
                defaultValue={initialData?.employeeJobRole || "WASHER"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WASHER">Washer</SelectItem>
                  <SelectItem value="IRONER">Ironer</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="DRIVER">Driver</SelectItem>
                  <SelectItem value="CLEANER">Cleaner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation (Title)</Label>
              <Input
                name="designation"
                id="designation"
                defaultValue={initialData?.designation}
                placeholder="Senior Specialist"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                name="department"
                defaultValue={initialData?.department || "OPERATIONS"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERATIONS">Operations</SelectItem>
                  <SelectItem value="LOGISTICS">Logistics</SelectItem>
                  <SelectItem value="ADMIN">Administration</SelectItem>
                  <SelectItem value="FINANCE">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1" htmlFor="branchId">
                <MapPin className="h-3 w-3" /> Assigned Branch
              </Label>
              <Select
                name="branchId"
                defaultValue={initialData?.branchId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch..." />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem
                      key={branch._id || branch.id}
                      value={branch._id || branch.id}
                    >
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salary Structure</Label>
              <Select
                name="salaryStructureId"
                defaultValue={initialData?.salaryStructureId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No structure assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No structure assigned</SelectItem>
                  {salaryStructures.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name} (₦{s.baseSalary})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinDate">Official Join Date</Label>
            <Input
              name="joinDate"
              id="joinDate"
              type="date"
              defaultValue={
                initialData?.joinDate?.split("T")[0] ||
                new Date().toISOString().split("T")[0]
              }
              required
            />
          </div>
        </div>
      </div>

      <DialogFooter className="pt-6 gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="flex-1 md:flex-none"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          {isEditing ? "Save Staff Profile" : "Confirm Onboarding"}
        </Button>
      </DialogFooter>
    </form>
  );
};
