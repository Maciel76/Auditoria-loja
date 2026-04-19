import axios from "axios";

// Cliente axios padrão para toda a aplicação
// Usa a variável de ambiente VITE_API_URL ou fallback para /api (produção com nginx)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para logging em desenvolvimento
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error("❌ Erro na requisição:", error);
      return Promise.reject(error);
    }
  );
}

export default api;
