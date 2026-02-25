// Configuração base do axios
import axios from "axios";

// API_BASE_URL usa a variável de ambiente VITE_API_URL
// Em produção: https://auditorias.site/api
// Em desenvolvimento: /api
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const API_TIMEOUT = 30000; // 30 segundos

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

export default api;
