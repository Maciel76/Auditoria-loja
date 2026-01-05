import { defineStore } from 'pinia';
import axios from 'axios';

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
    // Getters para os cards de resumo
    itensAuditados: (state) => {
      return state.metricasDiarias?.etiquetas?.totalLidos ?? 0;
    },
    valorRuptura: (state) => {
      // Formata o valor para moeda brasileira
      const valor = state.metricasDiarias?.rupturas?.valorRuptura ?? 0;
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    },
    aderencia: (state) => {
      const percentual = state.metricasDiarias?.etiquetas?.aderencia ?? 0;
      return `${(percentual * 100).toFixed(0)}%`;
    },
    itensPorColaborador: (state) => {
        const totalItens = state.metricasDiarias?.etiquetas?.totalLidos ?? 0;
        const totalUsers = state.metricasDiarias?.usuarios?.totalUsuarios ?? 0;
        if(totalUsers === 0) return 0;
        return (totalItens / totalUsers).toFixed(1);
    },

    // Getters para os cards de insights
    setorDestaque: (state) => {
        if (!state.metricasSetores || state.metricasSetores.length === 0) {
            return { nome: 'N/A', valor: '' };
        }
        const destaque = state.metricasSetores.reduce((max, setor) => 
            (setor.pontuacao > max.pontuacao ? setor : max), state.metricasSetores[0]
        );
        return { nome: destaque.nome, valor: `${(destaque.aderencia * 100).toFixed(0)}%` };
    },
    setorCritico: (state) => {
        if (!state.metricasSetores || state.metricasSetores.length === 0) {
            return { nome: 'N/A', valor: '' };
        }
        const critico = state.metricasSetores.reduce((min, setor) =>
            (setor.pontuacao < min.pontuacao ? setor : min), state.metricasSetores[0]
        );
        return { nome: critico.nome, valor: `${(critico.aderencia * 100).toFixed(0)}%` };
    },
    colaboradorDestaque: (state) => {
        if (!state.rankingColaboradores || state.rankingColaboradores.length === 0) {
            return { nome: 'N/A', conquista: 'Nenhuma atividade registrada' };
        }
        const destaque = state.rankingColaboradores[0];
        return { nome: destaque.nome, conquista: `${destaque.auditorias} itens auditados` };
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
          axios.get(perfilUrl, { params: { data: targetDate } }),
          axios.get('/api/metricas/lojas', { headers: { 'x-loja': lojaCodigo } })
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