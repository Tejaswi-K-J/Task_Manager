import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Add token automatically to headers
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = JSON.parse(user).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
