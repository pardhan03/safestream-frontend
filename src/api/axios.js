import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

export default api;