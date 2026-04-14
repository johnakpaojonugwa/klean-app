import api from "./api.js";
import { notificationKeys } from "./keys.js";

// ===== Notifications =====
export const getNotifications = async (page = 1, limit = 20) => {
  const res = await api.get("/notifications", {
    params: { page, limit },
  });
  return res.data;
};
getNotifications.queryKey = (page = 1, limit = 20) =>
  notificationKeys.lists({ page, limit });

export const markNotificationAsRead = async (notificationId) => {
  const res = await api.put(`/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.put("/notifications/mark-all-read");
  return res.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await api.delete(`/notifications/${notificationId}`);
  return res.data;
};

export const notificationsApi = {
  keys: notificationKeys,
  list: getNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  delete: deleteNotification,
};
