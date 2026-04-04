import { useMutation, useQuery } from "@tanstack/react-query";
import { createBooking, getBookings, getBookingById, updateBookingStatus, cancelBooking } from "@/api/bookings.js";

export const useBookingManager = () => {
  // Create Booking Mutation
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      // Optionally invalidate queries here if using React Query
      return data;
    },
  });

  // Get Bookings Query
  const getBookingsQuery = (page = 1, limit = 10, status = null) =>
    useQuery({
      queryKey: ["bookings", { page, limit, status }],
      queryFn: () => getBookings(page, limit, status),
      staleTime: 5 * 60 * 1000,
    });

  // Get Booking by ID Query
  const getBookingByIdQuery = (id) =>
    useQuery({
      queryKey: ["booking", id],
      queryFn: () => getBookingById(id),
      staleTime: 5 * 60 * 1000,
      enabled: !!id,
    });

  // Update Booking Status Mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
  });

  // Cancel Booking Mutation
  const cancelBookingMutation = useMutation({
    mutationFn: ({ id, reason }) => cancelBooking(id, reason),
  });

  return {
    // Mutations
    createBooking: createBookingMutation.mutate,
    updateBookingStatus: updateBookingStatusMutation.mutate,
    cancelBooking: cancelBookingMutation.mutate,
    
    // Queries
    getBookings: getBookingsQuery,
    getBookingById: getBookingByIdQuery,

    // States
    isCreating: createBookingMutation.isPending,
    isUpdatingStatus: updateBookingStatusMutation.isPending,
    isCanceling: cancelBookingMutation.isPending,
    error: 
      createBookingMutation.error ||
      updateBookingStatusMutation.error ||
      cancelBookingMutation.error,
  };
};
