import http from "./http";

const JOB_SERVICE_BASE = import.meta.env.VITE_JOB_SERVICE_URL || "/api";

export const createJob = async (payload) => {
  const url = `${JOB_SERVICE_BASE.replace(/\/+$/, "")}/job`;
  const res = await http.post(url, payload);
  return res.data;
};

export const getJobs = async (params = {}) => {
  const url = `${JOB_SERVICE_BASE.replace(/\/+$/, "")}/job`;
  const res = await http.get(url, { params });
  return res.data;
};

export const getLogs = async (id) => {
  const url = `${JOB_SERVICE_BASE.replace(/\/+$/, "")}/job/${id}/logs`;
  const res = await http.get(url);
  return res.data;
};

export const getJobById = async (id) => {
  const url = `${JOB_SERVICE_BASE.replace(/\/+$/, "")}/job/${id}`;
  const res = await http.get(url);
  return res.data;
};

export const updateJob = async (id, payload) => {
  const url = `${JOB_SERVICE_BASE.replace(/\/+$/, "")}/job/${id}`;
  const res = await http.put(url, payload);
  return res.data;
};

export const deleteJob = async (id) => {
  const url = `${JOB_SERVICE_BASE.replace(/\/+$/, "")}/job/${id}`;
  const res = await http.delete(url);
  return res.data;
};
