<template>
  <div class="premium-dashboard">
    <!-- Header Avançado -->
    <div class="dashboard-header premium">
      <div class="header-main">
        <div class="header-title">
          <h1>📊 Analytics Center Premium</h1>
          <p>Análises avançadas em tempo real - {{ dataAtual }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value"
              >{{ dashboardData.indicadores?.saudeOperacional || 0 }}%</span
            >
            <span class="stat-label">Saúde Operacional</span>
          </div>
          <div class="stat-item">
            <span class="stat-value"
              >{{ dashboardData.totais?.lojasAtivas || 0 }}/{{
                dashboardData.totais?.totalLojas || 0
              }}</span
            >
            <span class="stat-label">Lojas Ativas</span>
          </div>
          <div class="stat-item">
            <span class="stat-value"
              >R$
              {{
                formatarMoeda(dashboardData.rupturas?.economiaEstimada || 0)
              }}</span
            >
            <span class="stat-label">Economia Estimada</span>
          </div>
        </div>
      </div>

      <!-- Filtros Avançados -->
      <div class="advanced-filters">
        <div class="filter-section">
          <h4>📅 Período e Escopo</h4>
          <div class="filter-grid">
            <div class="filter-group">
              <label>Escopo Temporal</label>
              <select v-model="filters.periodo" @change="atualizarDados">
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Comparação</label>
              <select v-model="filters.comparacao" @change="atualizarDados">
                <option value="nenhuma">Sem Comparação</option>
                <option value="periodo_anterior">Período Anterior</option>
                <option value="ano_anterior">Ano Anterior</option>
                <option value="meta">Vs Meta</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Granularidade</label>
              <select v-model="filters.granularidade" @change="atualizarDados">
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <h4>🏪 Filtros de Negócio</h4>
          <div class="filter-grid">
            <div class="filter-group">
              <label>Região</label>
              <select v-model="filters.regiao" @change="atualizarDados">
                <option value="todas">Todas as Regiões</option>
                <option v-for="regiao in regioes" :key="regiao" :value="regiao">
                  {{ regiao }}
                </option>
              </select>
            </div>
            <div class="filter-group">
              <label>Tipo de Loja</label>
              <select v-model="filters.tipoLoja" @change="atualizarDados">
                <option value="todas">Todos os Tipos</option>
                <option value="padrao">Padrão</option>
                <option value="premium">Premium</option>
                <option value="express">Express</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Faixa de Performance</label>
              <select
                v-model="filters.faixaPerformance"
                @change="atualizarDados"
              >
                <option value="todas">Todas</option>
                <option value="alta">Alta (80-100%)</option>
                <option value="media">Média (60-79%)</option>
                <option value="baixa">Baixa (0-59%)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <button class="btn-primary" @click="aplicarFiltrosAvancados">
            🚀 Aplicar Filtros
          </button>
          <button class="btn-secondary" @click="resetarFiltros">
            🔄 Resetar
          </button>
          <button class="btn-outline" @click="salvarConfiguracao">
            💾 Salvar Configuração
          </button>
        </div>
      </div>
    </div>

    <!-- Painel de Métricas em Tempo Real -->
    <div class="realtime-panel">
      <div class="panel-header">
        <h3>⏱️ Métricas em Tempo Real</h3>
        <div class="last-update">
          Última atualização: {{ ultimaAtualizacao }}
          <span class="sync-status" :class="{ syncing: sincronizando }">
            {{ sincronizando ? "🔄 Sincronizando..." : "✅ Sincronizado" }}
          </span>
        </div>
      </div>
      <div class="realtime-metrics">
        <div class="realtime-metric">
          <div class="metric-value">
            {{ dashboardData.totais?.itensProcessadosMinuto || 0 }}
          </div>
          <div class="metric-label">Itens/min</div>
          <div class="metric-trend">
            <span
              :class="
                getTrendClass(dashboardData.tendencias?.velocidadeProcessamento)
              "
            >
              {{
                getTrendIcon(dashboardData.tendencias?.velocidadeProcessamento)
              }}
            </span>
          </div>
        </div>
        <div class="realtime-metric">
          <div class="metric-value">
            {{ dashboardData.totais?.auditoriasAtivas || 0 }}
          </div>
          <div class="metric-label">Auditorias Ativas</div>
          <div class="metric-trend">
            <span
              :class="getTrendClass(dashboardData.tendencias?.auditoriasAtivas)"
            >
              {{ getTrendIcon(dashboardData.tendencias?.auditoriasAtivas) }}
            </span>
          </div>
        </div>
        <div class="realtime-metric">
          <div class="metric-value">
            {{ dashboardData.totais?.usuariosOnline || 0 }}
          </div>
          <div class="metric-label">Usuários Online</div>
          <div class="metric-trend">
            <span
              :class="getTrendClass(dashboardData.tendencias?.usuariosOnline)"
            >
              {{ getTrendIcon(dashboardData.tendencias?.usuariosOnline) }}
            </span>
          </div>
        </div>
        <div class="realtime-metric">
          <div class="metric-value">
            {{ dashboardData.rupturas?.rupturasMinuto || 0 }}
          </div>
          <div class="metric-label">Rupturas/min</div>
          <div class="metric-trend negative">📉</div>
        </div>
      </div>
    </div>

    <!-- Grid Principal de Análises -->
    <div class="analytics-grid">
      <!-- Coluna 1: Overview e Performance -->
      <div class="grid-column">
        <!-- Scorecard de Performance -->
        <div class="analysis-card">
          <div class="card-header">
            <h3>🎯 Scorecard de Performance</h3>
            <div class="card-actions">
              <button class="btn-icon" @click="exportarScorecard">📋</button>
              <button class="btn-icon" @click="compartilharScorecard">
                📤
              </button>
            </div>
          </div>
          <div class="scorecard-grid">
            <div
              class="scorecard-item"
              v-for="kpi in dashboardData.kpis"
              :key="kpi.id"
            >
              <div class="kpi-header">
                <span class="kpi-icon">{{ kpi.icone }}</span>
                <span class="kpi-title">{{ kpi.nome }}</span>
              </div>
              <div class="kpi-value" :class="getKpiClass(kpi.valor, kpi.meta)">
                {{
                  kpi.formato === "percentual"
                    ? kpi.valor + "%"
                    : kpi.formato === "monetario"
                    ? "R$ " + formatarNumero(kpi.valor)
                    : formatarNumero(kpi.valor)
                }}
              </div>
              <div class="kpi-meta">
                <span class="kpi-target"
                  >Meta: {{ kpi.meta
                  }}{{ kpi.formato === "percentual" ? "%" : "" }}</span
                >
                <span
                  class="kpi-variance"
                  :class="getVarianceClass(kpi.variacao)"
                >
                  {{ kpi.variacao > 0 ? "+" : "" }}{{ kpi.variacao }}%
                </span>
              </div>
              <div class="kpi-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width: Math.min((kpi.valor / kpi.meta) * 100, 100) + '%',
                    }"
                    :class="getProgressClass(kpi.valor, kpi.meta)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Análise de Tendências -->
        <div class="analysis-card">
          <div class="card-header">
            <h3>📈 Análise de Tendências</h3>
            <div class="timeframe-selector">
              <button
                v-for="periodo in periodosTendencia"
                :key="periodo"
                :class="{ active: tendenciaPeriodo === periodo }"
                @click="tendenciaPeriodo = periodo"
              >
                {{ periodo }}
              </button>
            </div>
          </div>
          <div class="trend-analysis">
            <div class="trend-chart">
              <canvas ref="tendenciaAvancadaChart"></canvas>
            </div>
            <div class="trend-insights">
              <h4>💡 Insights das Tendências</h4>
              <div class="insight-list">
                <div
                  v-for="insight in dashboardData.insightsTendencia"
                  :key="insight.id"
                  class="insight-item"
                  :class="insight.tipo"
                >
                  <span class="insight-icon">{{
                    getInsightIcon(insight.tipo)
                  }}</span>
                  <div class="insight-content">
                    <strong>{{ insight.titulo }}</strong>
                    <p>{{ insight.descricao }}</p>
                    <span class="insight-impact">{{ insight.impacto }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna 2: Análises Detalhadas -->
      <div class="grid-column">
        <!-- Mapa de Calor de Performance -->
        <div class="analysis-card">
          <div class="card-header">
            <h3>🌡️ Mapa de Calor - Performance por Local</h3>
            <div class="heatmap-controls">
              <select v-model="heatmapMetrica" @change="atualizarHeatmap">
                <option value="conclusao">Taxa de Conclusão</option>
                <option value="produtividade">Produtividade</option>
                <option value="qualidade">Qualidade</option>
                <option value="rupturas">Rupturas</option>
              </select>
            </div>
          </div>
          <div class="heatmap-container">
            <div class="heatmap-legend">
              <span>0%</span>
              <div class="legend-gradient"></div>
              <span>100%</span>
            </div>
            <div class="heatmap-grid">
              <div
                v-for="local in dashboardData.heatmapLocais"
                :key="local.id"
                class="heatmap-cell"
                :style="{ backgroundColor: getHeatmapColor(local.valor) }"
                :title="`${local.nome}: ${local.valor}%`"
              >
                <span class="local-name">{{ local.nome }}</span>
                <span class="local-value">{{ local.valor }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Análise de Correlação -->
        <div class="analysis-card">
          <div class="card-header">
            <h3>🔄 Análise de Correlação</h3>
            <div class="correlation-controls">
              <select v-model="correlacaoX" @change="atualizarCorrelacao">
                <option value="produtividade">Produtividade</option>
                <option value="qualidade">Qualidade</option>
                <option value="experiencia">Experiência do Usuário</option>
              </select>
              <span class="correlation-vs">vs</span>
              <select v-model="correlacaoY" @change="atualizarCorrelacao">
                <option value="conclusao">Taxa de Conclusão</option>
                <option value="rupturas">Rupturas</option>
                <option value="satisfacao">Satisfação</option>
              </select>
            </div>
          </div>
          <div class="correlation-analysis">
            <div class="correlation-chart">
              <canvas ref="correlacaoChart"></canvas>
            </div>
            <div class="correlation-stats">
              <div class="stat">
                <span class="stat-label">Coeficiente de Correlação</span>
                <span class="stat-value">{{
                  dashboardData.correlacao?.coeficiente || 0
                }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Significância</span>
                <span class="stat-value">{{
                  dashboardData.correlacao?.significancia || "N/A"
                }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">R²</span>
                <span class="stat-value">{{
                  dashboardData.correlacao?.rQuadrado || 0
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna 3: Alertas e Recomendações -->
      <div class="grid-column">
        <!-- Painel de Alertas Inteligentes -->
        <div class="analysis-card alerts-panel">
          <div class="card-header">
            <h3>🚨 Alertas Inteligentes</h3>
            <div class="alert-filters">
              <button
                :class="{ active: filtroAlerta === 'todos' }"
                @click="filtroAlerta = 'todos'"
              >
                Todos
              </button>
              <button
                :class="{ active: filtroAlerta === 'criticos' }"
                @click="filtroAlerta = 'criticos'"
              >
                Críticos
              </button>
              <button
                :class="{ active: filtroAlerta === 'oportunidades' }"
                @click="filtroAlerta = 'oportunidades'"
              >
                Oportunidades
              </button>
            </div>
          </div>
          <div class="alerts-container">
            <div
              v-for="alerta in alertasFiltrados"
              :key="alerta.id"
              class="intelligent-alert"
              :class="['severity-' + alerta.severidade, alerta.tipo]"
            >
              <div class="alert-header">
                <span class="alert-icon">{{ getAlertIcon(alerta.tipo) }}</span>
                <span class="alert-title">{{ alerta.titulo }}</span>
                <span class="alert-priority" :class="alerta.prioridade">
                  {{ alerta.prioridade }}
                </span>
              </div>
              <div class="alert-body">
                <p>{{ alerta.descricao }}</p>
                <div class="alert-metrics">
                  <div
                    class="metric"
                    v-for="metric in alerta.metricas"
                    :key="metric.nome"
                  >
                    <span class="metric-name">{{ metric.nome }}:</span>
                    <span class="metric-value">{{ metric.valor }}</span>
                  </div>
                </div>
              </div>
              <div class="alert-footer">
                <span class="alert-time">{{
                  formatarTempoRelativo(alerta.timestamp)
                }}</span>
                <div class="alert-actions">
                  <button class="btn-sm" @click="investigarAlerta(alerta)">
                    🔍 Investigar
                  </button>
                  <button class="btn-sm" @click="ignorarAlerta(alerta)">
                    ❌ Ignorar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recomendações de Otimização -->
        <div class="analysis-card">
          <div class="card-header">
            <h3>💡 Recomendações de Otimização</h3>
            <div class="recommendation-filters">
              <select
                v-model="filtroRecomendacao"
                @change="filtrarRecomendacoes"
              >
                <option value="todas">Todas</option>
                <option value="alta">Alto Impacto</option>
                <option value="rapida">Rápida Implementação</option>
                <option value="baixo_custo">Baixo Custo</option>
              </select>
            </div>
          </div>
          <div class="recommendations-list">
            <div
              v-for="recomendacao in recomendacoesFiltradas"
              :key="recomendacao.id"
              class="recommendation-item"
              :class="recomendacao.categoria"
            >
              <div class="recommendation-header">
                <span class="rec-icon">{{
                  getRecommendationIcon(recomendacao.categoria)
                }}</span>
                <span class="rec-title">{{ recomendacao.titulo }}</span>
                <span class="rec-impact" :class="recomendacao.impacto">
                  {{ recomendacao.impacto }}
                </span>
              </div>
              <div class="recommendation-body">
                <p>{{ recomendacao.descricao }}</p>
                <div class="rec-metrics">
                  <div class="rec-metric">
                    <span>ROI Estimado:</span>
                    <strong>{{ recomendacao.roi }}</strong>
                  </div>
                  <div class="rec-metric">
                    <span>Esforço:</span>
                    <strong>{{ recomendacao.esforço }}</strong>
                  </div>
                  <div class="rec-metric">
                    <span>Prazo:</span>
                    <strong>{{ recomendacao.prazo }}</strong>
                  </div>
                </div>
              </div>
              <div class="recommendation-footer">
                <button
                  class="btn-primary"
                  @click="implementarRecomendacao(recomendacao)"
                >
                  🚀 Implementar
                </button>
                <button
                  class="btn-outline"
                  @click="agendarRecomendacao(recomendacao)"
                >
                  📅 Agendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Painel de Benchmarking -->
    <div class="benchmarking-panel">
      <div class="panel-header">
        <h3>🏆 Benchmarking Avançado</h3>
        <div class="benchmark-controls">
          <select v-model="benchmarkGrupo" @change="atualizarBenchmark">
            <option value="regiao">Por Região</option>
            <option value="tipo_loja">Por Tipo de Loja</option>
            <option value="tamanho">Por Tamanho</option>
            <option value="performance">Por Performance</option>
          </select>
        </div>
      </div>
      <div class="benchmark-content">
        <div class="benchmark-chart">
          <canvas ref="benchmarkChart"></canvas>
        </div>
        <div class="benchmark-insights">
          <h4>📊 Posicionamento Competitivo</h4>
          <div class="positioning-metrics">
            <div class="position-metric">
              <span class="metric-label">Quartil Atual</span>
              <span class="metric-value">{{
                dashboardData.benchmark?.quartil || "N/A"
              }}</span>
            </div>
            <div class="position-metric">
              <span class="metric-label">Percentil</span>
              <span class="metric-value"
                >{{ dashboardData.benchmark?.percentil || 0 }}%</span
              >
            </div>
            <div class="position-metric">
              <span class="metric-label">Gap para Líder</span>
              <span class="metric-value"
                >{{ dashboardData.benchmark?.gapLider || 0 }}%</span
              >
            </div>
          </div>
          <div class="improvement-areas">
            <h5>Áreas de Melhoria Crítica</h5>
            <ul>
              <li
                v-for="area in dashboardData.benchmark?.areasMelhoria"
                :key="area"
              >
                {{ area }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Painel de Previsões -->
    <div class="forecast-panel">
      <div class="panel-header">
        <h3>🔮 Previsões e Projeções</h3>
        <div class="forecast-horizon">
          <button
            v-for="horizonte in horizontesPrevisao"
            :key="horizonte"
            :class="{ active: previsaoHorizonte === horizonte }"
            @click="previsaoHorizonte = horizonte"
          >
            {{ horizonte }}
          </button>
        </div>
      </div>
      <div class="forecast-content">
        <div class="forecast-chart">
          <canvas ref="previsaoChart"></canvas>
        </div>
        <div class="forecast-details">
          <div class="forecast-metrics">
            <div class="forecast-metric">
              <span class="metric-label">Previsão de Conclusão</span>
              <span class="metric-value"
                >{{ dashboardData.previsoes?.conclusao || 0 }}%</span
              >
              <span
                class="metric-confidence"
                :class="getConfidenceClass(dashboardData.previsoes?.confianca)"
              >
                {{ dashboardData.previsoes?.confianca || 0 }}% confiança
              </span>
            </div>
            <div class="forecast-metric">
              <span class="metric-label">Economia Projetada</span>
              <span class="metric-value"
                >R$
                {{
                  formatarNumero(dashboardData.previsoes?.economia || 0)
                }}</span
              >
              <span
                class="metric-trend"
                :class="
                  getTrendClass(dashboardData.previsoes?.tendenciaEconomia)
                "
              >
                {{ getTrendIcon(dashboardData.previsoes?.tendenciaEconomia) }}
              </span>
            </div>
          </div>
          <div class="forecast-alerts">
            <h5>Alertas de Previsão</h5>
            <div
              v-for="alerta in dashboardData.previsoes?.alertas"
              :key="alerta.id"
              class="forecast-alert"
              :class="alerta.tipo"
            >
              <span class="alert-icon">⚠️</span>
              <span class="alert-message">{{ alerta.mensagem }}</span>
              <span class="alert-probability">{{ alerta.probabilidade }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="carregando" class="loading-overlay premium">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Processando análises avançadas...</p>
        <div class="loading-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressoCarregamento + '%' }"
            ></div>
          </div>
          <span>{{ progressoCarregamento }}%</span>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes Avançados -->
    <AdvancedAnalyticsModal
      v-if="modalAberto"
      :dados="modalDados"
      :tipo="modalTipo"
      @fechar="fecharModal"
      @exportar="exportarAnalise"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import Chart from "chart.js/auto";
import AdvancedAnalyticsModal from "./AdvancedAnalyticsModal.vue";

export default {
  name: "PremiumDashboard",
  components: {
    AdvancedAnalyticsModal,
  },
  setup() {
    // Refs para estado e dados
    const filters = ref({
      periodo: "mensal",
      comparacao: "periodo_anterior",
      granularidade: "diaria",
      regiao: "todas",
      tipoLoja: "todas",
      faixaPerformance: "todas",
    });

    const dashboardData = ref({});
    const carregando = ref(false);
    const sincronizando = ref(false);
    const progressoCarregamento = ref(0);
    const modalAberto = ref(false);
    const modalDados = ref({});
    const modalTipo = ref("");

    // Refs para controles avançados
    const tendenciaPeriodo = ref("30d");
    const heatmapMetrica = ref("conclusao");
    const correlacaoX = ref("produtividade");
    const correlacaoY = ref("conclusao");
    const filtroAlerta = ref("todos");
    const filtroRecomendacao = ref("todas");
    const benchmarkGrupo = ref("regiao");
    const previsaoHorizonte = ref("30d");

    // Refs para gráficos
    const tendenciaAvancadaChart = ref(null);
    const correlacaoChart = ref(null);
    const benchmarkChart = ref(null);
    const previsaoChart = ref(null);

    // Instâncias dos gráficos
    let tendenciaAvancadaChartInstance = null;
    let correlacaoChartInstance = null;
    let benchmarkChartInstance = null;
    let previsaoChartInstance = null;

    // Computed
    const dataAtual = computed(() => {
      return new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    const ultimaAtualizacao = computed(() => {
      return new Date().toLocaleTimeString("pt-BR");
    });

    const alertasFiltrados = computed(() => {
      if (!dashboardData.value.alertas) return [];
      if (filtroAlerta.value === "todos") return dashboardData.value.alertas;
      return dashboardData.value.alertas.filter((alerta) =>
        filtroAlerta.value === "criticos"
          ? alerta.severidade === "critica"
          : filtroAlerta.value === "oportunidades"
          ? alerta.tipo === "oportunidade"
          : true
      );
    });

    const recomendacoesFiltradas = computed(() => {
      if (!dashboardData.value.recomendacoes) return [];
      if (filtroRecomendacao.value === "todas")
        return dashboardData.value.recomendacoes;
      return dashboardData.value.recomendacoes.filter((rec) =>
        filtroRecomendacao.value === "alta"
          ? rec.impacto === "alto"
          : filtroRecomendacao.value === "rapida"
          ? rec.esforço === "baixo"
          : filtroRecomendacao.value === "baixo_custo"
          ? rec.custo === "baixo"
          : true
      );
    });

    // Constantes
    const periodosTendencia = ["7d", "30d", "90d", "1a"];
    const horizontesPrevisao = ["7d", "30d", "90d", "1a"];
    const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

    // Métodos principais
    const carregarDadosPremium = async () => {
      carregando.value = true;
      progressoCarregamento.value = 0;

      try {
        // Simular carregamento progressivo
        const interval = setInterval(() => {
          progressoCarregamento.value += Math.random() * 10;
          if (progressoCarregamento.value >= 100) {
            clearInterval(interval);
          }
        }, 200);

        const dados = await simularDadosPremium();
        dashboardData.value = dados;

        setTimeout(() => {
          inicializarGraficosAvancados();
          carregando.value = false;
        }, 1500);
      } catch (error) {
        console.error("Erro ao carregar dados premium:", error);
        carregando.value = false;
      }
    };

    const simularDadosPremium = async () => {
      // Dados simulados extremamente ricos baseados nos modelos
      return {
        indicadores: {
          saudeOperacional: 82,
          engajamentoUsuarios: 76,
          eficienciaProcessos: 88,
          qualidadeDados: 91,
          impactoFinanceiro: 125000,
        },
        totais: {
          totalLojas: 15,
          lojasAtivas: 12,
          totalUsuarios: 156,
          usuariosAtivos: 89,
          usuariosOnline: 23,
          itensProcessados: 45892,
          itensProcessadosMinuto: 12,
          auditoriasAtivas: 8,
          percentualConclusaoGeral: 78.5,
        },
        tendencias: {
          crescimentoItens: 12.5,
          melhoriaQualidade: 8.2,
          crescimentoUsuarios: 5.7,
          velocidadeProcessamento: 3.2,
          auditoriasAtivas: -2.1,
          usuariosOnline: 4.8,
        },
        rupturas: {
          custoTotalRuptura: 125000,
          economiaEstimada: 87500,
          rupturasMinuto: 2,
        },
        kpis: [
          {
            id: 1,
            nome: "Taxa de Conclusão",
            icone: "✅",
            valor: 78.5,
            meta: 85,
            variacao: -7.6,
            formato: "percentual",
          },
          {
            id: 2,
            nome: "Produtividade",
            icone: "⚡",
            valor: 125,
            meta: 140,
            variacao: -10.7,
            formato: "numerico",
          },
          {
            id: 3,
            nome: "Qualidade",
            icone: "🎯",
            valor: 91.2,
            meta: 90,
            variacao: 1.3,
            formato: "percentual",
          },
          {
            id: 4,
            nome: "Custo Ruptura",
            icone: "💰",
            valor: 125000,
            meta: 100000,
            variacao: 25,
            formato: "monetario",
          },
          {
            id: 5,
            nome: "Engajamento",
            icone: "👥",
            valor: 76.3,
            meta: 80,
            variacao: -4.6,
            formato: "percentual",
          },
          {
            id: 6,
            nome: "Eficiência",
            icone: "🏃",
            valor: 88.7,
            meta: 85,
            variacao: 4.3,
            formato: "percentual",
          },
        ],
        insightsTendencia: [
          {
            id: 1,
            tipo: "positivo",
            titulo: "Crescimento Consistente",
            descricao: "Aumento de 12.5% no volume processado",
            impacto: "Alto",
          },
          {
            id: 2,
            tipo: "alerta",
            titulo: "Queda na Produtividade",
            descricao: "Redução de 10.7% na produtividade média",
            impacto: "Médio",
          },
          {
            id: 3,
            tipo: "oportunidade",
            titulo: "Otimização de Processos",
            descricao: "Potencial de economia de R$ 45.000 com otimizações",
            impacto: "Alto",
          },
        ],
        heatmapLocais: [
          { id: 1, nome: "G01A", valor: 92 },
          { id: 2, nome: "G01B", valor: 85 },
          { id: 3, nome: "G02A", valor: 78 },
          { id: 4, nome: "G02B", valor: 88 },
          { id: 5, nome: "G03A", valor: 82 },
          { id: 6, nome: "G03B", valor: 79 },
          { id: 7, nome: "FLV", valor: 91 },
          { id: 8, nome: "C01", valor: 76 },
          { id: 9, nome: "CS01", valor: 84 },
          { id: 10, nome: "F01", valor: 81 },
          { id: 11, nome: "F02", valor: 87 },
          { id: 12, nome: "G04A", valor: 83 },
        ],
        correlacao: {
          coeficiente: 0.78,
          significancia: "Alta",
          rQuadrado: 0.61,
        },
        alertas: [
          {
            id: 1,
            tipo: "performance",
            severidade: "alta",
            prioridade: "alta",
            titulo: "Queda Crítica na Produtividade",
            descricao: "Redução de 25% na produtividade da loja centro",
            metricas: [
              { nome: "Produtividade", valor: "-25%" },
              { nome: "Itens Processados", valor: "1.2k" },
              { nome: "Tempo Médio", valor: "+3.2min" },
            ],
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: 2,
            tipo: "ruptura",
            severidade: "critica",
            prioridade: "urgente",
            titulo: "Ruptura em Produtos Críticos",
            descricao: "5 produtos de alto giro com ruptura crítica",
            metricas: [
              { nome: "Produtos Afetados", valor: "5" },
              { nome: "Custo Estimado", valor: "R$ 12.5k" },
              { nome: "Tempo de Ruptura", valor: "48h" },
            ],
            timestamp: new Date(Date.now() - 7200000),
          },
          {
            id: 3,
            tipo: "oportunidade",
            severidade: "media",
            prioridade: "media",
            titulo: "Otimização de Processo Disponível",
            descricao: "Nova metodologia pode aumentar eficiência em 15%",
            metricas: [
              { nome: "Ganho Potencial", valor: "+15%" },
              { nome: "ROI Estimado", valor: "R$ 8.2k" },
              { nome: "Implementação", valor: "7 dias" },
            ],
            timestamp: new Date(Date.now() - 10800000),
          },
        ],
        recomendacoes: [
          {
            id: 1,
            categoria: "processo",
            titulo: "Otimização de Roteiro de Auditoria",
            descricao:
              "Reorganizar sequência de auditoria para reduzir tempo de deslocamento",
            impacto: "alto",
            roi: "R$ 15.200/ano",
            esforço: "médio",
            prazo: "2 semanas",
            custo: "baixo",
          },
          {
            id: 2,
            categoria: "tecnologia",
            titulo: "Implementar Scanner Inteligente",
            descricao:
              "Utilizar tecnologia de reconhecimento de imagem para acelerar leitura",
            impacto: "muito alto",
            roi: "R$ 45.800/ano",
            esforço: "alto",
            prazo: "8 semanas",
            custo: "alto",
          },
          {
            id: 3,
            categoria: "treinamento",
            titulo: "Capacitação em Produtividade",
            descricao: "Treinamento focado em técnicas de auditoria eficiente",
            impacto: "médio",
            roi: "R$ 8.500/ano",
            esforço: "baixo",
            prazo: "1 semana",
            custo: "baixo",
          },
        ],
        benchmark: {
          quartil: "Q3",
          percentil: 72,
          gapLider: 18.5,
          areasMelhoria: [
            "Velocidade de processamento de etiquetas",
            "Taxa de ruptura em produtos perecíveis",
            "Engajamento de usuários temporários",
          ],
        },
        previsoes: {
          conclusao: 82.3,
          confianca: 87,
          economia: 156000,
          tendenciaEconomia: 12.5,
          alertas: [
            {
              id: 1,
              tipo: "alerta",
              mensagem: "Possível queda na produtividade em 15 dias",
              probabilidade: 65,
            },
            {
              id: 2,
              tipo: "oportunidade",
              mensagem: "Pico de eficiência esperado na próxima semana",
              probabilidade: 78,
            },
          ],
        },
      };
    };

    const inicializarGraficosAvancados = () => {
      // Implementação dos gráficos avançados...
      // Gráfico de Tendência Avançada
      if (tendenciaAvancadaChart.value) {
        const ctx = tendenciaAvancadaChart.value.getContext("2d");
        tendenciaAvancadaChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: [
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez",
            ],
            datasets: [
              {
                label: "Performance Real",
                data: [65, 68, 72, 75, 78, 82, 85, 83, 81, 79, 82, 85],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                tension: 0.4,
                fill: true,
              },
              {
                label: "Meta",
                data: [70, 72, 75, 78, 80, 82, 84, 85, 85, 85, 86, 87],
                borderColor: "rgb(255, 99, 132)",
                borderDash: [5, 5],
                tension: 0.4,
                fill: false,
              },
              {
                label: "Previsão",
                data: [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  84,
                  88,
                ],
                borderColor: "rgb(153, 102, 255)",
                borderDash: [3, 3],
                tension: 0.4,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: "Evolução da Performance vs Meta" },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              y: {
                min: 60,
                max: 100,
                ticks: { callback: (value) => value + "%" },
              },
            },
          },
        });
      }

      // Gráfico de Correlação (Scatter Plot)
      if (correlacaoChart.value) {
        const ctx = correlacaoChart.value.getContext("2d");
        correlacaoChartInstance = new Chart(ctx, {
          type: "scatter",
          data: {
            datasets: [
              {
                label: "Lojas",
                data: [
                  { x: 65, y: 70 },
                  { x: 72, y: 75 },
                  { x: 78, y: 82 },
                  { x: 82, y: 85 },
                  { x: 75, y: 78 },
                  { x: 68, y: 72 },
                  { x: 85, y: 88 },
                  { x: 79, y: 81 },
                  { x: 88, y: 90 },
                  { x: 72, y: 76 },
                  { x: 81, y: 83 },
                  { x: 76, y: 79 },
                ],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgb(75, 192, 192)",
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Produtividade: ${context.parsed.x}%, Conclusão: ${context.parsed.y}%`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Produtividade (%)" },
                min: 60,
                max: 100,
              },
              y: {
                title: { display: true, text: "Taxa de Conclusão (%)" },
                min: 60,
                max: 100,
              },
            },
          },
        });
      }
    };

    // Métodos auxiliares avançados
    const getHeatmapColor = (valor) => {
      if (valor >= 90) return "#10b981";
      if (valor >= 80) return "#84cc16";
      if (valor >= 70) return "#eab308";
      if (valor >= 60) return "#f97316";
      return "#ef4444";
    };

    const getKpiClass = (valor, meta) => {
      const percentual = (valor / meta) * 100;
      if (percentual >= 100) return "excellent";
      if (percentual >= 90) return "good";
      if (percentual >= 80) return "warning";
      return "critical";
    };

    const getVarianceClass = (variacao) => {
      return variacao >= 0 ? "positive" : "negative";
    };

    const getProgressClass = (valor, meta) => {
      const percentual = (valor / meta) * 100;
      if (percentual >= 100) return "excellent";
      if (percentual >= 90) return "good";
      if (percentual >= 80) return "warning";
      return "critical";
    };

    const getInsightIcon = (tipo) => {
      const icons = {
        positivo: "📈",
        alerta: "⚠️",
        oportunidade: "💡",
      };
      return icons[tipo] || "ℹ️";
    };

    const getAlertIcon = (tipo) => {
      const icons = {
        performance: "⚡",
        ruptura: "💰",
        oportunidade: "💡",
        qualidade: "🎯",
        usuario: "👥",
      };
      return icons[tipo] || "⚠️";
    };

    const getRecommendationIcon = (categoria) => {
      const icons = {
        processo: "🔄",
        tecnologia: "💻",
        treinamento: "🎓",
        estrategia: "🎯",
      };
      return icons[categoria] || "💡";
    };

    const getConfidenceClass = (confianca) => {
      if (confianca >= 90) return "high";
      if (confianca >= 70) return "medium";
      return "low";
    };

    const formatarTempoRelativo = (data) => {
      const agora = new Date();
      const diffMs = agora - new Date(data);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return "Agora mesmo";
      if (diffMins < 60) return `Há ${diffMins} min`;
      if (diffHours < 24) return `Há ${diffHours} h`;
      return `Há ${Math.floor(diffHours / 24)} dias`;
    };

    // Métodos de ação
    const aplicarFiltrosAvancados = () => {
      carregarDadosPremium();
    };

    const resetarFiltros = () => {
      filters.value = {
        periodo: "mensal",
        comparacao: "periodo_anterior",
        granularidade: "diaria",
        regiao: "todas",
        tipoLoja: "todas",
        faixaPerformance: "todas",
      };
      carregarDadosPremium();
    };

    const investigarAlerta = (alerta) => {
      modalTipo.value = "alerta";
      modalDados.value = alerta;
      modalAberto.value = true;
    };

    const implementarRecomendacao = (recomendacao) => {
      console.log("Implementando recomendação:", recomendacao);
      // Implementar lógica de ação
    };

    // Lifecycle
    onMounted(() => {
      carregarDadosPremium();
      // Iniciar sincronização em tempo real
      setInterval(() => {
        sincronizando.value = true;
        setTimeout(() => {
          sincronizando.value = false;
        }, 2000);
      }, 30000);
    });

    return {
      // Refs
      filters,
      dashboardData,
      carregando,
      sincronizando,
      progressoCarregamento,
      modalAberto,
      modalDados,
      modalTipo,
      tendenciaPeriodo,
      heatmapMetrica,
      correlacaoX,
      correlacaoY,
      filtroAlerta,
      filtroRecomendacao,
      benchmarkGrupo,
      previsaoHorizonte,
      tendenciaAvancadaChart,
      correlacaoChart,
      benchmarkChart,
      previsaoChart,

      // Computed
      dataAtual,
      ultimaAtualizacao,
      alertasFiltrados,
      recomendacoesFiltradas,

      // Constantes
      periodosTendencia,
      horizontesPrevisao,
      regioes,

      // Métodos
      carregarDadosPremium,
      aplicarFiltrosAvancados,
      resetarFiltros,
      investigarAlerta,
      implementarRecomendacao,
      getHeatmapColor,
      getKpiClass,
      getVarianceClass,
      getProgressClass,
      getInsightIcon,
      getAlertIcon,
      getRecommendationIcon,
      getConfidenceClass,
      formatarTempoRelativo,
      formatarNumero: (num) => new Intl.NumberFormat("pt-BR").format(num),
      formatarMoeda: (valor) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor),
      getTrendClass: (valor) =>
        valor > 0 ? "positive" : valor < 0 ? "negative" : "neutral",
      getTrendIcon: (valor) => (valor > 0 ? "📈" : valor < 0 ? "📉" : "➡️"),
    };
  },
};
</script>

<style scoped>
/* Estilos premium - muito mais elaborados */
.premium-dashboard {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.dashboard-header.premium {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-title h1 {
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5em;
  font-weight: 700;
}

.header-title p {
  margin: 5px 0 0 0;
  color: #6c757d;
  font-size: 1.1em;
}

.header-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
  padding: 15px 25px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.stat-value {
  display: block;
  font-size: 1.8em;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.9em;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.advanced-filters {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 15px;
  padding: 25px;
}

.filter-section {
  margin-bottom: 25px;
}

.filter-section h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-weight: 600;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.85em;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-group select {
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filter-group select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

/* Cards de análise premium */
.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analysis-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3em;
  font-weight: 600;
}

/* Scorecard Grid */
.scorecard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.scorecard-item {
  background: rgba(248, 249, 250, 0.8);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.scorecard-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.kpi-icon {
  font-size: 1.5em;
}

.kpi-title {
  font-weight: 600;
  color: #495057;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 5px;
}

.kpi-value.excellent {
  color: #10b981;
}
.kpi-value.good {
  color: #84cc16;
}
.kpi-value.warning {
  color: #eab308;
}
.kpi-value.critical {
  color: #ef4444;
}

.kpi-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.8em;
}

.kpi-target {
  color: #6c757d;
}

.kpi-variance.positive {
  color: #10b981;
}
.kpi-variance.negative {
  color: #ef4444;
}

/* Heatmap */
.heatmap-container {
  margin-top: 15px;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.8em;
  color: #6c757d;
}

.legend-gradient {
  flex: 1;
  height: 8px;
  margin: 0 10px;
  background: linear-gradient(90deg, #ef4444, #eab308, #84cc16, #10b981);
  border-radius: 4px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.heatmap-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.local-name {
  font-size: 0.7em;
  opacity: 0.9;
}

.local-value {
  font-size: 0.9em;
  font-weight: 700;
}

/* Alertas Inteligentes */
.alerts-panel {
  max-height: 600px;
  overflow-y: auto;
}

.intelligent-alert {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  border-left: 4px solid;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.intelligent-alert:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.intelligent-alert.severity-critica {
  border-left-color: #ef4444;
  background: #fef2f2;
}
.intelligent-alert.severity-alta {
  border-left-color: #f97316;
  background: #fff7ed;
}
.intelligent-alert.severity-media {
  border-left-color: #eab308;
  background: #fefce8;
}
.intelligent-alert.severity-baixa {
  border-left-color: #84cc16;
  background: #f7fee7;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.alert-icon {
  font-size: 1.2em;
}

.alert-title {
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.alert-priority {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: 600;
  text-transform: uppercase;
}

.alert-priority.urgente {
  background: #ef4444;
  color: white;
}
.alert-priority.alta {
  background: #f97316;
  color: white;
}
.alert-priority.media {
  background: #eab308;
  color: #1f2937;
}
.alert-priority.baixa {
  background: #84cc16;
  color: white;
}

.alert-body p {
  margin: 0 0 10px 0;
  color: #6b7280;
  line-height: 1.5;
}

.alert-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
}

.metric-name {
  color: #6b7280;
}

.metric-value {
  font-weight: 600;
  color: #1f2937;
}

.alert-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

.alert-time {
  font-size: 0.8em;
  color: #9ca3af;
}

.alert-actions {
  display: flex;
  gap: 8px;
}

/* Loading Premium */
.loading-overlay.premium {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-progress {
  margin-top: 20px;
}

.progress-bar {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin: 0 auto 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Botões Premium */
.btn-primary,
.btn-secondary,
.btn-outline,
.btn-sm,
.btn-icon {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8em;
}

.btn-icon {
  padding: 8px;
  background: transparent;
  color: #6c757d;
}

.btn-icon:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

/* Responsividade */
@media (max-width: 1400px) {
  .analytics-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1024px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .header-main {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .header-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .premium-dashboard {
    padding: 10px;
  }

  .scorecard-grid {
    grid-template-columns: 1fr;
  }

  .heatmap-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
