import axios from "axios";

const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);

const http = axios.create({
  withCredentials: true,
  timeout: DEFAULT_TIMEOUT,
});

// Optionally set baseURL per request wrapper or use full URLs in helpers
export default http;
