import React, { useState, useMemo } from "react";
import { Plus, Loader2, Search, Briefcase, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; 
import { getBranches } from "@/api/branches";
import { getSalaryStructures } from "@/api/payroll";

// Shadcn UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Project Components
import { StaffTableRow } from "@/components/dashboard/StaffTableRow";
import { StaffForm } from "@/components/dashboard/StaffForm";
import AssignSalaryModal from "@/components/dashboard/AssignSalaryModal"; // New Component

/**
 * @param {Object} employees - The raw API response containing employee data
 * @param {boolean} loading - Loading state from parent
 * @param {Function} onAddStaff - Create handler
 * @param {Function} onEditStaff - Update handler
 * @param {Function} onDeleteStaff - Delete handler
 */
export default function StaffTable({ 
  employees, 
  loading, 
  onAddStaff, 
  onEditStaff, 
  onDeleteStaff,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assigningStaff, setAssigningStaff] = useState(null); // State for Salary Modal
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Branches for the form
  const { data: branchData } = useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
    staleTime: 10 * 60 * 1000, 
  });

  // 2. Fetch Salary Structures for the form and the assignment modal
  const { data: salaryData } = useQuery({
    queryKey: ["salaryStructures"],
    queryFn: getSalaryStructures,
    staleTime: 10 * 60 * 1000,
  });

  const staffList = employees?.data?.employees || [];
  const branches = branchData?.data?.branches || [];
  const salaryStructures = salaryData?.data?.structures || [];
  
  // 3. Optimized Search Logic
  const filteredStaff = useMemo(() => {
    const s = searchQuery.toLowerCase();
    return staffList.filter(item => 
      item.fullname?.toLowerCase().includes(s) || 
      item.email?.toLowerCase().includes(s) ||
      item.designation?.toLowerCase().includes(s)
    );
  }, [searchQuery, staffList]);

  return (
    <Card className="shadow-lg border border-slate-200/60 bg-white/80 backdrop-blur-md">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-6 gap-4">
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-2 text-slate-900">
            <Briefcase className="h-6 w-6 text-indigo-500" /> Team Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Manage your workforce and departmental roles.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <Input 
              placeholder="Search by name, email, or role..." 
              className="pl-9 h-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 transition-all" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                type="button"
                onClick={() => { setSelectedStaff(null); setIsDialogOpen(true); }} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all active:scale-95"
              >
                <Plus className="h-4 w-4 mr-2" /> Onboard Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <StaffForm 
                initialData={selectedStaff} 
                onSave={selectedStaff ? (data) => onEditStaff(selectedStaff._id || selectedStaff.id, data) : onAddStaff} 
                onOpenChange={setIsDialogOpen} 
                branches={branches}
                salaryStructures={salaryStructures}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-indigo-200 overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-indigo-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700">Employee</TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-slate-700">Role / Dept</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                      <p className="text-sm text-slate-500">Loading directory...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <Search className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="font-medium text-slate-900">No team members found</p>
                      <p className="text-xs text-slate-400">Try adjusting your search terms</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map(staff => (
                  <StaffTableRow 
                    key={staff._id || staff.id} 
                    staff={staff} 
                    onEdit={(s) => { setSelectedStaff(s); setIsDialogOpen(true); }} 
                    onDelete={onDeleteStaff} 
                    onAssignSalary={(s) => setAssigningStaff(s)} 
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Salary Assignment Modal Logic */}
      {assigningStaff && (
        <AssignSalaryModal
          isOpen={!!assigningStaff}
          onClose={() => setAssigningStaff(null)}
          employee={assigningStaff}
          salaryStructures={salaryStructures}
        />
      )}
    </Card>
  );
}