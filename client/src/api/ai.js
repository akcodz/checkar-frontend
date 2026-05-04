import http from "./http";

const INCIDENT_BASE = import.meta.env.VITE_INCIDENT_SERVICE_URL || "";

export const postPostmortem = async (payload) => {
  const base = INCIDENT_BASE.replace(/\/+$/, "") || "";
  const path = base ? `${base}/api/ai/postmortem` : `/api/ai/postmortem`;
  const res = await http.post(path, payload);
  return res.data;
};
