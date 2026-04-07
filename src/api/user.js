import api from "./api.js";

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
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const updateUserProfile = async (id, data) => {
  const res = await api.put(`/users/${id}/profile`, data);
  return res.data;
};

export const changePassword = async (id, data) => {
  const res = await api.post(`/users/${id}/change-password`, data);
  return res.data;
};

export const uploadAvatar = async (id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await api.post(`/users/${id}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const userApi = {
  list: getUsers,
  detail: getUserById,
  profile: getCurrentUserProfile,
  update: updateUser,
  updateProfile: updateUserProfile,
  changePassword: changePassword,
  uploadAvatar: uploadAvatar,
};
