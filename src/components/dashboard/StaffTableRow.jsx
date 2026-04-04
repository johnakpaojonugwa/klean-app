import React from "react";
import { MoreHorizontal, Pencil, Trash2, Wallet } from "lucide-react"; 
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownmenu"; 

/**
 * @param {Object} staff - The employee data object
 * @param {Function} onEdit - Opens the edit profile form
 * @param {Function} onDelete - Triggers the deletion logic
 * @param {Function} onAssignSalary - Opens the AssignSalaryModal (Newly Added)
 */
export const StaffTableRow = ({ staff, onEdit, onDelete, onAssignSalary }) => (
  <TableRow className="hover:bg-slate-100/50 transition-colors border-slate-200">
    <TableCell>
      <div className="flex flex-col">
        <span className="font-semibold">{staff.userId.fullname}</span>
        <span className="text-xs text-muted-foreground text-slate-500">{staff.employeeNumber}</span>
      </div>
    </TableCell>

    <TableCell className="hidden md:table-cell">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{staff.designation}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-tight text-slate-500">
          {staff.department}
        </span>
      </div>
    </TableCell>

    <TableCell>
      <Badge
        variant="secondary"
        className={
          staff.status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50"
            : "bg-slate-100 text-slate-600 hover:bg-slate-100"
        }
      >
        {staff.status || "active"}
      </Badge>
    </TableCell>

    <TableCell>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => onEdit(staff)} className="cursor-pointer hover:bg-amber-50 hover:text-slate-900">
            <Pencil className="mr-2 h-4 w-4 text-slate-500" /> 
            Edit Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onAssignSalary(staff)} className="cursor-pointer hover:bg-amber-50 hover:text-slate-900">
            <Wallet className="mr-2 h-4 w-4 text-slate-500" />
            Assign Salary
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => onDelete(staff._id || staff.id)}
            className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" /> 
            Delete Staff
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);