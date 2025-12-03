import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically add Authorization header to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const uploadVideo = (formData) => {
  return api.post("/video/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyVideos = () => {
  return api.get("/video/all");
};

export const changePassword = (newPassword) => {
  return api.put("/user/change-password", { newPassword });
};

export const deleteVideo = (videoId) => {
  return api.delete(`/video/${videoId}`);
};

export default api;