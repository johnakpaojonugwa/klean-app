import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal, Edit, Trash2, Package, AlertCircle, TrendingDown, History } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/DropdownMenu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { Progress } from "@/components/ui/Progress"; 

const categoryStyles = {
  detergent: "bg-blue-50 text-blue-600 border-blue-100",
  softener: "bg-violet-50 text-violet-600 border-violet-100",
  stain_removal: "bg-rose-50 text-rose-600 border-rose-100",
  packaging: "bg-amber-50 text-amber-600 border-amber-100",
  hangers: "bg-emerald-50 text-emerald-600 border-emerald-100",
  equipments: "bg-slate-50 text-slate-600 border-slate-100",
  chemicals: "bg-orange-50 text-orange-600 border-orange-100",
  other: "bg-slate-50 text-slate-500 border-slate-100"
};

export function InventoryTable({ data, onEdit, onAdjust, onDelete }) {
  return (
    <TooltipProvider>
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-indigo-50">
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              <TableHead className="w-[300px] text-xs uppercase tracking-wider font-bold text-slate-500">Item Description</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-slate-500">Category</TableHead>
              <TableHead className="w-[200px] text-xs uppercase tracking-wider font-bold text-slate-500">Inventory Status</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-slate-500">Supplier</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-slate-500">Last Restock</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-slate-500">Unit Cost</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-bold text-slate-500">Health</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const current = item.currentStock || 0;
              const min = item.minimumStock || 1;
              const isLowStock = current <= min;
              
              // Visual Progress: 100% means stock is 2x the minimum level (healthy)
              const stockPercentage = Math.min((current / (min * 2)) * 100, 100);

              return (
                <TableRow key={item.id} className="group hover:bg-indigo-50/50 transition-all border-b border-slate-50">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isLowStock ? 'bg-rose-50' : 'bg-slate-100'} group-hover:bg-white transition-colors`}>
                        <Package className={`w-4 h-4 ${isLowStock ? 'text-rose-500' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 leading-tight">{item.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono tracking-tighter uppercase">{item.sku}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className={`${categoryStyles[item.category] || categoryStyles.other} border px-2 py-0 text-[11px] font-bold capitalize shadow-sm`}>
                      {item.category?.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-600">
                          {current} <span className="text-[10px] text-slate-400 font-normal uppercase">{item.unit}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 italic">Min: {min}</span>
                      </div>
                      <Progress 
                        value={stockPercentage} 
                        className={`h-1.5 w-full bg-slate-100 [&>div]:transition-all ${
                          isLowStock ? "[&>div]:bg-rose-500" : "[&>div]:bg-teal-500"
                        }`}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-slate-700">
                    {item.supplierContact || "—"}
                  </TableCell>

                  <TableCell className="text-sm text-slate-700">
                    {(
                      item.lastRestock ||
                      item.lastRestocked ||
                      item.last_restock ||
                      item.last_restocked ||
                      ""
                    ) ? (
                      new Date(
                        item.lastRestock ||
                        item.lastRestocked ||
                        item.last_restock ||
                        item.last_restocked
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell className="font-semibold text-slate-600">
                    <span className="text-[10px] mr-0.5 text-slate-400 font-normal">₦</span>
                    {item.unitCost?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>

                  <TableCell>
                    {isLowStock ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-1 rounded-full w-fit">
                            <AlertCircle className="w-3.5 h-3.5" />
                            REPLENISH
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Stock is at or below critical level</TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-1 rounded-full w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        HEALTHY
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="mira" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onAdjust(item)} className="cursor-pointer font-medium">
                          <TrendingDown className="w-4 h-4 mr-2 text-blue-500" /> 
                          Quick Adjust
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer font-medium">
                          <Edit className="w-4 h-4 mr-2 text-slate-500" /> 
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-medium text-slate-500">
                          <History className="w-4 h-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(item.id)} 
                          className="cursor-pointer font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> 
                          Archive Item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}