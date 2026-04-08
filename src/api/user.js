import api from "./api.js";

const isFormData = (data) => data instanceof FormData;

export const getUsers = async (page = 1, limit = 10, query = null) => {
  const params = { page, limit };
  if (query) params.query = query;

  const res = await api.get("/users", { params });
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const getCurrentUserProfile = async () => {
  const res = await api.get("/users/me");
  return res.data?.data?.user || res.data?.data || res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const updateUserProfile = async (data) => {
  const config = { timeout: 60000 };

  // Let the browser set multipart boundaries automatically for FormData.
  // Manually setting Content-Type can cause malformed multipart requests.
  const res = await api.put(`/users/me`, data, config);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.patch(`/auth/change-password`, data);
  return res.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return updateUserProfile(formData);
};

export const userApi = {
  list: getUsers,
  detail: getUserById,
  profile: getCurrentUserProfile,
  update: updateUser,
  updateProfile: updateUserProfile,
  changePassword: changePassword,
};
