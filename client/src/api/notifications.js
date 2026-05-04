import http from "./http";

const INCIDENT_BASE = (import.meta.env.VITE_INCIDENT_SERVICE_URL || "").replace(/\/+$/, "");

const url = (path) => `${INCIDENT_BASE}/api/notification${path}`;

export const getNotifications = async () => {
  const res = await http.get(url("/"));
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await http.post(url(`/${id}/read`));
  return res.data;
};
