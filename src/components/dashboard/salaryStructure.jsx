import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Calculator,
  MoreHorizontal,
  Search,
  DollarSign,
} from "lucide-react";

// API Helpers
import { getSalaryStructures, createSalaryStructure, updateSalaryStructure } from "@/api/payroll";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownmenu";

/**
 * @param {string} branchId - Passed from the parent dashboard
 * @param {boolean} readOnly - To restrict access
 */
const SalaryStructureManager = ({ branchId = null, readOnly = false }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStructureId, setEditingStructureId] = useState(null);

  const initialFormState = {
    name: "",
    description: "",
    branchId: branchId || "",
    baseSalary: 0,
    houseRentAllowance: 50000,
    conveyanceAllowance: 20000,
    dearness: 0,
    performanceBonus: 50000,
    otherAllowance: 0,
    providentFund: 0,
    employeeInsurance: 5,
    incomeTax: 10,
    professionalTax: 0,
    otherDeduction: 0,
    annualLeaveBalance: 20000,
    sickLeaveBalance: 10000,
    casualLeaveBalance: 5000,
    paidLeaveDays: 30,
    workingDaysPerMonth: 26,
    workingHoursPerDay: 8,
    overtimeRateMultiplier: 1.5,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- Data Fetching ---
  const { data: structureData, isPending } = useQuery({
    queryKey: ["salaryStructures", branchId],
    queryFn: () => getSalaryStructures(branchId),
    enabled: !!branchId, // Only fetch if branchId exists
  });

  const structures = structureData?.data?.structures || [];

  // --- Mutation with Strict Sanitization ---
  const { mutate: handleSave } = useMutation({
    mutationFn: (data) => {
      // SANITIZATION: Ensure all numbers are numbers and branchId is included
      const sanitizedPayload = {
        name: data.name?.trim(),
        description: data.description?.trim() || "",
        branchId: branchId,
        baseSalary: Number(data.baseSalary || 0),
        houseRentAllowance: Number(data.houseRentAllowance || 0),
        conveyanceAllowance: Number(data.conveyanceAllowance || 0),
        dearness: Number(data.dearness || 0),
        performanceBonus: Number(data.performanceBonus || 0),
        otherAllowance: Number(data.otherAllowance || 0),
        providentFund: Number(data.providentFund || 0),
        employeeInsurance: Number(data.employeeInsurance || 0),
        incomeTax: Number(data.incomeTax || 0),
        professionalTax: Number(data.professionalTax || 0),
        otherDeduction: Number(data.otherDeduction || 0),
        annualLeaveBalance: Number(data.annualLeaveBalance || 20),
        sickLeaveBalance: Number(data.sickLeaveBalance || 10),
        casualLeaveBalance: Number(data.casualLeaveBalance || 5),
        paidLeaveDays: Number(data.paidLeaveDays || 30),
        workingDaysPerMonth: Number(data.workingDaysPerMonth || 26),
        workingHoursPerDay: Number(data.workingHoursPerDay || 8),
        overtimeRateMultiplier: Number(data.overtimeRateMultiplier || 1.5),
        isActive: Boolean(data.isActive !== false),
      };
      
      // Call create or update based on editingStructureId
      if (editingStructureId) {
        return updateSalaryStructure(editingStructureId, sanitizedPayload);
      } else {
        return createSalaryStructure(sanitizedPayload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["salaryStructures", branchId]);
      toast.success(editingStructureId ? "Salary structure successfully updated" : "Salary structure successfully created");
      handleDialogClose();
    },
    onError: (error) => {
      const errorDetail =
        error.response?.data?.message || "Check all required fields";
      console.error("400 Error Details:", error.response?.data);
      toast.error(`Failed to save: ${errorDetail}`);
    },
  });

  // --- Real-time Calc Logic ---
  const totals = useMemo(() => {
    const gross =
      Number(formData.baseSalary) +
      Number(formData.houseRentAllowance) +
      Number(formData.conveyanceAllowance) +
      Number(formData.dearness) +
      Number(formData.performanceBonus) +
      Number(formData.otherAllowance);

    const dedPct =
      Number(formData.providentFund) +
      Number(formData.employeeInsurance) +
      Number(formData.incomeTax) +
      Number(formData.professionalTax) +
      Number(formData.otherDeduction);

    const dedAmt = (gross * dedPct) / 100;
    return { gross, net: gross - dedAmt };
  }, [formData]);

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  // Handle Edit Template
  const handleEditTemplate = (structure) => {
    setFormData(structure);
    setEditingStructureId(structure._id);
    setIsDialogOpen(true);
  };

  // Reset form after dialog closes
  const handleDialogClose = () => {
    setFormData(initialFormState);
    setEditingStructureId(null);
    setIsDialogOpen(false);
  };

  // Memoized Filtered List based on Search Term
  const filteredStructures = useMemo(() => {
    return structures.filter((structure) =>
      structure.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, structures]);

  return (
    <div className="space-y-4">
      <Card className="shadow-lg border border-slate-200/60 bg-white/80 backdrop-blur-md">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-6 gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-indigo-500" /> Salary
              Templates
            </CardTitle>
            <CardDescription>
              Configure branch-specific compensation packages.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search templates..."
                className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {!readOnly && (
              <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingStructureId ? "Edit Salary Structure" : "Define New Structure"}</DialogTitle>
                    <DialogDescription>
                      {editingStructureId ? "Update the salary structure details." : "Provide the base salary and percentage-based deductions."}
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="earnings" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="earnings">Earnings</TabsTrigger>
                      <TabsTrigger value="deductions">
                        Deductions (%)
                      </TabsTrigger>
                      <TabsTrigger value="policy">Policy</TabsTrigger>
                    </TabsList>

                    <div className="py-6 space-y-6">
                      <div className="grid gap-2 px-1">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="e.g. Senior Ironer"
                        />
                      </div>

                      <TabsContent
                        value="earnings"
                        className="grid grid-cols-2 gap-4 mt-0"
                      >
                        {[
                          "baseSalary",
                          "houseRentAllowance",
                          "conveyanceAllowance",
                          "performanceBonus",
                        ].map((f) => (
                          <div key={f} className="space-y-2">
                            <Label className="capitalize text-xs font-semibold">
                              {f.replace(/([A-Z])/g, " $1")}
                            </Label>
                            <Input
                              type="number"
                              value={formData[f]}
                              onChange={(e) => updateField(f, e.target.value)}
                            />
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent
                        value="deductions"
                        className="grid grid-cols-2 gap-4 mt-0"
                      >
                        {[
                          "providentFund",
                          "incomeTax",
                          "employeeInsurance",
                          "otherDeduction",
                        ].map((f) => (
                          <div key={f} className="space-y-2">
                            <Label className="capitalize text-xs font-semibold">
                              {f.replace(/([A-Z])/g, " $1")} (%)
                            </Label>
                            <Input
                              type="number"
                              value={formData[f]}
                              onChange={(e) => updateField(f, e.target.value)}
                            />
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent
                        value="policy"
                        className="grid grid-cols-2 gap-4 mt-0"
                      >
                        <div className="space-y-2">
                          <Label>Working Days/Month</Label>
                          <Input
                            type="number"
                            value={formData.workingDaysPerMonth}
                            onChange={(e) =>
                              updateField("workingDaysPerMonth", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>OT Multiplier</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={formData.overtimeRateMultiplier}
                            onChange={(e) =>
                              updateField(
                                "overtimeRateMultiplier",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center shadow-inner">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        Estimated Monthly Net
                      </p>
                      <p className="text-2xl font-black text-indigo-600">
                        ₦{totals.net.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        Gross Total
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        ₦{totals.gross.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <DialogFooter className="mt-6">
                    <Button
                      variant="ghost"
                      onClick={handleDialogClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                      onClick={() => handleSave(formData)}
                      disabled={
                        isPending || !formData.name || !formData.baseSalary
                      }
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        editingStructureId ? "Update Template" : "Save Template"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-indigo-200 overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-indigo-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Base Salary
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Deductions
                  </TableHead>
                  <TableHead className="font-semibold text-indigo-700">
                    Net Salary
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-40">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                    </TableCell>
                  </TableRow>
                ) : filteredStructures.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-40 text-slate-400 text-muted-foreground"
                    >
                      {searchTerm
                        ? "No templates match your search."
                        : "No templates defined."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStructures.map((structure) => (
                    <TableRow
                      key={structure._id}
                      className="hover:bg-slate-100/50 transition-colors border-slate-200"
                    >
                      <TableCell className="font-semibold text-slate-900">
                        {structure.name}
                      </TableCell>
                      <TableCell>
                        ₦{structure.baseSalary.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-100"
                        >
                          {structure.providentFund +
                            structure.incomeTax +
                            structure.employeeInsurance}
                          % Total
                        </Badge>
                      </TableCell>
                      {/* Net Salary */}
                      <TableCell className="font-bold text-indigo-600">
                        ₦
                        {(structure.netSalary || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || "0.00"}
                      </TableCell>
                      <TableCell className="text-right">
                        {!readOnly && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditTemplate(structure)}>
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 cursor-pointer">
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryStructureManager;
