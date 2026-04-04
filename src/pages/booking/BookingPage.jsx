import Header from "@/components/layout/Header.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Footer from "@/components/layout/Footer.jsx";
import BookingHero from "@/components/landing/BookingHero.jsx";
import BookingForm from "@/components/landing/BookingForm.jsx";
import { useApp } from "@/context/AppContext";
import { getCurrentUserProfile } from "@/api/customers";
import { branchesApi, getAllBranches } from "@/api/branches";
import { createOrder, ordersApi } from "@/api/orders";

export default function Booking() {
  const { user } = useApp();

  const { data: customerData } = useQuery({
    queryKey: ["customerProfile"],
    queryFn: getCurrentUserProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const { data: branchesResponse } = useQuery({
    queryKey: branchesApi.list.queryKey(1, 100, true),
    queryFn: () => getAllBranches(1, 100, true),
    staleTime: 1000 * 60 * 10,
  });

  const branches = branchesResponse?.data?.branches || [];
  const customerPayload = customerData || user;
  const customer = customerPayload?.data?.customer || customerPayload?.data?.user || customerPayload?.data || customerPayload;
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersApi.keys.all });
    },
  });

  const handleSubmitOrder = async (payload) => {
    return createOrderMutation.mutateAsync(payload);
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <Header />
      <main>
        <BookingHero />
        <BookingForm
          key={customer?._id || customer?.id || customer?.customerId || "booking-form"}
          branches={branches}
          customer={customer}
          onSubmit={handleSubmitOrder}
          isPending={createOrderMutation.isLoading}
        />
      </main>
      <Footer />
    </div>
  );
}