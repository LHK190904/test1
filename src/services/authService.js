import axios from "axios";
import axiosInstance from "./axiosInstance";
import { message } from "antd";

const API_URL = "auth/login_token";

const login = async (username, password) => {
  try {
    const payload = { userName: username, password };
    const response = await axiosInstance.post(API_URL, payload);
    const { token, authenticated, title, id } = response.data.result;
    if (authenticated) {
      const userData = { username, token, title, id };
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    }
  } catch (error) {
    message.error("Tài khoản hoặc mật khẩu không hợp lệ");
  }
};

const logout = () => {
  localStorage.removeItem("user");
  window.location.reload();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = { login, logout, getCurrentUser };

const isAuthenticated = () => {
  const user = getCurrentUser();
  return user && user.token;
};

export const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};

export const setToken = (token) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user.token = token;
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export default authService;
