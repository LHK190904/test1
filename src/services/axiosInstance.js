import axios from "axios";
import { getToken } from "./authService";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://net1814-swp391-jewelry-production-order-3s3q.onrender.com/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
