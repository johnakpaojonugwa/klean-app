import api from "./api.js";

// ===== Bookings =====
export const createBooking = async (payload) => {
  const res = await api.post("/bookings", payload);
  return res.data;
};

export const getBookings = async (
  page = 1,
  limit = 10,
  status = null,
  userId = null,
  query = null
) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (userId) params.userId = userId;
  if (query) params.query = query;

  const res = await api.get("/bookings", { params });
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};

export const updateBooking = async (id, updates) => {
  const res = await api.put(`/bookings/${id}`, updates);
  return res.data;
};

export const updateBookingStatus = async (id, status) => {
  const res = await api.patch(`/bookings/${id}/status`, { status });
  return res.data;
};

export const cancelBooking = async (id, reason = "") => {
  const res = await api.patch(`/bookings/${id}/cancel`, { reason });
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data;
};

export const getAvailableSlots = async (date, duration) => {
  const res = await api.get("/bookings/available-slots", {
    params: { date, duration },
  });
  return res.data;
};

export const bookingsApi = {
  create: createBooking,
  list: getBookings,
  detail: getBookingById,
  update: updateBooking,
  updateStatus: updateBookingStatus,
  cancel: cancelBooking,
  remove: deleteBooking,
  getAvailableSlots,
};
