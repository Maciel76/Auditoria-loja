// store/lojaStore.js - Versão Completa e Funcional
import { defineStore } from "pinia";
import axios from "axios";

export const useLojaStore = defineStore("loja", {
  state: () => ({
    lojaSelecionada: null,
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
        const response = await axios.get("http://localhost:3000/test", {
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

          console.log(`✅ Loja selecionada: ${lojaCompleta.nome}`);
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

    // Carregar loja do localStorage
    carregarLoja() {
      try {
        const lojaSalva = localStorage.getItem("lojaSelecionada");

        if (lojaSalva) {
          const loja = JSON.parse(lojaSalva);
          this.lojaSelecionada = loja;
          this.configurarAxiosHeader(loja.codigo);
          console.log(`🔄 Loja carregada: ${loja.nome}`);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar loja:", error);
        localStorage.removeItem("lojaSelecionada");
      }
    },

    // Limpar seleção de loja
    limparLoja() {
      this.lojaSelecionada = null;
      localStorage.removeItem("lojaSelecionada");

      // Remover header do axios
      if (axios.defaults.headers.common) {
        delete axios.defaults.headers.common["x-loja"];
      }

      console.log("🗑️ Seleção de loja limpa");
    },

    // Configurar header do axios
    configurarAxiosHeader(codigo) {
      if (!axios.defaults.headers.common) {
        axios.defaults.headers.common = {};
      }

      // Só atualiza e faz log se o valor realmente mudar
      if (axios.defaults.headers.common["x-loja"] !== codigo) {
        axios.defaults.headers.common["x-loja"] = codigo;
        console.log(`🔧 Header configurado: x-loja = ${codigo}`);
      }
    },

    // Verificar se loja ainda é válida
    async verificarLoja() {
      if (!this.lojaSelecionada) return false;

      try {
        const response = await axios.get("http://localhost:3000/test");
        return response.status === 200;
      } catch (error) {
        console.error("❌ Loja atual inválida:", error);
        this.limparLoja();
        return false;
      }
    },
  },
});
