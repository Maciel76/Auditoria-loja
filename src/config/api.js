// Configuração base do axios
import axios from "axios";

// API_URL usa a variável de ambiente VITE_API_URL
// Em produção: https://auditorias.site
// Em desenvolvimento: http://localhost:3000
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_TIMEOUT = 30000; // 30 segundos

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
