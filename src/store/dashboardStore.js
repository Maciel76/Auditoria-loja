import { defineStore } from "pinia";
import api from "@/services/api";

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

    // Items de votação reais do banco (tipo 'voting')
    realVotingItems: [],

    // Conquistas do usuário

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

    // Items de votação reais (tipo 'voting')
    realVotingItemsByStatus: (state) => (status) => {
      if (!status) return state.realVotingItems;
      return state.realVotingItems.filter((item) => item.status === status);
    },

    // Conquistas desbloqueadas
    unlockedAchievements: () => {
      return [];
    },

    // Progresso das conquistas
    achievementProgress: () => {
      return 0;
    },
  },

  actions: {
    // Carregar estatísticas do sistema
    async loadSystemStats() {
      this.loading.stats = true;
      try {
        const response = await api.get("/api/dashboard/stats");

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

    // Carregar items de votação reais do banco
    async loadRealVotingItems() {
      console.log("🔄 dashboardStore.loadRealVotingItems() iniciado");
      try {
        console.log(
          "📡 Fazendo requisição para /api/sugestoes?tipo=voting"
        );
        const response = await api.get(
          "/api/sugestoes?tipo=voting"
        );
        console.log("📦 Resposta recebida:", response.data);

        if (response.data.sugestoes) {
          console.log(
            `✅ ${response.data.sugestoes.length} itens de votação encontrados`
          );

          // Converter sugestões de votação em formato apropriado
          this.realVotingItems = response.data.sugestoes
            .map((sugestao) => {
              const lines = sugestao.sugestao.split("\n\n");
              const title = lines[0] || sugestao.sugestao.substring(0, 50);
              const description =
                lines.length > 1
                  ? lines.slice(1).join("\n\n")
                  : sugestao.sugestao;

              return {
                id: sugestao.id || sugestao._id,
                title: title,
                description:
                  description.length > 100
                    ? description.substring(0, 100) + "..."
                    : description,
                status: this.mapStatusToVoting(sugestao.status),
                votes: this.calculateTotalReactions(sugestao.reactions),
                userVoted: false, // TODO: implementar tracking de voto por usuário
                reactions: sugestao.reactions || {
                  like: { count: 0, users: [] },
                  dislike: { count: 0, users: [] },
                  fire: { count: 0, users: [] },
                  heart: { count: 0, users: [] },
                },
                originalId: sugestao._id,
              };
            })
            .reverse(); // Mais recentes primeiro

          console.log(
            `✅ Items de votação processados: ${this.realVotingItems.length}`
          );
        } else {
          console.log("⚠️ Nenhum item de votação encontrado");
          this.realVotingItems = [];
        }
      } catch (error) {
        console.error("❌ Erro ao carregar items de votação:", error);
        this.realVotingItems = [];
      }
    },

    // Mapear status para formato de votação
    mapStatusToVoting(status) {
      const statusMap = {
        pendente: "new-idea",
        analisando: "under-review",
        implementado: "implemented",
        rejeitado: "rejected",
      };
      return statusMap[status] || "new-idea";
    },

    // Calcular total de reações como "votos"
    calculateTotalReactions(reactions) {
      if (!reactions) return 0;
      return (
        (reactions.like?.count || 0) +
        (reactions.fire?.count || 0) +
        (reactions.heart?.count || 0) -
        (reactions.dislike?.count || 0)
      );
    },

    // Reagir em item de votação
    async reactToVotingItem(itemId, reactionType, userIdentifier) {
      try {
        console.log(`📞 Enviando reação ${reactionType} para item ${itemId}`);
        const response = await api.post(
          `/api/sugestoes/${itemId}/react`,
          {
            reaction: reactionType,
            userIdentifier: userIdentifier,
          }
        );

        if (response.data.reactions) {
          // Atualizar item local
          const item = this.realVotingItems.find(
            (item) => item.originalId === itemId
          );
          if (item) {
            item.reactions = response.data.reactions;
            item.votes = this.calculateTotalReactions(response.data.reactions);
          }

          console.log(`✅ Reação ${reactionType} salva com sucesso!`);
          return { success: true, message: response.data.message };
        }
      } catch (error) {
        console.error("❌ Erro ao reagir em item de votação:", error);
        return { success: false, message: "Erro ao salvar reação" };
      }
    },

    // Carregar feed de atividades (do banco de dados)
    async loadFeedItems() {
      console.log("🔄 dashboardStore.loadFeedItems() iniciado");
      this.loading.feed = true;
      try {
        console.log(
          "📡 Fazendo requisição para /api/sugestoes"
        );
        const response = await api.get("/api/sugestoes");
        console.log("📦 Resposta recebida:", response.data);

        if (response.data.sugestoes) {
          console.log(
            `✅ ${response.data.sugestoes.length} sugestões encontradas`
          );
          console.log("🔄 Processando sugestões...");
          // Converter sugestões em formato de feed
          this.feedItems = response.data.sugestoes
            .map((sugestao) => {
              // Funções auxiliares inline
              const getSuggestionTitle = (texto, tipo) => {
                const lines = texto.split("\n\n");
                let title = lines[0] || texto.substring(0, 50);

                // Remover "💡 POSTAGEM:" ou "POSTAGEM:" do início se existir
                title = title.replace(/^💡\s*POSTAGEM:\s*/i, "");
                title = title.replace(/^POSTAGEM:\s*/i, "");

                return title.trim();
              };

              const getSuggestionDescription = (texto) => {
                const lines = texto.split("\n\n");
                if (lines.length > 1) {
                  return lines.slice(1).join("\n\n");
                }
                return texto.length > 100
                  ? texto.substring(0, 100) + "..."
                  : texto;
              };

              const formatTime = (dateString) => {
                if (!dateString) return "Recente";
                const date = new Date(dateString);
                const now = new Date();
                const diff = now - date;
                const minutes = Math.floor(diff / (1000 * 60));
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                if (minutes < 1) return "Agora mesmo";
                if (minutes < 60) return `${minutes}m`;
                if (hours < 24) return `${hours}h`;
                if (days === 1) return "1 dia";
                if (days < 7) return `${days} dias`;
                return date.toLocaleDateString("pt-BR");
              };

              const getBadgeFromDate = (dateString) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                const now = new Date();
                const diffHours = (now - date) / (1000 * 60 * 60);
                if (diffHours < 24) return "new";
                return null;
              };

              return {
                id: sugestao.id || sugestao._id,
                type: sugestao.tipo,
                title: getSuggestionTitle(sugestao.sugestao, sugestao.tipo),
                description: getSuggestionDescription(sugestao.sugestao),
                votes: sugestao.votos || 0,
                comentarios: sugestao.comentarios || [], // Manter comentários no formato original do backend
                time: sugestao.tempoDecorrido || formatTime(sugestao.createdAt),
                badge: getBadgeFromDate(sugestao.createdAt),
                user: {
                  name: sugestao.nome || "Usuário",
                  avatar: (sugestao.nome || "U").charAt(0).toUpperCase(),
                },
                adminResponse: sugestao.comentarioAdmin
                  ? {
                      text: sugestao.comentarioAdmin,
                      badge: "📋 Admin respondeu:",
                    }
                  : null,
                userVoted: false,
                status: sugestao.status,
                originalId: sugestao._id,
                reactions: sugestao.reactions || {
                  like: { count: 0, users: [] },
                  dislike: { count: 0, users: [] },
                  fire: { count: 0, users: [] },
                  heart: { count: 0, users: [] },
                },
              };
            })
            .reverse(); // Mais recentes primeiro

          console.log(`✅ Feed processado com ${this.feedItems.length} itens`);
          console.log("📰 Primeiro item do feed:", this.feedItems[0]);
        } else {
          console.log("⚠️ Nenhuma sugestão encontrada, carregando dados mock");
          this.loadMockFeed();
        }
      } catch (error) {
        console.error("❌ Erro ao carregar feed do banco:", error);
        console.log("🔄 Carregando dados mock como fallback");
        this.loadMockFeed();
      } finally {
        this.loading.feed = false;
        console.log("🏁 loadFeedItems() finalizado");
      }
    },

    // Carregar items de votação
    async loadVotingItems() {
      this.loading.voting = true;
      try {
        const response = await api.get("/api/dashboard/voting");

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
      // Feature de conquistas removida
      this.userAchievements = [];
      this.loading.achievements = false;
    },

    // Adicionar comentário a um item
    async addCommentToItem(itemId, comment) {
      try {
        // Encontrar o item no feed
        const feedItem = this.feedItems.find(
          (item) => item.id === itemId || item.originalId === itemId
        );

        if (!feedItem) {
          return { success: false, message: "Item não encontrado" };
        }

        // Inicializar array de comentários se não existir
        if (!feedItem.comments) {
          feedItem.comments = [];
        }

        // Adicionar o comentário
        feedItem.comments.push(comment);

        return { success: true, message: "Comentário adicionado com sucesso!" };
      } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        return { success: false, message: error.message };
      }
    },

    // Submeter sugestão
    async submitSuggestion(suggestion, tipo = "geral") {
      try {
        const response = await api.post(
          "/api/sugestoes",
          {
            sugestao: suggestion,
            tipo: tipo,
          }
        );

        if (response.data.message) {
          // Adicionar ao feed local
          const newItem = {
            id: Date.now(),
            type: "suggestion",
            title: `💡 ${suggestion.substring(0, 50)}...`,
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
        // Mesmo com erro, adicionar localmente para teste
        const newItem = {
          id: Date.now(),
          type: "suggestion",
          title: `💡 ${suggestion.substring(0, 50)}...`,
          description: suggestion,
          votes: 0,
          comments: 0,
          time: "Agora",
          badge: null,
          user: { name: "Você", avatar: "VC" },
          adminResponse: null,
        };

        this.feedItems.unshift(newItem);
        return { success: true, message: "Sugestão salva localmente!" };
      }
    },

    // Votar em item
    async submitVote(itemId) {
      try {
        const response = await api.post(`/api/dashboard/vote/${itemId}`);

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
          description:
            "Nova funcionalidade permite acompanhar auditorias em tempo real com atualizações instantâneas",
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
          description:
            "Seria ótimo poder criar relatórios personalizados com filtros específicos por departamento",
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
          description:
            "Otimizamos a performance do dashboard e adicionamos novos gráficos de tendência",
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
        this.loadRealVotingItems(), // Carregar items de votação reais
      ]);
    },

    // Limpar dados
    clearData() {
      this.feedItems = [];
      this.votingItems = [];
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
