// composables/useApi.js - Configurar axios para sempre enviar header da loja
import axios from "axios";
import { useLojaStore } from "@/stores/loja";

// Configuração base do axios
const api = axios.create({
  baseURL: "http://localhost:3000", // Ajuste conforme sua URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar header de loja automaticamente
api.interceptors.request.use(
  (config) => {
    const lojaStore = useLojaStore();

    if (lojaStore.codigoLojaAtual) {
      config.headers["x-loja"] = lojaStore.codigoLojaAtual;
    }

    console.log(
      `🌐 ${config.method?.toUpperCase()} ${config.url} - Loja: ${
        config.headers["x-loja"] || "não especificada"
      }`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de loja
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const lojaStore = useLojaStore();

    // Se erro relacionado à loja, limpar seleção
    if (
      error.response?.status === 400 &&
      (error.response?.data?.erro === "LOJA_NAO_SELECIONADA" ||
        error.response?.data?.erro === "LOJA_INVALIDA")
    ) {
      console.warn("⚠️ Erro de loja detectado, limpando seleção");
      lojaStore.limparLoja();
    }

    return Promise.reject(error);
  }
);

export function useApi() {
  return {
    api,

    // Métodos auxiliares
    get: (url, config) => api.get(url, config),
    post: (url, data, config) => api.post(url, data, config),
    put: (url, data, config) => api.put(url, data, config),
    delete: (url, config) => api.delete(url, config),

    // Upload de arquivo com loja
    uploadFile: (formData, config = {}) => {
      return api.post("/upload", formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
          ...config.headers,
        },
      });
    },

    // Verificar se loja está válida
    testLoja: () => api.get("/test"),
  };
}

// Exportar instância padrão também
export default api;
