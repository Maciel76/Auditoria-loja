import { defineStore } from "pinia";
import axios from "axios";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    // Estatísticas gerais
    systemStats: {
      activeAudits: 0,
      onlineUsers: 0,
      acceptedSuggestions: 0,
      inDevelopment: 0,
      totalLojas: 0,
      lastUpdate: null,
    },

    // Feed de atividades
    feedItems: [],

    // Items em votação
    votingItems: [],

    // Conquistas do usuário
    userAchievements: [],

    // Estados de loading
    loading: {
      stats: false,
      feed: false,
      voting: false,
      achievements: false,
    },

    // Erros
    errors: {},
  }),

  getters: {
    // Estatísticas formatadas
    formattedStats: (state) => ({
      activeAudits: {
        value: state.systemStats.activeAudits,
        label: "Auditorias Ativas",
        icon: "📊",
        color: "#4361ee",
      },
      onlineUsers: {
        value: state.systemStats.onlineUsers,
        label: "Usuários Online",
        icon: "👥",
        color: "#48bb78",
      },
      acceptedSuggestions: {
        value: state.systemStats.acceptedSuggestions,
        label: "Sugestões Aceitas",
        icon: "💡",
        color: "#f59e0b",
      },
      inDevelopment: {
        value: state.systemStats.inDevelopment,
        label: "Em Desenvolvimento",
        icon: "🔧",
        color: "#9333ea",
      },
    }),

    // Feed filtrado por tipo
    feedItemsByType: (state) => (type) => {
      return state.feedItems.filter((item) => item.type === type);
    },

    // Items de votação por status
    votingItemsByStatus: (state) => (status) => {
      return state.votingItems.filter((item) => item.status === status);
    },

    // Conquistas desbloqueadas
    unlockedAchievements: (state) => {
      return state.userAchievements.filter((achievement) => achievement.unlocked);
    },

    // Progresso das conquistas
    achievementProgress: (state) => {
      const total = state.userAchievements.length;
      const unlocked = state.userAchievements.filter((a) => a.unlocked).length;
      return total > 0 ? Math.round((unlocked / total) * 100) : 0;
    },
  },

  actions: {
    // Carregar estatísticas do sistema
    async loadSystemStats() {
      this.loading.stats = true;
      try {
        const response = await axios.get("/api/dashboard/stats");

        if (response.data.success) {
          this.systemStats = {
            ...response.data.stats,
            lastUpdate: new Date().toISOString(),
          };
        } else {
          // Usar dados mock se API não estiver disponível
          this.loadMockStats();
        }
      } catch (error) {
        console.warn("Usando dados mock para estatísticas:", error.message);
        this.loadMockStats();
      } finally {
        this.loading.stats = false;
      }
    },

    // Carregar feed de atividades
    async loadFeedItems() {
      this.loading.feed = true;
      try {
        const response = await axios.get("/api/dashboard/feed");

        if (response.data.success) {
          this.feedItems = response.data.feed;
        } else {
          this.loadMockFeed();
        }
      } catch (error) {
        console.warn("Usando dados mock para feed:", error.message);
        this.loadMockFeed();
      } finally {
        this.loading.feed = false;
      }
    },

    // Carregar items de votação
    async loadVotingItems() {
      this.loading.voting = true;
      try {
        const response = await axios.get("/api/dashboard/voting");

        if (response.data.success) {
          this.votingItems = response.data.voting;
        } else {
          this.loadMockVoting();
        }
      } catch (error) {
        console.warn("Usando dados mock para votação:", error.message);
        this.loadMockVoting();
      } finally {
        this.loading.voting = false;
      }
    },

    // Carregar conquistas do usuário
    async loadUserAchievements(userId = null) {
      this.loading.achievements = true;
      try {
        const response = await axios.get(`/api/dashboard/achievements${userId ? `?user=${userId}` : ""}`);

        if (response.data.success) {
          this.userAchievements = response.data.achievements;
        } else {
          this.loadMockAchievements();
        }
      } catch (error) {
        console.warn("Usando dados mock para conquistas:", error.message);
        this.loadMockAchievements();
      } finally {
        this.loading.achievements = false;
      }
    },

    // Submeter sugestão
    async submitSuggestion(suggestion) {
      try {
        const response = await axios.post("/api/sugestoes", {
          sugestao: suggestion,
          tipo: "dashboard",
          data_criacao: new Date().toISOString(),
        });

        if (response.data.success) {
          // Adicionar ao feed local
          const newItem = {
            id: Date.now(),
            type: "suggestion",
            title: `💡 ${suggestion.substring(0, 30)}...`,
            description: suggestion,
            votes: 0,
            comments: 0,
            time: "Agora",
            badge: null,
            user: { name: "Você", avatar: "VC" },
            adminResponse: null,
          };

          this.feedItems.unshift(newItem);
          return { success: true, message: "Sugestão enviada com sucesso!" };
        }
      } catch (error) {
        console.error("Erro ao enviar sugestão:", error);
        return { success: false, message: "Erro ao enviar sugestão" };
      }
    },

    // Votar em item
    async submitVote(itemId) {
      try {
        const response = await axios.post(`/api/dashboard/vote/${itemId}`);

        if (response.data.success) {
          const item = this.votingItems.find((item) => item.id === itemId);
          if (item && !item.userVoted) {
            item.votes++;
            item.userVoted = true;
          }
          return { success: true, message: "Voto registrado!" };
        }
      } catch (error) {
        console.error("Erro ao votar:", error);
        // Simular voto local se API não disponível
        const item = this.votingItems.find((item) => item.id === itemId);
        if (item && !item.userVoted) {
          item.votes++;
          item.userVoted = true;
        }
        return { success: true, message: "Voto registrado localmente!" };
      }
    },

    // Dados mock para desenvolvimento
    loadMockStats() {
      this.systemStats = {
        activeAudits: 12,
        onlineUsers: 28,
        acceptedSuggestions: 15,
        inDevelopment: 7,
        totalLojas: 10,
        lastUpdate: new Date().toISOString(),
      };
    },

    loadMockFeed() {
      this.feedItems = [
        {
          id: 1,
          type: "feature",
          title: "🚀 Auditoria em Tempo Real",
          description: "Nova funcionalidade permite acompanhar auditorias em tempo real com atualizações instantâneas",
          votes: 24,
          comments: 8,
          time: "2 horas",
          badge: "new",
          user: null,
          adminResponse: null,
        },
        {
          id: 2,
          type: "suggestion",
          title: "💡 Sugestão: Relatórios Personalizados",
          description: "Seria ótimo poder criar relatórios personalizados com filtros específicos por departamento",
          votes: 42,
          comments: 15,
          time: "1 dia",
          badge: null,
          user: { name: "João Silva", avatar: "JS" },
          adminResponse: {
            text: "Ótima ideia! Já estamos desenvolvendo essa funcionalidade para a próxima atualização.",
            badge: "📋 Equipe respondeu:",
          },
        },
        {
          id: 3,
          type: "update",
          title: "🛠️ Melhorias no Dashboard",
          description: "Otimizamos a performance do dashboard e adicionamos novos gráficos de tendência",
          votes: 31,
          comments: 12,
          time: "3 dias",
          badge: "update",
          user: null,
          adminResponse: null,
        },
      ];
    },

    loadMockVoting() {
      this.votingItems = [
        {
          id: 1,
          title: "Integração com Power BI",
          description: "Exportação de dados direto para dashboards do Power BI",
          status: "in-progress",
          votes: 127,
          userVoted: true,
        },
        {
          id: 2,
          title: "App Mobile Nativo",
          description: "Aplicativo dedicado para auditorias em campo",
          status: "under-review",
          votes: 89,
          userVoted: false,
        },
        {
          id: 3,
          title: "Relatórios Automáticos",
          description: "Geração automática de relatórios semanais",
          status: "implemented",
          votes: 56,
          userVoted: false,
        },
        {
          id: 4,
          title: "Sistema de Gamificação",
          description: "Badges e recompensas por participação ativa",
          status: "new-idea",
          votes: 34,
          userVoted: false,
        },
      ];
    },

    loadMockAchievements() {
      this.userAchievements = [
        {
          id: 1,
          title: "Primeira Auditoria",
          description: "Concluiu sua primeira auditoria",
          unlocked: true,
          icon: "🔍",
          type: "unlocked",
        },
        {
          id: 2,
          title: "Sugestor Ativo",
          description: "Enviou 5+ sugestões",
          unlocked: true,
          icon: "💡",
          type: "unlocked",
        },
        {
          id: 3,
          title: "Top Colaborador",
          description: "Fique entre os 3 melhores do mês",
          unlocked: false,
          icon: "🏅",
          type: "locked",
        },
        {
          id: 4,
          title: "Auditor Experiente",
          description: "3/10 auditorias concluídas",
          unlocked: true,
          icon: "📊",
          type: "progress",
          progress: 30,
        },
      ];
    },

    // Carregar todos os dados do dashboard
    async loadDashboardData() {
      await Promise.all([
        this.loadSystemStats(),
        this.loadFeedItems(),
        this.loadVotingItems(),
        this.loadUserAchievements(),
      ]);
    },

    // Limpar dados
    clearData() {
      this.feedItems = [];
      this.votingItems = [];
      this.userAchievements = [];
      this.systemStats = {
        activeAudits: 0,
        onlineUsers: 0,
        acceptedSuggestions: 0,
        inDevelopment: 0,
        totalLojas: 0,
        lastUpdate: null,
      };
      this.errors = {};
    },
  },
});