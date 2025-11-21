import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadVideo = (formData) => {
  return api.post("/video/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
};

export const getMyVideos = () => {
  return api.get("/video/all", {
    headers: {
      ...getAuthHeader(),
    },
  });
};

export const changePassword = (newPassword) => {
  return api.put(
    "/user/change-password",
    { newPassword },
    {
      headers: {
        ...getAuthHeader(),
      },
    }
  );
};

export const deleteVideo = (videoId) => {
  return api.delete(`/video/${videoId}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
};

export default api;