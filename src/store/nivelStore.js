import { defineStore } from "pinia";
import axios from "axios";

export const useNivelStore = defineStore("nivel", {
  state: () => ({
    usuarios: [],
    ranking: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Calcular nível baseado no XP (cada 100 XP = 1 nível)
    calcularNivel: () => (xp) => {
      return Math.floor(xp / 100) + 1;
    },

    // Calcular XP restante para próximo nível
    calcularXpRestante: () => (xp) => {
      return 100 - (xp % 100);
    },

    // Obter título baseado no nível
    obterTitulo: () => (nivel) => {
      const titulos = {
        1: "Novato",
        2: "Iniciante",
        3: "Aprendiz",
        5: "Competente",
        8: "Experiente",
        12: "Veterano",
        16: "Especialista",
        20: "Mestre",
        25: "Auditor Senior",
        30: "Lenda",
        40: "Elite",
        50: "Supremo"
      };

      // Encontrar o título adequado para o nível
      const niveisOrdenados = Object.keys(titulos)
        .map(Number)
        .sort((a, b) => b - a);

      for (const nivelMinimo of niveisOrdenados) {
        if (nivel >= nivelMinimo) {
          return titulos[nivelMinimo];
        }
      }

      return "Auditor de Estoque";
    },

    // Calcular ranking geral (posição do usuário)
    calcularPosicaoRanking: (state) => (usuarioId) => {
      const ranking = [...state.usuarios].sort((a, b) => {
        // Ordenar por XP total (contador de itens + conquistas)
        const xpA = (a.contador || 0) + (a.xpConquistas || 0);
        const xpB = (b.contador || 0) + (b.xpConquistas || 0);
        return xpB - xpA;
      });

      const posicao = ranking.findIndex(user => user.id === usuarioId) + 1;
      return posicao || ranking.length + 1;
    },

    // Calcular média de desempenho comparado a outros usuários
    calcularMediaDesempenho: (state) => (usuarioId) => {
      if (state.usuarios.length === 0) return 0;

      const usuario = state.usuarios.find(u => u.id === usuarioId);
      if (!usuario) return 0;

      const totalUsuarios = state.usuarios.length;
      const usuariosComMenorDesempenho = state.usuarios.filter(u =>
        (u.contador || 0) < (usuario.contador || 0)
      ).length;

      return Math.round((usuariosComMenorDesempenho / totalUsuarios) * 100);
    },

    // Obter ranking top 10
    obterTopRanking: (state) => {
      return [...state.usuarios]
        .sort((a, b) => {
          const xpA = (a.contador || 0) + (a.xpConquistas || 0);
          const xpB = (b.contador || 0) + (b.xpConquistas || 0);
          return xpB - xpA;
        })
        .slice(0, 10);
    }
  },

  actions: {
    // Carregar dados de usuários para cálculos de ranking
    async carregarUsuarios() {
      this.loading = true;
      this.error = null;

      try {
        // Obter loja atual do localStorage ou usar padrão
        const lojaSelecionada = JSON.parse(localStorage.getItem('lojaSelecionada') || '{"codigo":"056"}');

        const response = await axios.get("http://localhost:3000/usuarios", {
          headers: {
            'x-loja': lojaSelecionada.codigo
          }
        });

        this.usuarios = response.data.map(user => ({
          ...user,
          xpConquistas: this.calcularXpConquistas(user),
          nivel: this.calcularNivel((user.contador || 0) + this.calcularXpConquistas(user)),
        }));

        console.log(`✅ ${this.usuarios.length} usuários carregados para ranking`);
      } catch (error) {
        this.error = error.response?.data?.erro || "Erro ao carregar usuários";
        console.error("❌ Erro ao carregar usuários para ranking:", this.error);
        // Em caso de erro, inicializar com array vazio para evitar crashes
        this.usuarios = [];
      } finally {
        this.loading = false;
      }
    },

    // Calcular XP de conquistas baseado nas atividades do usuário
    calcularXpConquistas(usuario) {
      let xp = 0;

      // XP por itens lidos (base)
      xp += usuario.contador || 0;

      // XP bônus por marcos de itens
      if (usuario.contador >= 1000) xp += 100; // Maratona
      if (usuario.contador >= 500) xp += 50;   // Meta Batida

      // XP por auditorias completadas
      if (usuario.totalAuditorias) {
        xp += usuario.totalAuditorias * 10;
      }

      // XP por consistência (75%+ de conclusão)
      const percentualConcluido = (usuario.contador / 500) * 100;
      if (percentualConcluido >= 75) xp += 25;

      return xp;
    },

    // Atualizar XP do usuário (quando completar conquista)
    async atualizarXpUsuario(usuarioId, xpGanho, motivoConquista) {
      try {
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        if (usuario) {
          usuario.xpConquistas += xpGanho;
          usuario.nivel = this.calcularNivel(
            (usuario.contador || 0) + usuario.xpConquistas
          );

          console.log(`🎉 ${usuario.nome} ganhou ${xpGanho} XP por: ${motivoConquista}`);
        }
      } catch (error) {
        console.error("❌ Erro ao atualizar XP:", error);
      }
    },

    // Verificar conquistas disponíveis para um usuário
    verificarConquistasDisponiveis(usuario, dadosDetalhados = {}) {
      const conquistasDisponiveis = [];

      const {
        corredoresUnicos = [],
        itensFaltantes = [],
        atividadesRecentes = []
      } = dadosDetalhados;

      // Lista de conquistas com condições e XP
      const conquistas = [
        {
          id: "primeira_auditoria",
          nome: "Primeiro Dia",
          descricao: "Fez sua primeira auditoria",
          icone: "🎉",
          xp: 10,
          condicao: () => (usuario.contador || 0) > 0
        },
        {
          id: "meta_100",
          nome: "Centena",
          descricao: "Leu 100 itens",
          icone: "💯",
          xp: 15,
          condicao: () => (usuario.contador || 0) >= 100
        },
        {
          id: "meta_500",
          nome: "Meta Batida",
          descricao: "Leu mais de 500 itens",
          icone: "🎯",
          xp: 50,
          condicao: () => (usuario.contador || 0) >= 500
        },
        {
          id: "explorador",
          nome: "Explorador",
          descricao: "Cobriu 5+ corredores",
          icone: "🗺️",
          xp: 25,
          condicao: () => corredoresUnicos.length >= 5
        },
        {
          id: "maratona",
          nome: "Maratona",
          descricao: "Leu mais de 1000 itens",
          icone: "🏅",
          xp: 100,
          condicao: () => (usuario.contador || 0) >= 1000
        },
        {
          id: "corredor_mestre",
          nome: "Corredor Mestre",
          descricao: "Cobriu 10+ corredores",
          icone: "🏆",
          xp: 50,
          condicao: () => corredoresUnicos.length >= 10
        },
        {
          id: "zero_faltas",
          nome: "Zero Faltas",
          descricao: "Nenhum item com estoque baixo",
          icone: "🛡️",
          xp: 30,
          condicao: () => itensFaltantes.length === 0
        },
        {
          id: "detetive",
          nome: "Detetive",
          descricao: "Identificou 10+ itens faltantes",
          icone: "🔍",
          xp: 20,
          condicao: () => itensFaltantes.length >= 10
        },
        {
          id: "consistencia",
          nome: "Consistência",
          descricao: "75%+ de conclusão",
          icone: "📈",
          xp: 25,
          condicao: () => ((usuario.contador || 0) / 500) >= 0.75
        },
        {
          id: "relampago",
          nome: "Relâmpago",
          descricao: "Verificou 50 itens rapidamente",
          icone: "⚡",
          xp: 35,
          repeticao: "diaria",
          condicao: () => {
            if (!atividadesRecentes || atividadesRecentes.length < 50) return false;
            const primeira = atividadesRecentes[0]?.timestamp;
            const ultima = atividadesRecentes[49]?.timestamp;
            if (!primeira || !ultima) return false;
            return (primeira - ultima) / (1000 * 60 * 60) < 1;
          }
        }
      ];

      return conquistas.filter(conquista => conquista.condicao());
    }
  }
});