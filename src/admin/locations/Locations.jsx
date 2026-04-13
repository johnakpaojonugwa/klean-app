import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/common/PageHeader";
import SearchFilter from "@/components/common/SearchFilter";
import EmptyState from "@/components/common/EmptyState";
import { UseLocations } from "@/components/locations/UseLocations";
import { BranchCard, BranchFormDialog } from "@/components/locations/BranchComponents";

export default function Locations() {
  const {
    branches, isBranchesPending, employees, isEmployeesPending,
    staffCounts, search, setSearch, showForm, setShowForm,
    formData, errors, editBranches, handleEdit,
    handleInputChange, handleSave, deleteMutation, isSubmitting
  } = UseLocations();

  const filteredLocations = branches.filter((branch) =>
    [branch.name, branch.address, branch.branchCode].some((field) =>
      typeof field === 'string' 
        ? field.toLowerCase().includes(search.toLowerCase())
        : JSON.stringify(field).toLowerCase().includes(search.toLowerCase())
    )
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
            <BranchCard
              key={branch._id}
              branch={branch}
              staffCount={staffCounts[branch._id]}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <BranchFormDialog
        showForm={showForm}
        setShowForm={setShowForm}
        editBranches={editBranches}
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        isEmployeesPending={isEmployeesPending}
        employees={employees}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}