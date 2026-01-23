// Configuração base do axios
import axios from "axios";

// Use environment variable if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_TIMEOUT = 10000; // 10 segundos

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

export default api;
