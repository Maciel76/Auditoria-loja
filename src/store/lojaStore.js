// store/lojaStore.js - Versão Completa e Funcional
import { defineStore } from "pinia";
import axios from "axios";
import api from "@/config/api.js";

export const useLojaStore = defineStore("loja", {
  state: () => ({
    lojaSelecionada: null,
    // Cache de produtos de auditoria por loja
    produtosCache: {}, // { lojaId: { data: produtos[], timestamp: Date, filtros: {} } }
    cacheTTL: 5 * 60 * 1000, // 5 minutos em milissegundos
    lojas: [
      {
        codigo: "056",
        nome: "Loja 056 - Goiania Burits",
        cidade: "Goiânia",
        imagem: "/images/lojas/056.jpg",
      },
      {
        codigo: "084",
        nome: "Loja 084 - Goiania Independência",
        cidade: "Goiânia",
        imagem: "/images/lojas/084.jpg",
      },
      {
        codigo: "105",
        nome: "Loja 105 - T9",
        cidade: "Goiânia",
        imagem: "/images/lojas/105.jpg",
      },
      {
        codigo: "111",
        nome: "Loja 111 - Rio Verde",
        cidade: "Rio Verde",
        imagem: "/images/lojas/111.jpg",
      },
      {
        codigo: "140",
        nome: "Loja 140 - Perimetral",
        cidade: "Goiânia",
        imagem: "/images/lojas/140.jpg",
      },
      {
        codigo: "214",
        nome: "Loja 214 - Caldas Novas",
        cidade: "Caldas Novas",
        imagem: "/images/lojas/214.jpg",
      },
      {
        codigo: "176",
        nome: "Loja 176 - Palmas Teotônio",
        cidade: "Palmas",
        imagem: "/images/lojas/176.jpg",
      },
      {
        codigo: "194",
        nome: "Loja 194 - Anápolis",
        cidade: "Anápolis",
        imagem: "/images/lojas/194.jpg",
      },
      {
        codigo: "310",
        nome: "Loja 310 - Portugal",
        cidade: "Goiânia",
        imagem: "/images/lojas/310.jpg",
      },
      {
        codigo: "320",
        nome: "Loja 320 - Palmas cesamar",
        cidade: "Palmas",
        imagem: "/images/lojas/320.jpg",
      },
      {
        codigo: "347",
        nome: "Loja 347 - Araguaina",
        cidade: "Araguaina",
        imagem: "/images/lojas/347.jpeg",
      },
      {
        codigo: "348",
        nome: "Loja 348 - Aparecida",
        cidade: "Aparecida",
        imagem: "/images/lojas/348.jpg",
      },
    ],
    loading: false,
    error: null,
  }),

  getters: {
    isLojaSelected: (state) => !!state.lojaSelecionada,

    nomeLojaAtual: (state) => {
      return state.lojaSelecionada
        ? state.lojaSelecionada.nome
        : "Nenhuma loja selecionada";
    },

    codigoLojaAtual: (state) => {
      return state.lojaSelecionada ? state.lojaSelecionada.codigo : null;
    },

    imagemLojaAtual: (state) => {
      if (state.lojaSelecionada?.imagem) {
        return state.lojaSelecionada.imagem;
      }
      if (state.lojaSelecionada?.codigo) {
        const codigo = state.lojaSelecionada.codigo.toString().padStart(3, "0");
        return `/images/lojas/${codigo}.jpg`;
      }
      return "/images/lojas/default.jpg";
    },
  },

  actions: {
    // Selecionar loja com validação no backend
    async selecionarLoja(loja) {
      this.loading = true;
      this.error = null;

      try {
        // Encontrar loja completa se só recebeu código
        let lojaCompleta;
        if (typeof loja === "string") {
          lojaCompleta = this.lojas.find((l) => l.codigo === loja);
          if (!lojaCompleta) {
            throw new Error(`Loja com código ${loja} não encontrada`);
          }
        } else {
          lojaCompleta = loja;
        }

        // Testar se a loja é válida no backend
        const response = await api.get("/api/test", {
          headers: {
            "x-loja": lojaCompleta.codigo,
          },
        });

        if (response.status === 200) {
          this.lojaSelecionada = lojaCompleta;

          // Salvar no localStorage
          localStorage.setItem("lojaSelecionada", JSON.stringify(lojaCompleta));

          // Configurar axios para sempre enviar o header
          this.configurarAxiosHeader(lojaCompleta.codigo);

          console.log(
            `✅ Loja selecionada: ${lojaCompleta.nome || "Nome Indisponível"}`
          );
          return true;
        }
      } catch (error) {
        this.error = error.response?.data?.mensagem || error.message;
        console.error("❌ Erro ao selecionar loja:", this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Carregar loja do localStorage com validação
    carregarLoja() {
      try {
        const lojaSalvaJSON = localStorage.getItem("lojaSelecionada");

        if (lojaSalvaJSON) {
          const lojaSalva = JSON.parse(lojaSalvaJSON);

          // Validar se a loja salva ainda existe na nossa lista de lojas
          const lojaValida = this.lojas.find(
            (l) => l.codigo === lojaSalva.codigo
          );

          if (lojaValida) {
            this.lojaSelecionada = lojaValida;
            this.configurarAxiosHeader(lojaValida.codigo);
            console.log(`🔄 Loja carregada: ${lojaValida.nome}`);
          } else {
            console.warn(
              `⚠️ Loja salva (${lojaSalva.codigo}) não é mais válida. Limpando seleção.`
            );
            this.limparLoja();
          }
        }
      } catch (error) {
        console.error(
          "❌ Erro ao carregar e validar loja do localStorage:",
          error
        );
        this.limparLoja(); // Limpa em caso de erro de parsing ou outro problema
      }
    },

    // Limpar seleção de loja
    limparLoja() {
      this.lojaSelecionada = null;
      localStorage.removeItem("lojaSelecionada");

      // Remover header do axios e da instância api
      if (api.defaults.headers.common) {
        delete api.defaults.headers.common["x-loja"];
      }
      if (axios.defaults.headers.common) {
        delete axios.defaults.headers.common["x-loja"];
      }

      console.log("🗑️ Seleção de loja limpa");
    },

    // Configurar header do axios
    configurarAxiosHeader(codigo) {
      // Configurar na instância api (usada nas requisições)
      if (!api.defaults.headers.common) {
        api.defaults.headers.common = {};
      }
      if (api.defaults.headers.common["x-loja"] !== codigo) {
        api.defaults.headers.common["x-loja"] = codigo;
        console.log(`🔧 x-loja=${codigo || "Código Indisponível"}`);
      }

      // Manter também no axios global para compatibilidade
      if (!axios.defaults.headers.common) {
        axios.defaults.headers.common = {};
      }
      axios.defaults.headers.common["x-loja"] = codigo;
    },

    // Verificar se loja ainda é válida
    async verificarLoja() {
      if (!this.lojaSelecionada) return false;

      try {
        const response = await api.get("/api/test");
        return response.status === 200;
      } catch (error) {
        console.error("❌ Loja atual inválida:", error);
        this.limparLoja();
        return false;
      }
    },

    // ============ CACHE DE PRODUTOS DE AUDITORIA ============

    // Obter produtos do cache ou buscar do servidor
    async obterProdutosAuditoria(lojaId, forcarRecarregar = false) {
      const cacheKey =
        lojaId || this.lojaSelecionada?._id || this.lojaSelecionada?.codigo;

      if (!cacheKey) {
        throw new Error("ID da loja não disponível");
      }

      // Verificar cache válido
      if (!forcarRecarregar && this.produtosCache[cacheKey]) {
        const cache = this.produtosCache[cacheKey];
        const agora = Date.now();
        const cacheValido = agora - cache.timestamp < this.cacheTTL;

        if (cacheValido) {
          console.log(
            `✅ Usando cache de produtos (${cache.data.length} itens)`
          );
          return cache.data;
        } else {
          console.log("⏰ Cache expirado, recarregando...");
        }
      }

      // Buscar do servidor
      console.log(`🔄 Carregando produtos do servidor para loja: ${cacheKey}`);

      try {
        const response = await api.get(
          `/api/audit-products/produtos-auditorias/${cacheKey}`
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Erro ao carregar produtos");
        }

        const produtos = response.data.produtos;

        // Armazenar no cache
        this.produtosCache[cacheKey] = {
          data: produtos,
          timestamp: Date.now(),
        };

        console.log(
          `✅ Cache atualizado (${produtos.etiqueta?.length || 0} etiquetas, ${
            produtos.presenca?.length || 0
          } presenças, ${produtos.ruptura?.length || 0} rupturas)`
        );

        return produtos;
      } catch (error) {
        console.error("❌ Erro ao carregar produtos:", error);
        throw error;
      }
    },

    // Limpar cache de uma loja específica ou de todas
    limparCacheProdutos(lojaId = null) {
      if (lojaId) {
        delete this.produtosCache[lojaId];
        console.log(`🗑️ Cache limpo para loja: ${lojaId}`);
      } else {
        this.produtosCache = {};
        console.log("🗑️ Cache completo de produtos limpo");
      }
    },

    // Verificar se tem cache válido
    temCacheValido(lojaId) {
      const cacheKey =
        lojaId || this.lojaSelecionada?._id || this.lojaSelecionada?.codigo;

      if (!cacheKey || !this.produtosCache[cacheKey]) {
        return false;
      }

      const cache = this.produtosCache[cacheKey];
      const agora = Date.now();
      return agora - cache.timestamp < this.cacheTTL;
    },

    // Obter informações do cache
    getInfoCache(lojaId) {
      const cacheKey =
        lojaId || this.lojaSelecionada?._id || this.lojaSelecionada?.codigo;

      if (!cacheKey || !this.produtosCache[cacheKey]) {
        return null;
      }

      const cache = this.produtosCache[cacheKey];
      const agora = Date.now();
      const idade = Math.floor((agora - cache.timestamp) / 1000); // em segundos
      const valido = agora - cache.timestamp < this.cacheTTL;

      return {
        timestamp: cache.timestamp,
        idade: `${idade}s`,
        valido,
        totalProdutos: Object.values(cache.data).reduce(
          (acc, arr) => acc + (arr?.length || 0),
          0
        ),
      };
    },

    // Atualizar o coverId da loja selecionada
    atualizarCoverDaLojaSelecionada(novoCoverId) {
      if (this.lojaSelecionada) {
        this.lojaSelecionada.coverId = novoCoverId;

        // Atualizar no localStorage também
        localStorage.setItem("lojaSelecionada", JSON.stringify(this.lojaSelecionada));

        console.log(`Cover atualizado para a loja ${this.lojaSelecionada.codigo}: ${novoCoverId}`);
      }
    },
  },
});
