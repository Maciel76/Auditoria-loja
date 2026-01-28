// frontend/src/store/conquistasStore.js
import { defineStore } from 'pinia';
import api from '@/config/api';

export const useConquistasStore = defineStore('conquistas', {
  state: () => ({
    conquistas: [],
    conquistasUsuario: {},
    carregando: false,
    erro: null
  }),

  getters: {
    conquistasDisponiveis: (state) => state.conquistas,
    conquistasDoUsuario: (state) => (userId) => state.conquistasUsuario[userId] || [],
    conquistasDesbloqueadas: (state) => (userId) => {
      const userAchievements = state.conquistasUsuario[userId] || [];
      return state.conquistas.filter(c => userAchievements.includes(c.achievementId));
    }
  },

  actions: {
    async carregarConquistas() {
      this.carregando = true;
      try {
        const response = await api.get('/conquistas-agent');
        this.conquistas = response.data;
        this.erro = null;
      } catch (error) {
        this.erro = error.message;
        console.error('Erro ao carregar conquistas:', error);
      } finally {
        this.carregando = false;
      }
    },

    async carregarConquistasUsuario(userId) {
      this.carregando = true;
      try {
        const response = await api.get(`/conquistas-agent/usuario/${userId}`);
        // Certificar-se de que o campo de raridade está presente nas conquistas
        this.conquistasUsuario[userId] = response.data.conquistas.map(conquista => ({
          ...conquista,
          rarity: conquista.rarity || conquista.rarity
        }));
        this.erro = null;
      } catch (error) {
        this.erro = error.message;
        console.error(`Erro ao carregar conquistas do usuário ${userId}:`, error);
      } finally {
        this.carregando = false;
      }
    },

    async verificarNovasConquistas(userId) {
      try {
        const response = await api.post(`/conquistas-agent/verificar/${userId}`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao verificar novas conquistas para o usuário ${userId}:`, error);
        throw error;
      }
    }
  }
});
