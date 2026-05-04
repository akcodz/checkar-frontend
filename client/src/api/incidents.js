import http from "./http";

const INCIDENT_BASE = (import.meta.env.VITE_INCIDENT_SERVICE_URL || "").replace(/\/+$/, "");

const url = (path) => `${INCIDENT_BASE}/api/incident${path}`;

export const getIncidents = async () => {
  const res = await http.get(url("/"));
  return res.data;
};

export const getIncidentById = async (id) => {
  const res = await http.get(url(`/${id}`));
  return res.data;
};
