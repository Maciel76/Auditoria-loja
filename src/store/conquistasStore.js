// store/conquistasStore.js
import { defineStore } from "pinia";
import axios from "axios";

const API_BASE = "http://localhost:3000/api/conquistas";

export const useConquistasStore = defineStore("conquistas", {
  state: () => ({
    conquistas: [],
    conquistasAtivas: [],
    loading: false,
    error: null,
    stats: {
      total: 0,
      ativas: 0,
      inativas: 0,
      porCategoria: {},
      porDificuldade: {},
    },
  }),

  getters: {
    /**
     * Filtrar conquistas por categoria
     */
    conquistasPorCategoria: (state) => (category) => {
      return state.conquistasAtivas.filter((c) => c.category === category);
    },

    /**
     * Filtrar conquistas por dificuldade
     */
    conquistasPorDificuldade: (state) => (difficulty) => {
      return state.conquistasAtivas.filter((c) => c.difficulty === difficulty);
    },

    /**
     * Obter conquista por ID
     */
    conquistaPorId: (state) => (achievementId) => {
      return state.conquistas.find((c) => c.achievementId === achievementId);
    },

    /**
     * Total de XP disponível em todas as conquistas ativas
     */
    totalXpDisponivel: (state) => {
      return state.conquistasAtivas.reduce((sum, c) => sum + c.points, 0);
    },

    /**
     * Contagem por categoria
     */
    contagemPorCategoria: (state) => {
      return state.conquistasAtivas.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {});
    },

    /**
     * Contagem por dificuldade
     */
    contagemPorDificuldade: (state) => {
      return state.conquistasAtivas.reduce((acc, c) => {
        acc[c.difficulty] = (acc[c.difficulty] || 0) + 1;
        return acc;
      }, {});
    },
  },

  actions: {
    /**
     * Carregar todas as conquistas
     */
    async carregarConquistas(filtros = {}) {
      this.loading = true;
      this.error = null;

      try {
        const params = new URLSearchParams(filtros).toString();
        const url = params ? `${API_BASE}?${params}` : API_BASE;

        const response = await axios.get(url);

        this.conquistas = response.data.conquistas;
        console.log(`✅ ${this.conquistas.length} conquistas carregadas`);

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao carregar conquistas";
        console.error("❌ Erro ao carregar conquistas:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Carregar apenas conquistas ativas
     */
    async carregarConquistasAtivas() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_BASE}/ativas`);

        this.conquistasAtivas = response.data.conquistas;
        console.log(`✅ ${this.conquistasAtivas.length} conquistas ativas carregadas`);

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao carregar conquistas ativas";
        console.error("❌ Erro ao carregar conquistas ativas:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Carregar conquistas por categoria
     */
    async carregarPorCategoria(category) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_BASE}/categoria/${category}`);

        console.log(`✅ ${response.data.total} conquistas de ${category} carregadas`);
        return response.data.conquistas;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao carregar conquistas por categoria";
        console.error("❌ Erro ao carregar por categoria:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Buscar uma conquista específica
     */
    async buscarConquista(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_BASE}/${id}`);

        console.log(`✅ Conquista ${id} encontrada`);
        return response.data.conquista;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao buscar conquista";
        console.error("❌ Erro ao buscar conquista:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Criar nova conquista
     */
    async criarConquista(conquistaData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(API_BASE, conquistaData);

        const novaConquista = response.data.conquista;

        // Adicionar à lista local
        this.conquistas.push(novaConquista);
        if (novaConquista.ativo) {
          this.conquistasAtivas.push(novaConquista);
        }

        console.log(`✅ Conquista criada: ${novaConquista.achievementId}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao criar conquista";
        console.error("❌ Erro ao criar conquista:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Atualizar conquista existente
     */
    async atualizarConquista(id, updateData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.put(`${API_BASE}/${id}`, updateData);

        const conquistaAtualizada = response.data.conquista;

        // Atualizar na lista local
        const index = this.conquistas.findIndex(
          (c) => c._id === conquistaAtualizada._id
        );
        if (index !== -1) {
          this.conquistas[index] = conquistaAtualizada;
        }

        // Atualizar lista de ativas
        const indexAtivas = this.conquistasAtivas.findIndex(
          (c) => c._id === conquistaAtualizada._id
        );
        if (conquistaAtualizada.ativo) {
          if (indexAtivas !== -1) {
            this.conquistasAtivas[indexAtivas] = conquistaAtualizada;
          } else {
            this.conquistasAtivas.push(conquistaAtualizada);
          }
        } else if (indexAtivas !== -1) {
          this.conquistasAtivas.splice(indexAtivas, 1);
        }

        console.log(`✅ Conquista atualizada: ${conquistaAtualizada.achievementId}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao atualizar conquista";
        console.error("❌ Erro ao atualizar conquista:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Deletar conquista (soft delete)
     */
    async deletarConquista(id, forceDelete = false) {
      this.loading = true;
      this.error = null;

      try {
        const url = forceDelete
          ? `${API_BASE}/${id}?forceDelete=true`
          : `${API_BASE}/${id}`;

        const response = await axios.delete(url);

        if (forceDelete) {
          // Remover completamente das listas
          this.conquistas = this.conquistas.filter(
            (c) => c._id !== id && c.achievementId !== id
          );
          this.conquistasAtivas = this.conquistasAtivas.filter(
            (c) => c._id !== id && c.achievementId !== id
          );
        } else {
          // Apenas remover da lista de ativas
          this.conquistasAtivas = this.conquistasAtivas.filter(
            (c) => c._id !== id && c.achievementId !== id
          );
        }

        console.log(
          `✅ Conquista ${forceDelete ? "deletada" : "desativada"}: ${id}`
        );
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao deletar conquista";
        console.error("❌ Erro ao deletar conquista:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Reativar conquista
     */
    async reativarConquista(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_BASE}/${id}/ativar`);

        const conquistaReativada = response.data.conquista;

        // Adicionar de volta à lista de ativas
        const index = this.conquistasAtivas.findIndex(
          (c) => c._id === conquistaReativada._id
        );
        if (index === -1) {
          this.conquistasAtivas.push(conquistaReativada);
        }

        console.log(`✅ Conquista reativada: ${conquistaReativada.achievementId}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao reativar conquista";
        console.error("❌ Erro ao reativar conquista:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Validar conquistas para um usuário específico
     */
    async validarConquistasUsuario(usuarioId, lojaId, periodo = "periodo_completo") {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_BASE}/validar-usuario`, {
          usuarioId,
          lojaId,
          periodo,
        });

        console.log(`✅ Conquistas validadas para usuário ${usuarioId}`);
        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.erro || "Erro ao validar conquistas do usuário";
        console.error("❌ Erro ao validar conquistas:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Carregar estatísticas
     */
    async carregarEstatisticas() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_BASE}/stats/resumo`);

        this.stats = response.data.stats;
        console.log("✅ Estatísticas de conquistas carregadas");

        return response.data.stats;
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao carregar estatísticas";
        console.error("❌ Erro ao carregar estatísticas:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Limpar estado de erro
     */
    limparErro() {
      this.error = null;
    },

    /**
     * Resetar store
     */
    reset() {
      this.conquistas = [];
      this.conquistasAtivas = [];
      this.loading = false;
      this.error = null;
      this.stats = {
        total: 0,
        ativas: 0,
        inativas: 0,
        porCategoria: {},
        porDificuldade: {},
      };
    },
  },
});
