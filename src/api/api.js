import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://klean-dev.onrender.com/api/v1",
  timeout: 45000, 
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Allow sending cookies (if you migrate to HttpOnly cookie auth)
api.defaults.withCredentials = true;

// Request Interceptor: Inject Token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("klean_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error("Request timed out. Server might be waking up.");
    }
    const originalRequest = error.config;

    // Attempt token refresh once on 401 responses
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('klean_refresh');
      if (refreshToken) {
        return axios
          .post((import.meta.env.VITE_API_BASE || api.defaults.baseURL) + '/auth/refresh-token', { refreshToken })
          .then((res) => {
            const { accessToken, refreshToken: newRefresh } = res.data.data || res.data || {};
            if (accessToken) {
              sessionStorage.setItem('klean_token', accessToken);
              if (newRefresh) sessionStorage.setItem('klean_refresh', newRefresh);
              api.defaults.headers.Authorization = `Bearer ${accessToken}`;
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return api(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch((refreshErr) => {
            sessionStorage.removeItem('klean_token');
            sessionStorage.removeItem('klean_refresh');
            return Promise.reject(refreshErr);
          });
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Convenience helpers for react-query usage
export const getCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data?.data || res.data;
};

/** API Helpers **/
export const loginApi = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const signupApi = async (userData) => {
  const res = await api.post('/auth/sign-up', userData);
  return res.data;
};

export const forgotPasswordApi = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};
export const resetPasswordApi = async (token, data) => {
  const res = await api.post(`/auth/reset-password/${token}`, data);
  return res.data;
};