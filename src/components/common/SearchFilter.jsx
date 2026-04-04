import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Search } from "lucide-react";

export default function SearchFilter({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterPlaceholder = "All",
  searchPlaceholder = "Search..."
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-10 bg-white border-slate-200"
        />
      </div>
      {filterOptions && (
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full sm:w-48 bg-white">
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{filterPlaceholder}</SelectItem>
            {filterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}