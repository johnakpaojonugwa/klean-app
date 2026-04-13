import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/common/PageHeader";
import SearchFilter from "@/components/common/SearchFilter";
import EmptyState from "@/components/common/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useLocations } from "@/components/locations/UseLocations";
import { BranchCard, BranchFormDialog } from "@/components/locations/BranchComponents";

export default function Locations() {
  const {
    branches, isBranchesPending, employees, isEmployeesPending,
    staffCounts, search, setSearch, showForm, setShowForm,
    formData, errors, editBranches, handleEdit,
    handleInputChange, handleSave, deleteMutation, isSubmitting,
    currentPage, totalPages, totalItems, goToPage, resetPagination
  } = useLocations();

  const handleSearchChange = (value) => {
    setSearch(value);
    resetPagination();
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Branch Locations"
        actionLabel="Add Branch"
        onAction={() => setShowForm(true)}
      />

      <SearchFilter searchValue={search} onSearchChange={handleSearchChange} />

      {isBranchesPending ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No branches found"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {branches.map((branch) => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={9}
        onPageChange={goToPage}
        isLoading={isBranchesPending}
      />

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