import http from "./http";

const AUTH_BASE = (import.meta.env.VITE_AUTH_SERVICE_URL || "").replace(/\/+$/, "");

const url = (path) => `${AUTH_BASE}/api/auth${path}`;

export const login = async (data) => {
  const res = await http.post(url("/login"), data);
  return res.data;
};

export const register = async (data) => {
  const res = await http.post(url("/register"), data);
  return res.data;
};

export const getProfile = async () => {
  const res = await http.get(url("/profile"));
  return res.data;
};

export const logout = async () => {
  const res = await http.post(url("/logout"));
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await http.post(url("/update"), data);
  return res.data;
};
