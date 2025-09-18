export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000";
export const API_TIMEOUT = 10000; // 10 segundos

// Configuração base do axios
import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

export default api;
