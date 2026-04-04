import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wallet, Loader2, Info } from "lucide-react";
import { updateEmployee } from "@/api/employees";

// Shadcn UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";

/**
 * @param {boolean} isOpen - Dialog state
 * @param {function} onClose - Function to close dialog
 * @param {Object} employee - The employee object being edited
 * @param {Array} salaryStructures - List of templates fetched in the parent
 */
const AssignSalaryModal = ({ isOpen, onClose, employee, salaryStructures = [] }) => {
  const queryClient = useQueryClient();
  
  // Local state for the selected template ID
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  // Sync local state when employee changes or modal opens
  useEffect(() => {
    if (employee?.salaryStructureId) {
      setSelectedTemplateId(employee.salaryStructureId);
    } else {
      setSelectedTemplateId("");
    }
  }, [employee, isOpen]);

  // Find the details of the currently selected template for the preview box
  const selectedTemplate = salaryStructures.find((s) => s._id === selectedTemplateId);

  // Mutation to update the employee record
  const { mutate: handleAssign, isPending } = useMutation({
    mutationFn: (templateId) =>
      updateEmployee(employee._id || employee.id, {
        salaryStructureId: templateId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast.success(`Salary structure assigned to ${employee.fullname}`);
      onClose();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || "Failed to update assignment";
      toast.error(msg);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wallet className="h-5 w-5 text-indigo-500" />
            Assign Salary Template
          </DialogTitle>
          <DialogDescription>
            Select a predefined compensation structure for{" "}
            <span className="font-semibold text-slate-900">{employee?.fullname}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="template" className="text-sm font-medium">
              Choose Template
            </Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger id="template" className="w-full bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select a salary structure" />
              </SelectTrigger>
              <SelectContent>
                {salaryStructures.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No templates found. Create one in Salary Settings first.
                  </div>
                ) : (
                  salaryStructures.map((structure) => (
                    <SelectItem key={structure._id} value={structure._id}>
                      {structure.name} — ₦{structure.baseSalary.toLocaleString()}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Preview Card */}
          {selectedTemplate ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Template Preview
                </p>
                <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-200">
                  {selectedTemplate.workingDaysPerMonth} Days/Mo
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Base Salary</p>
                  <p className="text-lg font-bold text-slate-900">
                    ₦{selectedTemplate.baseSalary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Allowances</p>
                  <p className="text-lg font-bold text-slate-900">
                    ₦{(
                      selectedTemplate.houseRentAllowance +
                      selectedTemplate.conveyanceAllowance +
                      selectedTemplate.performanceBonus
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-100 flex items-center gap-2">
                <Info className="h-3 w-3 text-indigo-400" />
                <p className="text-xs text-indigo-600/80 italic">
                  Deductions will be calculated automatically during payroll.
                </p>
              </div>
            </div>
          ) : (
            <Alert className="bg-slate-50 border-slate-200">
              <AlertDescription className="text-slate-500 text-xs text-center py-2">
                Please select a template to see the breakdown.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
            onClick={() => handleAssign(selectedTemplateId)}
            disabled={isPending || !selectedTemplateId}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Assignment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignSalaryModal;