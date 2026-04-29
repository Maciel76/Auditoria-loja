import { defineStore } from 'pinia';
import api from "@/services/api";

// Helper para criar uma data no formato YYYY-MM-DD
const getISODate = (date = new Date()) => {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
};

export const useInsightsStore = defineStore('insights', {
  state: () => ({
    // Estado de controle
    loading: false,
    error: null,
    
    // Dados do Perfil da Loja (endpoint principal)
    loja: null,
    metricasDiarias: null,
    metricasSetores: [],
    rankingColaboradores: [],
    metricasAuditoria: {
      etiquetas: {},
      presencas: {},
      rupturas: {},
    },

    // Dados agregados (segundo endpoint)
    metricasAgregadas: null,

    // Data selecionada
    selectedDate: getISODate(),
  }),

  getters: {
    // Total de itens efetivamente lidos/atualizados na auditoria de etiquetas do dia
    itensAuditados: (state) => {
      const m = state.metricasDiarias?.etiquetas || {};
      return Number(m.itensAtualizados ?? m.totalLidos ?? 0);
    },
    // Custo total em ruptura formatado em BRL
    valorRuptura: (state) => {
      const valor = Number(
        state.metricasDiarias?.rupturas?.custoTotalRuptura
        ?? state.metricasDiarias?.rupturas?.valorRuptura
        ?? 0
      );
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    },
    // Aderência (% de conclusão das etiquetas)
    aderencia: (state) => {
      const percentual = Number(state.metricasDiarias?.etiquetas?.percentualConclusao ?? 0);
      return `${Math.round(percentual)}%`;
    },
    itensPorColaborador: (state) => {
      const m = state.metricasDiarias?.etiquetas || {};
      const totalItens = Number(m.itensAtualizados ?? m.totalLidos ?? 0);
      const totalUsers = Number(m.usuariosAtivos ?? state.metricasDiarias?.totais?.usuariosAtivos ?? 0);
      if (totalUsers === 0) return '0';
      return (totalItens / totalUsers).toFixed(1);
    },

    // Setor com melhor desempenho (a partir de locaisEstatisticas)
    setorDestaque: (state) => {
      const setores = state.metricasSetores || [];
      if (!setores.length) return { nome: 'N/A', valor: '' };
      const destaque = setores.reduce((max, s) =>
        ((s.percentualConclusao ?? s.aderencia ?? 0) > (max.percentualConclusao ?? max.aderencia ?? 0) ? s : max),
        setores[0]);
      const pct = Number(destaque.percentualConclusao ?? (destaque.aderencia || 0) * 100);
      return { nome: destaque.local || destaque.nome || 'N/A', valor: `${Math.round(pct)}%` };
    },
    setorCritico: (state) => {
      const setores = state.metricasSetores || [];
      if (!setores.length) return { nome: 'N/A', valor: '' };
      const critico = setores.reduce((min, s) =>
        ((s.percentualConclusao ?? s.aderencia ?? 0) < (min.percentualConclusao ?? min.aderencia ?? 0) ? s : min),
        setores[0]);
      const pct = Number(critico.percentualConclusao ?? (critico.aderencia || 0) * 100);
      return { nome: critico.local || critico.nome || 'N/A', valor: `${Math.round(pct)}%` };
    },
    colaboradorDestaque: (state) => {
      const ranking = state.rankingColaboradores || [];
      if (!ranking.length) return { nome: 'N/A', conquista: 'Nenhuma atividade registrada' };
      const top = ranking[0];
      return { nome: top.nome, conquista: `${top.auditorias || 0} itens auditados` };
    },
  },

  actions: {
    async fetchInsights(lojaCodigo, data) {
      if (!lojaCodigo) {
        console.error("[insightsStore] Código da loja não fornecido.");
        this.error = "Código da loja não fornecido.";
        return;
      }
      this.loading = true;
      this.error = null;
      
      const targetDate = data || this.selectedDate;
      console.log(`[insightsStore] Buscando dados para loja: ${lojaCodigo}, data: ${targetDate}`);

      try {
        const perfilUrl = `/api/perfil-loja/${lojaCodigo}`;
        console.log(`[insightsStore] Chamando API de perfil: ${perfilUrl}`);

        // Usar Promise.all para buscar dados em paralelo
        const [perfilRes, agregadasRes] = await Promise.all([
          api.get(perfilUrl, { params: { data: targetDate } }),
          api.get('/metricas/lojas', { headers: { 'x-loja': lojaCodigo } })
        ]);

        console.log('[insightsStore] Dados do perfil recebidos:', perfilRes.data);
        console.log('[insightsStore] Dados agregados recebidos:', agregadasRes.data);

        const perfilData = perfilRes.data;

        // Atualiza o state com os dados do perfil
        this.loja = perfilData.loja;
        this.metricasDiarias = perfilData.metricas;
        this.metricasSetores = perfilData.metricasSetores;
        this.rankingColaboradores = perfilData.colaboradores;
        this.metricasAuditoria = perfilData.metricasAuditoria;
        
        // Atualiza o state com os dados agregados
        this.metricasAgregadas = agregadasRes.data;

      } catch (err) {
        console.error("[insightsStore] Erro detalhado ao buscar dados da loja:", err);
        this.error = `Erro ao buscar dados da loja: ${err.message}`;
      } finally {
        this.loading = false;
        console.log('[insightsStore] Busca finalizada.');
      }
    },

    // Ação para mudar a data e recarregar os dados
    async changeDate(newDate, lojaCodigo) {
        this.selectedDate = getISODate(new Date(newDate));
        await this.fetchInsights(lojaCodigo, this.selectedDate);
    }
  },
});