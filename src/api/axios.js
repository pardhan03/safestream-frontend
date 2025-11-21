import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  console.log(BASE_URL, '=========')
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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