import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportFilterBar({ states, onRangeChange, onStartChange, onEndChange, onApply }) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <FilterSelect label="Quick Range" value={states.dateRange} onChange={onRangeChange} />
          <div className="grid gap-2 w-full md:w-48">
            <Label className="text-xs uppercase font-bold text-muted-foreground">From</Label>
            <Input type="date" value={states.startDate} onChange={(e) => onStartChange(e.target.value)} className="bg-slate-50/50" />
          </div>
          <div className="grid gap-2 w-full md:w-48">
            <Label className="text-xs uppercase font-bold text-muted-foreground">To</Label>
            <Input type="date" value={states.endDate} onChange={(e) => onEndChange(e.target.value)} className="bg-slate-50/50" />
          </div>
          <Button className="w-full md:w-auto px-8 bg-indigo-600 hover:bg-indigo-700" onClick={onApply}>
            <Filter className="h-4 w-4 mr-2" /> Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({ label, value, onChange }) {
  return (
    <div className="grid gap-2 w-full md:w-48">
      <Label className="text-xs uppercase font-bold text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-50/50"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">Last 30 Days</SelectItem>
          <SelectItem value="quarter">Last Quarter</SelectItem>
          <SelectItem value="year">Last Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}