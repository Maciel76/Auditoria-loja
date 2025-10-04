<template>
  <div class="auditoria-tipos-desempenho-container">
    <!-- Cabeçalho da Seção -->
    <div class="section-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">📊</div>
          <div class="title-content">
            <h2>Análise de Auditorias</h2>
            <p>Distribuição por categoria e desempenho por setor</p>
          </div>
        </div>
        <div class="header-controls">
          <div class="filter-group">
            <div class="filter-item">
              <label class="filter-label">Período:</label>
              <select v-model="periodoSelecionado" class="filter-select">
                <option
                  v-for="periodo in periodos"
                  :key="periodo.value"
                  :value="periodo.value"
                >
                  {{ periodo.label }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Visualização:</label>
              <select v-model="visualizacaoSelecionada" class="filter-select">
                <option
                  v-for="vis in visualizacoes"
                  :key="vis.value"
                  :value="vis.value"
                >
                  {{ vis.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="header-actions">
            <button class="action-btn secondary" @click="exportarDados">
              📥 Exportar Dados
            </button>
            <button class="action-btn primary" @click="alternarVista">
              {{ vistaDetalhada ? "Vista Simplificada" : "Vista Detalhada" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon distribuição">📋</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalAuditorias }}</div>
            <div class="summary-label">Total de Auditorias</div>
            <div class="summary-trend positive">+12% vs anterior</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon desempenho">🎯</div>
          <div class="summary-content">
            <div class="summary-value">{{ desempenhoMedio }}%</div>
            <div class="summary-label">Desempenho Médio</div>
            <div class="summary-trend positive">+5.2%</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon setor-destaque">🏆</div>
          <div class="summary-content">
            <div class="summary-value">{{ setorDestaque.nome }}</div>
            <div class="summary-label">Setor em Destaque</div>
            <div class="summary-trend positive">
              {{ setorDestaque.desempenho }}%
            </div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon tipo-predominante">📈</div>
          <div class="summary-content">
            <div class="summary-value">{{ tipoPredominante.nome }}</div>
            <div class="summary-label">Tipo Predominante</div>
            <div class="summary-trend">{{ tipoPredominante.percentual }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Principal de Gráficos -->
    <div class="graficos-main-section">
      <div class="graficos-grid">
        <!-- Tipos de Auditoria -->
        <div
          class="grafico-card tipos-auditoria"
          :class="{ expanded: vistaDetalhada }"
        >
          <div class="grafico-header">
            <div class="grafico-title">
              <h3>📋 Tipos de Auditoria</h3>
              <p>Distribuição por categoria</p>
            </div>
            <div class="grafico-actions">
              <button
                class="action-icon"
                @click="alternarVistaTipos"
                title="Alternar vista"
              >
                🔄
              </button>
            </div>
          </div>

          <div class="grafico-content">
            <div class="chart-container">
              <canvas ref="graficoRosca"></canvas>
            </div>

            <div class="detalhes-distribuicao" v-if="vistaDetalhada">
              <div class="distribuicao-stats">
                <div class="stat-item">
                  <span class="stat-label">Total de Itens:</span>
                  <span class="stat-value">{{ totalItensAuditorados }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Conformidade:</span>
                  <span class="stat-value">{{ conformidadeGeral }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Taxa de Ruptura:</span>
                  <span class="stat-value">{{ taxaRuptura }}%</span>
                </div>
              </div>

              <div class="evolucao-tipos">
                <h4>Evolução por Tipo</h4>
                <div class="evolucao-list">
                  <div
                    v-for="tipo in evolucaoTipos"
                    :key="tipo.nome"
                    class="evolucao-item"
                  >
                    <div class="tipo-info">
                      <div
                        class="tipo-color"
                        :style="{ background: tipo.cor }"
                      ></div>
                      <span class="tipo-name">{{ tipo.nome }}</span>
                    </div>
                    <div class="tipo-evolucao">
                      <span
                        class="evolucao-value"
                        :class="tipo.variacao >= 0 ? 'positive' : 'negative'"
                      >
                        {{ tipo.variacao >= 0 ? "+" : "" }}{{ tipo.variacao }}%
                      </span>
                      <span class="evolucao-periodo">vs anterior</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="legenda-tipos" v-else>
              <div
                v-for="tipo in distribuicaoTipos"
                :key="tipo.nome"
                class="legenda-item"
              >
                <div
                  class="legenda-color"
                  :style="{ background: tipo.cor }"
                ></div>
                <span class="legenda-name">{{ tipo.nome }}</span>
                <span class="legenda-value"
                  >{{ tipo.quantidade }} ({{ tipo.percentual }}%)</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Desempenho por Setor -->
        <div
          class="grafico-card desempenho-setor"
          :class="{ expanded: vistaDetalhada }"
        >
          <div class="grafico-header">
            <div class="grafico-title">
              <h3>🎯 Desempenho por Setor</h3>
              <p>Análise comparativa entre áreas</p>
            </div>
            <div class="grafico-actions">
              <button
                class="action-icon"
                @click="alternarVistaSetores"
                title="Alternar vista"
              >
                🔄
              </button>
            </div>
          </div>

          <div class="grafico-content">
            <div class="chart-container">
              <canvas ref="graficoRadar"></canvas>
            </div>

            <div class="detalhes-setores" v-if="vistaDetalhada">
              <div class="setores-ranking">
                <h4>Ranking de Setores</h4>
                <div class="ranking-list">
                  <div
                    v-for="(setor, index) in rankingSetores"
                    :key="setor.nome"
                    class="ranking-item"
                  >
                    <div class="ranking-position">
                      <span class="position-number">{{ index + 1 }}</span>
                      <div class="position-medal" v-if="index < 3">
                        {{ ["🥇", "🥈", "🥉"][index] }}
                      </div>
                    </div>
                    <div class="ranking-info">
                      <span class="setor-name">{{ setor.nome }}</span>
                      <span class="setor-desempenho"
                        >{{ setor.desempenho }}%</span
                      >
                    </div>
                    <div
                      class="ranking-variacao"
                      :class="setor.variacao >= 0 ? 'positive' : 'negative'"
                    >
                      {{ setor.variacao >= 0 ? "+" : "" }}{{ setor.variacao }}%
                    </div>
                  </div>
                </div>
              </div>

              <div class="setores-metrics">
                <div class="metric-card">
                  <div class="metric-icon">📊</div>
                  <div class="metric-content">
                    <div class="metric-value">
                      {{ setorMaiorVariacao.nome }}
                    </div>
                    <div class="metric-label">Maior Crescimento</div>
                    <div class="metric-detail">
                      +{{ setorMaiorVariacao.variacao }}%
                    </div>
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-icon">⚠️</div>
                  <div class="metric-content">
                    <div class="metric-value">
                      {{ setorMenorDesempenho.nome }}
                    </div>
                    <div class="metric-label">Necessita Atenção</div>
                    <div class="metric-detail">
                      {{ setorMenorDesempenho.desempenho }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="legenda-desempenho" v-else>
              <div class="legenda-categories">
                <div class="category-item">
                  <div class="category-color excelente"></div>
                  <span>Excelente (90-100%)</span>
                </div>
                <div class="category-item">
                  <div class="category-color bom"></div>
                  <span>Bom (80-89%)</span>
                </div>
                <div class="category-item">
                  <div class="category-color atencao"></div>
                  <span>Atenção (70-79%)</span>
                </div>
                <div class="category-item">
                  <div class="category-color critico"></div>
                  <span>Crítico (&lt;70%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Análise Comparativa Detalhada -->
    <div class="analise-comparativa-section" v-if="vistaDetalhada">
      <div class="analise-header">
        <h3>📈 Análise Comparativa Detalhada</h3>
        <div class="analise-periodo">Período: {{ periodoAtual.label }}</div>
      </div>

      <div class="comparativa-grid">
        <!-- Matriz de Performance -->
        <div class="analise-card matriz-performance">
          <h4>🎯 Matriz de Performance</h4>
          <div class="matriz-container">
            <div class="matriz-axes">
              <div class="axis-y">Alto Desempenho</div>
              <div class="axis-x">Baixa Frequência → Alta Frequência</div>
            </div>
            <div class="matriz-points">
              <div
                v-for="setor in matrizPerformance"
                :key="setor.nome"
                class="matriz-point"
                :style="{
                  left: setor.posicaoX + '%',
                  bottom: setor.posicaoY + '%',
                }"
                :class="setor.quadrante"
              >
                <div class="point-tooltip">
                  <strong>{{ setor.nome }}</strong
                  ><br />
                  Desempenho: {{ setor.desempenho }}%<br />
                  Frequência: {{ setor.frequencia }}
                </div>
              </div>
            </div>
            <div class="matriz-quadrantes">
              <div class="quadrante q1">Estrelas</div>
              <div class="quadrante q2">Priorizar</div>
              <div class="quadrante q3">Oportunidades</div>
              <div class="quadrante q4">Manter</div>
            </div>
          </div>
        </div>

        <!-- Insights e Recomendações -->
        <div class="analise-card insights-recomendacoes">
          <h4>💡 Insights e Recomendações</h4>
          <div class="insights-list">
            <div
              v-for="insight in insightsRecomendacoes"
              :key="insight.id"
              class="insight-item"
              :class="insight.tipo"
            >
              <div class="insight-icon">{{ insight.icone }}</div>
              <div class="insight-content">
                <div class="insight-title">{{ insight.titulo }}</div>
                <div class="insight-desc">{{ insight.descricao }}</div>
                <div class="insight-actions">
                  <button
                    v-for="acao in insight.acoes"
                    :key="acao"
                    class="insight-action-btn"
                    @click="executarAcao(insight, acao)"
                  >
                    {{ acao }}
                  </button>
                </div>
              </div>
              <div class="insight-priority" :class="insight.prioridade">
                {{ insight.prioridade }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela de Métricas por Setor -->
        <div class="analise-card metricas-setor">
          <h4>📊 Métricas Detalhadas por Setor</h4>
          <div class="metricas-table-container">
            <table class="metricas-table">
              <thead>
                <tr>
                  <th>Setor</th>
                  <th>Desempenho</th>
                  <th>Meta</th>
                  <th>Conformidade</th>
                  <th>Ruptura</th>
                  <th>Tendência</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="setor in metricasSetores"
                  :key="setor.nome"
                  :class="getStatusLinha(setor)"
                >
                  <td class="setor-cell">
                    <div class="setor-info">
                      <div class="setor-icon">{{ setor.icone }}</div>
                      <span>{{ setor.nome }}</span>
                    </div>
                  </td>
                  <td class="desempenho-cell">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: setor.desempenho + '%' }"
                        :class="getClasseDesempenho(setor.desempenho)"
                      ></div>
                      <span class="progress-text">{{ setor.desempenho }}%</span>
                    </div>
                  </td>
                  <td class="meta-cell">{{ setor.meta }}%</td>
                  <td class="conformidade-cell">{{ setor.conformidade }}%</td>
                  <td class="ruptura-cell">{{ setor.ruptura }}%</td>
                  <td
                    class="tendencia-cell"
                    :class="setor.tendencia >= 0 ? 'positive' : 'negative'"
                  >
                    {{ setor.tendencia >= 0 ? "+" : "" }}{{ setor.tendencia }}%
                  </td>
                  <td class="status-cell">
                    <span class="status-badge" :class="getStatusSetor(setor)">
                      {{ getStatusSetor(setor) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer com Ações Rápidas -->
    <div class="footer-actions">
      <div class="actions-grid">
        <button class="footer-btn" @click="gerarRelatorioCompleto">
          📄 Gerar Relatório Completo
        </button>
        <button class="footer-btn" @click="agendarAuditoria">
          🗓️ Agendar Nova Auditoria
        </button>
        <button class="footer-btn" @click="configurarMetas">
          🎯 Configurar Metas
        </button>
        <button class="footer-btn" @click="compartilharResultados">
          📤 Compartilhar Resultados
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import {
  Chart,
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Registrar componentes do Chart.js
Chart.register(
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

// Refs para os gráficos
const graficoRosca = ref(null);
const graficoRadar = ref(null);

// Instâncias dos gráficos
const graficoRoscaInstance = ref(null);
const graficoRadarInstance = ref(null);

// Estado do componente
const periodoSelecionado = ref("month");
const visualizacaoSelecionada = ref("comparativo");
const vistaDetalhada = ref(false);

// Dados de configuração
const periodos = [
  { label: "Última Semana", value: "week" },
  { label: "Último Mês", value: "month" },
  { label: "Último Trimestre", value: "quarter" },
  { label: "Último Ano", value: "year" },
];

const visualizacoes = [
  { label: "Visão Comparativa", value: "comparativo" },
  { label: "Visão por Desempenho", value: "desempenho" },
  { label: "Visão por Frequência", value: "frequencia" },
];

// Dados dos gráficos
const dadosGraficos = {
  week: {
    tipos: [
      { nome: "Etiquetas", quantidade: 25, cor: "#667eea", variacao: 5.2 },
      { nome: "Presença", quantidade: 10, cor: "#4CAF50", variacao: 2.1 },
      { nome: "Ruptura", quantidade: 5, cor: "#FF9800", variacao: -1.5 },
      { nome: "Qualidade", quantidade: 8, cor: "#9C27B0", variacao: 3.8 },
    ],
    setores: [
      {
        nome: "Hortifruti",
        desempenho: 95,
        variacao: 3.2,
        icone: "🥦",
        meta: 90,
        conformidade: 96,
        ruptura: 2,
        tendencia: 2.1,
      },
      {
        nome: "Açougue",
        desempenho: 88,
        variacao: 1.8,
        icone: "🥩",
        meta: 85,
        conformidade: 89,
        ruptura: 5,
        tendencia: 0.8,
      },
      {
        nome: "Padaria",
        desempenho: 91,
        variacao: 4.2,
        icone: "🍞",
        meta: 88,
        conformidade: 92,
        ruptura: 3,
        tendencia: 3.5,
      },
      {
        nome: "Laticínios",
        desempenho: 94,
        variacao: 2.5,
        icone: "🥛",
        meta: 90,
        conformidade: 95,
        ruptura: 1,
        tendencia: 1.9,
      },
      {
        nome: "Mercearia",
        desempenho: 89,
        variacao: 0.9,
        icone: "🛒",
        meta: 87,
        conformidade: 90,
        ruptura: 4,
        tendencia: 0.5,
      },
      {
        nome: "Bebidas",
        desempenho: 76,
        variacao: -2.1,
        icone: "🥤",
        meta: 80,
        conformidade: 78,
        ruptura: 8,
        tendencia: -1.2,
      },
    ],
  },
  month: {
    tipos: [
      { nome: "Etiquetas", quantidade: 150, cor: "#667eea", variacao: 8.5 },
      { nome: "Presença", quantidade: 75, cor: "#4CAF50", variacao: 4.2 },
      { nome: "Ruptura", quantidade: 25, cor: "#FF9800", variacao: -3.2 },
      { nome: "Qualidade", quantidade: 50, cor: "#9C27B0", variacao: 6.8 },
    ],
    setores: [
      {
        nome: "Hortifruti",
        desempenho: 92,
        variacao: 5.1,
        icone: "🥦",
        meta: 90,
        conformidade: 94,
        ruptura: 3,
        tendencia: 4.2,
      },
      {
        nome: "Açougue",
        desempenho: 85,
        variacao: 3.2,
        icone: "🥩",
        meta: 85,
        conformidade: 87,
        ruptura: 6,
        tendencia: 2.8,
      },
      {
        nome: "Padaria",
        desempenho: 89,
        variacao: 6.5,
        icone: "🍞",
        meta: 88,
        conformidade: 91,
        ruptura: 4,
        tendencia: 5.1,
      },
      {
        nome: "Laticínios",
        desempenho: 91,
        variacao: 4.8,
        icone: "🥛",
        meta: 90,
        conformidade: 93,
        ruptura: 2,
        tendencia: 3.9,
      },
      {
        nome: "Mercearia",
        desempenpenho: 87,
        variacao: 2.1,
        icone: "🛒",
        meta: 87,
        conformidade: 89,
        ruptura: 5,
        tendencia: 1.5,
      },
      {
        nome: "Bebidas",
        desempenho: 78,
        variacao: -1.5,
        icone: "🥤",
        meta: 80,
        conformidade: 80,
        ruptura: 7,
        tendencia: -2.3,
      },
    ],
  },
};

// Computed properties
const dadosAtuais = computed(() => {
  return dadosGraficos[periodoSelecionado.value] || dadosGraficos.month;
});

const periodoAtual = computed(() => {
  return (
    periodos.find((p) => p.value === periodoSelecionado.value) || periodos[0]
  );
});

const distribuicaoTipos = computed(() => {
  const tipos = dadosAtuais.value.tipos;
  const total = tipos.reduce((sum, tipo) => sum + tipo.quantidade, 0);

  return tipos.map((tipo) => ({
    ...tipo,
    percentual: Math.round((tipo.quantidade / total) * 100),
  }));
});

const desempenhoSetores = computed(() => {
  return dadosAtuais.value.setores;
});

const totalAuditorias = computed(() => {
  return distribuicaoTipos.value.reduce(
    (sum, tipo) => sum + tipo.quantidade,
    0
  );
});

const desempenhoMedio = computed(() => {
  const setores = dadosAtuais.value.setores;
  return Math.round(
    setores.reduce((sum, setor) => sum + setor.desempenho, 0) / setores.length
  );
});

const setorDestaque = computed(() => {
  return dadosAtuais.value.setores.reduce((prev, current) =>
    prev.desempenho > current.desempenho ? prev : current
  );
});

const tipoPredominante = computed(() => {
  return distribuicaoTipos.value.reduce((prev, current) =>
    prev.quantidade > current.quantidade ? prev : current
  );
});

const totalItensAuditorados = computed(() => {
  return totalAuditorias.value * 40; // Assumindo 40 itens por auditoria
});

const conformidadeGeral = computed(() => {
  const setores = dadosAtuais.value.setores;
  return Math.round(
    setores.reduce((sum, setor) => sum + setor.conformidade, 0) / setores.length
  );
});

const taxaRuptura = computed(() => {
  const setores = dadosAtuais.value.setores;
  return Math.round(
    setores.reduce((sum, setor) => sum + setor.ruptura, 0) / setores.length
  );
});

const evolucaoTipos = computed(() => {
  return distribuicaoTipos.value;
});

const rankingSetores = computed(() => {
  return [...dadosAtuais.value.setores].sort(
    (a, b) => b.desempenho - a.desempenho
  );
});

const setorMaiorVariacao = computed(() => {
  return dadosAtuais.value.setores.reduce((prev, current) =>
    prev.variacao > current.variacao ? prev : current
  );
});

const setorMenorDesempenho = computed(() => {
  return dadosAtuais.value.setores.reduce((prev, current) =>
    prev.desempenho < current.desempenho ? prev : current
  );
});

const matrizPerformance = computed(() => {
  const setores = dadosAtuais.value.setores;
  const maxFrequencia = Math.max(...setores.map((s) => s.desempenho));

  return setores.map((setor) => {
    const posicaoX = (setor.desempenho / maxFrequencia) * 80 + 10;
    const posicaoY = (setor.desempenho / 100) * 80 + 10;

    let quadrante = "q2"; // Priorizar
    if (setor.desempenho >= 85 && setor.variacao >= 2)
      quadrante = "q1"; // Estrelas
    else if (setor.desempenho >= 80) quadrante = "q4"; // Manter
    else if (setor.variacao < 0) quadrante = "q3"; // Oportunidades

    return {
      ...setor,
      posicaoX,
      posicaoY,
      quadrante,
      frequencia: setor.desempenho, // Usando desempenho como proxy de frequência
    };
  });
});

const insightsRecomendacoes = computed(() => [
  {
    id: 1,
    tipo: "destaque",
    icone: "🚀",
    titulo: "Setor em Excelente Performance",
    descricao:
      "Hortifruti apresenta desempenho consistente acima de 90%. Considere replicar as boas práticas.",
    acoes: ["Documentar Práticas", "Compartilhar Resultados"],
    prioridade: "Alta",
  },
  {
    id: 2,
    tipo: "alerta",
    icone: "⚠️",
    titulo: "Atenção Necessária em Bebidas",
    descricao:
      "Desempenho abaixo da meta com tendência negativa. Necessidade de intervenção imediata.",
    acoes: ["Plano de Ação", "Auditoria Extra"],
    prioridade: "Urgente",
  },
  {
    id: 3,
    tipo: "oportunidade",
    icone: "💡",
    titulo: "Oportunidade em Auditorias de Qualidade",
    descricao:
      "Crescimento de 6.8% neste tipo de auditoria. Expandir para outros setores.",
    acoes: ["Expandir Escopo", "Capacitar Equipe"],
    prioridade: "Média",
  },
]);

const metricasSetores = computed(() => {
  return dadosAtuais.value.setores;
});

// Métodos
const initializeCharts = () => {
  if (!graficoRosca.value || !graficoRadar.value) return;

  // Gráfico de Rosca - Tipos de Auditoria
  graficoRoscaInstance.value = new Chart(graficoRosca.value, {
    type: "doughnut",
    data: {
      labels: distribuicaoTipos.value.map((t) => t.nome),
      datasets: [
        {
          data: distribuicaoTipos.value.map((t) => t.quantidade),
          backgroundColor: distribuicaoTipos.value.map((t) => t.cor),
          borderWidth: 2,
          borderColor: "#ffffff",
          cutout: "65%",
          spacing: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const tipo = distribuicaoTipos.value[context.dataIndex];
              return [
                `${tipo.nome}: ${tipo.quantidade} auditorias`,
                `${tipo.percentual}% do total`,
                `Variação: ${tipo.variacao >= 0 ? "+" : ""}${tipo.variacao}%`,
              ];
            },
          },
        },
      },
      cutout: "65%",
    },
  });

  // Gráfico de Radar - Desempenho por Setor
  graficoRadarInstance.value = new Chart(graficoRadar.value, {
    type: "radar",
    data: {
      labels: desempenhoSetores.value.map((s) => s.nome),
      datasets: [
        {
          label: "Desempenho Atual",
          data: desempenhoSetores.value.map((s) => s.desempenho),
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          borderColor: "#667eea",
          borderWidth: 2,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#667eea",
          pointRadius: 4,
        },
        {
          label: "Meta",
          data: desempenhoSetores.value.map((s) => s.meta),
          borderColor: "#4CAF50",
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: "#4CAF50",
          pointBorderColor: "#fff",
          pointRadius: 3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: "rgba(0,0,0,0.05)",
          },
          suggestedMin: 50,
          suggestedMax: 100,
          ticks: {
            display: false,
            stepSize: 10,
          },
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const setor = desempenhoSetores.value[context.dataIndex];
              return [
                `Desempenho: ${setor.desempenho}%`,
                `Meta: ${setor.meta}%`,
                `Variação: ${setor.variacao >= 0 ? "+" : ""}${setor.variacao}%`,
              ];
            },
          },
        },
      },
    },
  });
};

const updateCharts = () => {
  if (graficoRoscaInstance.value) {
    graficoRoscaInstance.value.data.labels = distribuicaoTipos.value.map(
      (t) => t.nome
    );
    graficoRoscaInstance.value.data.datasets[0].data =
      distribuicaoTipos.value.map((t) => t.quantidade);
    graficoRoscaInstance.value.data.datasets[0].backgroundColor =
      distribuicaoTipos.value.map((t) => t.cor);
    graficoRoscaInstance.value.update();
  }

  if (graficoRadarInstance.value) {
    graficoRadarInstance.value.data.labels = desempenhoSetores.value.map(
      (s) => s.nome
    );
    graficoRadarInstance.value.data.datasets[0].data =
      desempenhoSetores.value.map((s) => s.desempenho);
    graficoRadarInstance.value.data.datasets[1].data =
      desempenhoSetores.value.map((s) => s.meta);
    graficoRadarInstance.value.update();
  }
};

const alternarVista = () => {
  vistaDetalhada.value = !vistaDetalhada.value;
};

const alternarVistaTipos = () => {
  // Implementar alternância de vista específica para tipos
  console.log("Alternando vista de tipos");
};

const alternarVistaSetores = () => {
  // Implementar alternância de vista específica para setores
  console.log("Alternando vista de setores");
};

const getClasseDesempenho = (desempenho) => {
  if (desempenho >= 90) return "excelente";
  if (desempenho >= 80) return "bom";
  if (desempenho >= 70) return "atencao";
  return "critico";
};

const getStatusSetor = (setor) => {
  if (setor.desempenho >= 90) return "excelente";
  if (setor.desempenho >= 80) return "bom";
  if (setor.desempenho >= 70) return "atencao";
  return "critico";
};

const getStatusLinha = (setor) => {
  return {
    "linha-destaque": setor.desempenho >= 90,
    "linha-atencao": setor.desempenho < 70,
  };
};

const exportarDados = () => {
  console.log("Exportando dados...", {
    periodo: periodoSelecionado.value,
    tipos: distribuicaoTipos.value,
    setores: desempenhoSetores.value,
  });
  alert("Dados exportados com sucesso!");
};

const executarAcao = (insight, acao) => {
  console.log(`Executando ação: ${acao} para insight: ${insight.titulo}`);
  alert(`Ação "${acao}" executada para: ${insight.titulo}`);
};

const gerarRelatorioCompleto = () => {
  console.log("Gerando relatório completo...");
  alert("Relatório completo gerado com sucesso!");
};

const agendarAuditoria = () => {
  console.log("Abrindo agendamento de auditoria...");
  alert("Módulo de agendamento aberto!");
};

const configurarMetas = () => {
  console.log("Abrindo configuração de metas...");
  alert("Módulo de metas aberto!");
};

const compartilharResultados = () => {
  console.log("Compartilhando resultados...");
  alert("Resultados compartilhados com sucesso!");
};

// Lifecycle
onMounted(() => {
  initializeCharts();
  window.addEventListener("resize", () => {
    if (graficoRoscaInstance.value) graficoRoscaInstance.value.resize();
    if (graficoRadarInstance.value) graficoRadarInstance.value.resize();
  });
});

onUnmounted(() => {
  if (graficoRoscaInstance.value) graficoRoscaInstance.value.destroy();
  if (graficoRadarInstance.value) graficoRadarInstance.value.destroy();
});

// Watchers
watch(periodoSelecionado, () => {
  updateCharts();
});
</script>

<style scoped>
.auditoria-tipos-desempenho-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
}

/* Header Section */
.section-header {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
}

.title-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.title-content p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

.header-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  gap: 1.5rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
  min-width: 160px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.action-btn.secondary:hover {
  background: #f8fafc;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.summary-icon.distribuição {
  background: rgba(102, 126, 234, 0.1);
}

.summary-icon.desempenho {
  background: rgba(76, 175, 80, 0.1);
}

.summary-icon.setor-destaque {
  background: rgba(255, 193, 7, 0.1);
}

.summary-icon.tipo-predominante {
  background: rgba(156, 39, 176, 0.1);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.summary-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.summary-trend.positive {
  color: #4caf50;
}

/* Gráficos Main Section */
.graficos-main-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.graficos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.grafico-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.grafico-card.expanded {
  grid-column: 1 / -1;
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.grafico-title h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.grafico-title p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.grafico-actions {
  display: flex;
  gap: 0.5rem;
}

.action-icon {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.action-icon:hover {
  background: rgba(0, 0, 0, 0.05);
}

.grafico-content {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.chart-container {
  flex: 1;
  height: 300px;
  position: relative;
}

.legenda-tipos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 200px;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: white;
}

.legenda-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legenda-name {
  flex: 1;
  font-size: 0.9rem;
  color: #4a5568;
}

.legenda-value {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.legenda-desempenho {
  min-width: 200px;
}

.legenda-categories {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.category-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.category-color.excelente {
  background: #4caf50;
}

.category-color.bom {
  background: #ff9800;
}

.category-color.atencao {
  background: #ffeb3b;
}

.category-color.critico {
  background: #f44336;
}

/* Detalhes Expandidos */
.detalhes-distribuicao,
.detalhes-setores {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 300px;
}

.distribuicao-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}

.evolucao-tipos h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.evolucao-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.evolucao-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
}

.tipo-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tipo-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.tipo-name {
  font-weight: 500;
  color: #4a5568;
}

.tipo-evolucao {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.evolucao-value {
  font-weight: 600;
  font-size: 0.9rem;
}

.evolucao-value.positive {
  color: #4caf50;
}

.evolucao-value.negative {
  color: #f44336;
}

.evolucao-periodo {
  font-size: 0.7rem;
  color: #a0aec0;
}

.setores-ranking h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
}

.ranking-position {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.position-number {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1rem;
  min-width: 20px;
}

.position-medal {
  font-size: 1.2rem;
}

.ranking-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setor-name {
  font-weight: 500;
  color: #4a5568;
}

.setor-desempenho {
  font-weight: 600;
  color: #2c3e50;
}

.ranking-variacao {
  font-weight: 600;
  font-size: 0.9rem;
}

.ranking-variacao.positive {
  color: #4caf50;
}

.ranking-variacao.negative {
  color: #f44336;
}

.setores-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.metric-icon {
  font-size: 1.5rem;
}

.metric-value {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.metric-detail {
  font-size: 0.8rem;
  font-weight: 600;
}

/* Análise Comparativa */
.analise-comparativa-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.analise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.analise-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.analise-periodo {
  color: #718096;
  font-size: 0.9rem;
}

.comparativa-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.analise-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.analise-card h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.matriz-performance {
  grid-column: 1;
}

.insights-recomendacoes {
  grid-column: 2;
}

.metricas-setor {
  grid-column: 1 / -1;
}

/* Matriz de Performance */
.matriz-container {
  position: relative;
  height: 300px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.matriz-axes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.axis-y {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 0.8rem;
  color: #718096;
  transform: rotate(-90deg);
  transform-origin: 0 0;
}

.axis-x {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #718096;
}

.matriz-points {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.matriz-point {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.matriz-point:hover {
  transform: translate(-50%, 50%) scale(1.5);
  z-index: 10;
}

.matriz-point.q1 {
  background: #4caf50;
}
.matriz-point.q2 {
  background: #2196f3;
}
.matriz-point.q3 {
  background: #ff9800;
}
.matriz-point.q4 {
  background: #9c27b0;
}

.point-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.matriz-point:hover .point-tooltip {
  opacity: 1;
}

.matriz-quadrantes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.quadrante {
  position: absolute;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.3);
}

.quadrante.q1 {
  top: 10px;
  right: 10px;
  color: #4caf50;
}

.quadrante.q2 {
  top: 10px;
  left: 10px;
  color: #2196f3;
}

.quadrante.q3 {
  bottom: 10px;
  left: 10px;
  color: #ff9800;
}

.quadrante.q4 {
  bottom: 10px;
  right: 10px;
  color: #9c27b0;
}

/* Insights e Recomendações */
.insights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.insight-item:hover {
  transform: translateX(4px);
}

.insight-item.destaque {
  border-left-color: #4caf50;
}

.insight-item.alerta {
  border-left-color: #f44336;
}

.insight-item.oportunidade {
  border-left-color: #ff9800;
}

.insight-icon {
  font-size: 1.5rem;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.insight-desc {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.insight-actions {
  display: flex;
  gap: 0.5rem;
}

.insight-action-btn {
  padding: 0.4rem 0.8rem;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.insight-action-btn:hover {
  background: #5a6fd8;
}

.insight-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  height: fit-content;
}

.insight-priority.Alta {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.insight-priority.Urgente {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid #f44336;
}

.insight-priority.Media {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

/* Tabela de Métricas */
.metricas-table-container {
  overflow-x: auto;
}

.metricas-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.metricas-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

.metricas-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.metricas-table tr:last-child td {
  border-bottom: none;
}

.metricas-table tr.linha-destaque {
  background: rgba(76, 175, 80, 0.05);
}

.metricas-table tr.linha-atencao {
  background: rgba(244, 67, 54, 0.05);
}

.setor-cell .setor-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setor-icon {
  font-size: 1.2rem;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill.excelente {
  background: #4caf50;
}
.progress-fill.bom {
  background: #ff9800;
}
.progress-fill.atencao {
  background: #ffeb3b;
}
.progress-fill.critico {
  background: #f44336;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.meta-cell,
.conformidade-cell,
.ruptura-cell {
  font-weight: 600;
  color: #2c3e50;
}

.tendencia-cell {
  font-weight: 600;
}

.tendencia-cell.positive {
  color: #4caf50;
}

.tendencia-cell.negative {
  color: #f44336;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.excelente {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-badge.bom {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.status-badge.atencao {
  background: rgba(255, 235, 59, 0.1);
  color: #fbc02d;
}

.status-badge.critico {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Footer Actions */
.footer-actions {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.footer-btn {
  padding: 1rem 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.footer-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsividade */
@media (max-width: 1200px) {
  .graficos-grid {
    grid-template-columns: 1fr;
  }

  .comparativa-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-header,
  .graficos-main-section,
  .analise-comparativa-section {
    padding: 1.5rem;
  }

  .header-main {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-controls {
    align-items: stretch;
    width: 100%;
  }

  .filter-group {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    justify-content: space-between;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .grafico-content {
    flex-direction: column;
  }

  .chart-container {
    height: 250px;
  }

  .actions-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }

  .setores-metrics {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .insight-item {
    flex-direction: column;
  }

  .insight-priority {
    align-self: flex-start;
  }
}
</style>
