<template>
  <div class="evolucao-auditorias-container">
    <!-- Cabeçalho com Filtros  ok-->
    <div class="section-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">📈</div>
          <div class="title-content">
            <h2>Evolução nas Auditorias</h2>
            <p>Análise detalhada do desempenho e tendências das auditorias</p>
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
              <label class="filter-label">Setor:</label>
              <select v-model="setorSelecionado" class="filter-select">
                <option value="todos">Todos os Setores</option>
                <option
                  v-for="setor in setores"
                  :key="setor.id"
                  :value="setor.id"
                >
                  {{ setor.nome }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Tipo:</label>
              <select v-model="tipoSelecionado" class="filter-select">
                <option value="todos">Todos os Tipos</option>
                <option
                  v-for="tipo in tiposAuditoria"
                  :key="tipo.id"
                  :value="tipo.id"
                >
                  {{ tipo.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="header-actions">
            <button class="action-btn secondary" @click="exportarRelatorio">
              📊 Exportar
            </button>
            <button class="action-btn primary" @click="gerarInsights">
              💡 Gerar Insights
            </button>
          </div>
        </div>
      </div>

      <!-- Cards de Métricas Rápidas -->
      <div class="metricas-rapidas">
        <div class="metrica-card">
          <div class="metrica-icon desempenho">📊</div>
          <div class="metrica-content">
            <div class="metrica-valor">{{ desempenhoAtual }}%</div>
            <div class="metrica-label">Desempenho Atual</div>
            <div
              class="metrica-variacao"
              :class="variacaoDesempenho >= 0 ? 'positiva' : 'negativa'"
            >
              {{ variacaoDesempenho >= 0 ? "↗" : "↘" }}
              {{ Math.abs(variacaoDesempenho) }}%
            </div>
          </div>
        </div>
        <div class="metrica-card">
          <div class="metrica-icon tendencia">📈</div>
          <div class="metrica-content">
            <div class="metrica-valor">{{ tendenciaGeral }}</div>
            <div class="metrica-label">Tendência</div>
            <div class="metrica-detalhe">Últimas 7 auditorias</div>
          </div>
        </div>
        <div class="metrica-card">
          <div class="metrica-icon consistencia">🎯</div>
          <div class="metrica-content">
            <div class="metrica-valor">{{ consistencia }}%</div>
            <div class="metrica-label">Consistência</div>
            <div class="metrica-detalhe">
              Desvio padrão: {{ desvioPadrao }}%
            </div>
          </div>
        </div>
        <div class="metrica-card">
          <div class="metrica-icon meta">🏆</div>
          <div class="metrica-content">
            <div class="metrica-valor">{{ atingimentoMeta }}%</div>
            <div class="metrica-label">Meta Atingida</div>
            <div class="metrica-detalhe">Meta: {{ meta }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos Principais -->
    <div class="graficos-section">
      <div class="graficos-grid">
        <!-- Gráfico de Linha Principal -->
        <div class="grafico-card principal">
          <div class="grafico-header">
            <h3>Evolução do Desempenho</h3>
            <div class="grafico-legenda">
              <div class="legenda-item">
                <div class="legenda-cor desempenho"></div>
                <span>Desempenho Real</span>
              </div>
              <div class="legenda-item">
                <div class="legenda-cor meta"></div>
                <span>Meta</span>
              </div>
              <div class="legenda-item">
                <div class="legenda-cor media"></div>
                <span>Média Móvel (7 dias)</span>
              </div>
            </div>
          </div>
          <div class="grafico-container">
            <canvas ref="graficoLinha"></canvas>
          </div>
          <div class="grafico-stats">
            <div class="stat-item">
              <span class="stat-label">Melhor Desempenho:</span>
              <span class="stat-value"
                >{{ melhorDesempenho.valor }}% em
                {{ melhorDesempenho.data }}</span
              >
            </div>
            <div class="stat-item">
              <span class="stat-label">Pior Desempenho:</span>
              <span class="stat-value"
                >{{ piorDesempenho.valor }}% em {{ piorDesempenho.data }}</span
              >
            </div>
          </div>
        </div>

        <!-- Gráfico de Comparação por Setor -->
        <div class="grafico-card comparacao">
          <div class="grafico-header">
            <h3>Comparativo por Setor</h3>
            <div class="periodo-comparacao">
              <span>Variação vs período anterior</span>
            </div>
          </div>
          <div class="grafico-container">
            <canvas ref="graficoComparacao"></canvas>
          </div>
        </div>

        <!-- Indicadores de Performance -->
        <div class="indicadores-grid">
          <div class="indicador-card">
            <div class="indicador-header">
              <div class="indicador-icon velocidade">⚡</div>
              <span class="indicador-title">Velocidade de Melhoria</span>
            </div>
            <div class="indicador-value">{{ velocidadeMelhoria }}%</div>
            <div class="indicador-progress">
              <div
                class="progress-bar"
                :style="{ width: Math.min(velocidadeMelhoria, 100) + '%' }"
              ></div>
            </div>
            <div class="indicador-desc">Taxa de crescimento semanal</div>
          </div>

          <div class="indicador-card">
            <div class="indicador-header">
              <div class="indicador-icon estabilidade">🛡️</div>
              <span class="indicador-title">Estabilidade</span>
            </div>
            <div class="indicador-value">{{ estabilidade }}%</div>
            <div class="indicador-progress">
              <div
                class="progress-bar"
                :style="{ width: estabilidade + '%' }"
              ></div>
            </div>
            <div class="indicador-desc">Menos variações bruscas</div>
          </div>

          <div class="indicador-card">
            <div class="indicador-header">
              <div class="indicador-icon previsao">🔮</div>
              <span class="indicador-title">Previsão 30 dias</span>
            </div>
            <div class="indicador-value">{{ previsao30dias }}%</div>
            <div class="indicador-progress">
              <div
                class="progress-bar"
                :style="{ width: Math.min(previsao30dias, 100) + '%' }"
              ></div>
            </div>
            <div class="indicador-desc">Baseado na tendência atual</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Análise Detalhada -->
    <div class="analise-section">
      <div class="analise-header">
        <h3>📋 Análise Detalhada das Últimas Auditorias</h3>
        <button class="toggle-btn" @click="toggleDetalhes">
          {{ mostrarDetalhes ? "Ocultar" : "Mostrar" }} Detalhes
        </button>
      </div>

      <div v-if="mostrarDetalhes" class="detalhes-content">
        <!-- Tabela de Auditorias -->
        <div class="tabela-auditorias">
          <table class="auditorias-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Setor</th>
                <th>Tipo</th>
                <th>Auditor</th>
                <th>Desempenho</th>
                <th>Pontuação</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="auditoria in auditoriasDetalhadas"
                :key="auditoria.id"
                :class="getLinhaClasse(auditoria)"
              >
                <td class="data-cell">{{ formatarData(auditoria.data) }}</td>
                <td class="setor-cell">
                  <div class="setor-info">
                    <div class="setor-icone">{{ auditoria.setor.icone }}</div>
                    <span>{{ auditoria.setor.nome }}</span>
                  </div>
                </td>
                <td class="tipo-cell">
                  <span
                    class="tipo-badge"
                    :style="{ background: auditoria.tipo.cor }"
                  >
                    {{ auditoria.tipo.nome }}
                  </span>
                </td>
                <td class="auditor-cell">{{ auditoria.auditor }}</td>
                <td class="desempenho-cell">
                  <div class="desempenho-bar">
                    <div
                      class="bar-fill"
                      :style="{
                        width: auditoria.desempenho + '%',
                        background: getCorDesempenho(auditoria.desempenho),
                      }"
                    ></div>
                    <span class="desempenho-value"
                      >{{ auditoria.desempenho }}%</span
                    >
                  </div>
                </td>
                <td class="pontuacao-cell">
                  <div class="pontuacao">
                    {{ auditoria.pontos }}/{{ auditoria.totalPontos }}
                  </div>
                </td>
                <td class="status-cell">
                  <span class="status-badge" :class="auditoria.status">
                    {{ auditoria.status }}
                  </span>
                </td>
                <td class="acoes-cell">
                  <button
                    class="acao-btn"
                    @click="verDetalhesAuditoria(auditoria)"
                  >
                    👁️
                  </button>
                  <button
                    class="acao-btn"
                    @click="exportarAuditoria(auditoria)"
                  >
                    📥
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Insights Automáticos -->
        <div class="insights-section">
          <h4>💡 Insights Automáticos</h4>
          <div class="insights-grid">
            <div
              v-for="insight in insights"
              :key="insight.id"
              class="insight-card"
              :class="insight.tipo"
            >
              <div class="insight-header">
                <div class="insight-icone">{{ insight.icone }}</div>
                <div class="insight-titulo">{{ insight.titulo }}</div>
                <div class="insight-badge" :class="insight.tipo">
                  {{ insight.prioridade }}
                </div>
              </div>
              <div class="insight-descricao">{{ insight.descricao }}</div>
              <div class="insight-acoes">
                <button class="insight-btn" @click="aplicarInsight(insight)">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes da Auditoria -->
    <div v-if="auditoriaSelecionada" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalhes da Auditoria</h3>
          <button class="modal-close" @click="fecharModal">×</button>
        </div>
        <div class="modal-body">
          <div class="auditoria-detalhes">
            <div class="detalhe-item">
              <label>Data:</label>
              <span>{{ formatarData(auditoriaSelecionada.data) }}</span>
            </div>
            <div class="detalhe-item">
              <label>Setor:</label>
              <span>{{ auditoriaSelecionada.setor.nome }}</span>
            </div>
            <div class="detalhe-item">
              <label>Auditor:</label>
              <span>{{ auditoriaSelecionada.auditor }}</span>
            </div>
            <div class="detalhe-item">
              <label>Desempenho:</label>
              <span class="detalhe-valor"
                >{{ auditoriaSelecionada.desempenho }}%</span
              >
            </div>
            <div class="detalhe-item">
              <label>Pontuação:</label>
              <span
                >{{ auditoriaSelecionada.pontos }}/{{
                  auditoriaSelecionada.totalPontos
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement,
} from "chart.js";

// Registrar componentes do Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement,
);

// Refs para os gráficos
const graficoLinha = ref(null);
const graficoComparacao = ref(null);

// Instâncias dos gráficos
const graficoLinhaInstance = ref(null);
const graficoComparacaoInstance = ref(null);

// Estado do componente
const periodoSelecionado = ref("7d");
const setorSelecionado = ref("todos");
const tipoSelecionado = ref("todos");
const mostrarDetalhes = ref(false);
const auditoriaSelecionada = ref(null);

// Dados de configuração
const periodos = [
  { label: "Últimos 7 Dias", value: "7d" },
  { label: "Últimas 2 Semanas", value: "14d" },
  { label: "Último Mês", value: "30d" },
  { label: "Último Trimestre", value: "90d" },
];

const setores = [
  { id: "hortifruti", nome: "Hortifruti", icone: "🥦" },
  { id: "acougue", nome: "Açougue", icone: "🥩" },
  { id: "padaria", nome: "Padaria", icone: "🍞" },
  { id: "laticinios", nome: "Laticínios", icone: "🥛" },
  { id: "mercearia", nome: "Mercearia", icone: "🛒" },
  { id: "bebidas", nome: "Bebidas", icone: "🥤" },
];

const tiposAuditoria = [
  { id: "etiqueta", nome: "Etiqueta", cor: "#667eea" },
  { id: "presenca", nome: "Presença", cor: "#4CAF50" },
  { id: "ruptura", nome: "Ruptura", cor: "#FF9800" },
  { id: "qualidade", nome: "Qualidade", cor: "#9C27B0" },
];

// Dados das auditorias
const dadosAuditorias = {
  "7d": {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    desempenhos: [85, 88, 90, 87, 92, 94, 91],
    mediaMovel: [85, 86.5, 87.7, 87.5, 88.4, 89.3, 89.6],
    meta: 90,
    comparacaoSetores: [
      { setor: "Hortifruti", atual: 95, anterior: 92, variacao: 3.3 },
      { setor: "Açougue", atual: 88, anterior: 85, variacao: 3.5 },
      { setor: "Padaria", atual: 91, anterior: 89, variacao: 2.2 },
      { setor: "Laticínios", atual: 94, anterior: 91, variacao: 3.3 },
      { setor: "Mercearia", atual: 89, anterior: 87, variacao: 2.3 },
      { setor: "Bebidas", atual: 76, anterior: 78, variacao: -2.6 },
    ],
  },
  "14d": {
    labels: [
      "Dia 1",
      "Dia 2",
      "Dia 3",
      "Dia 4",
      "Dia 5",
      "Dia 6",
      "Dia 7",
      "Dia 8",
      "Dia 9",
      "Dia 10",
      "Dia 11",
      "Dia 12",
      "Dia 13",
      "Dia 14",
    ],
    desempenhos: [82, 85, 87, 84, 89, 91, 88, 90, 92, 89, 93, 91, 94, 92],
    mediaMovel: [
      82, 83.5, 84.7, 84.5, 85.4, 86.3, 86.6, 87.1, 87.8, 88.1, 88.7, 89.1,
      89.6, 90.0,
    ],
    meta: 90,
    comparacaoSetores: [
      { setor: "Hortifruti", atual: 94, anterior: 90, variacao: 4.4 },
      { setor: "Açougue", atual: 87, anterior: 83, variacao: 4.8 },
      { setor: "Padaria", atual: 90, anterior: 87, variacao: 3.4 },
      { setor: "Laticínios", atual: 93, anterior: 89, variacao: 4.5 },
      { setor: "Mercearia", atual: 88, anterior: 85, variacao: 3.5 },
      { setor: "Bebidas", atual: 78, anterior: 75, variacao: 4.0 },
    ],
  },
};

// Dados detalhados das auditorias
const auditoriasDetalhadas = ref([
  {
    id: 1,
    data: "2024-01-15",
    setor: { id: "hortifruti", nome: "Hortifruti", icone: "🥦" },
    tipo: { id: "etiqueta", nome: "Etiqueta", cor: "#667eea" },
    auditor: "João Silva",
    desempenho: 95,
    pontos: 38,
    totalPontos: 40,
    status: "excelente",
  },
  {
    id: 2,
    data: "2024-01-14",
    setor: { id: "acougue", nome: "Açougue", icone: "🥩" },
    tipo: { id: "presenca", nome: "Presença", cor: "#4CAF50" },
    auditor: "Maria Santos",
    desempenho: 88,
    pontos: 35,
    totalPontos: 40,
    status: "bom",
  },
  {
    id: 3,
    data: "2024-01-13",
    setor: { id: "padaria", nome: "Padaria", icone: "🍞" },
    tipo: { id: "qualidade", nome: "Qualidade", cor: "#9C27B0" },
    auditor: "Pedro Costa",
    desempenho: 91,
    pontos: 36,
    totalPontos: 40,
    status: "excelente",
  },
  {
    id: 4,
    data: "2024-01-12",
    setor: { id: "laticinios", nome: "Laticínios", icone: "🥛" },
    tipo: { id: "ruptura", nome: "Ruptura", cor: "#FF9800" },
    auditor: "Ana Oliveira",
    desempenho: 94,
    pontos: 37,
    totalPontos: 40,
    status: "excelente",
  },
  {
    id: 5,
    data: "2024-01-11",
    setor: { id: "mercearia", nome: "Mercearia", icone: "🛒" },
    tipo: { id: "etiqueta", nome: "Etiqueta", cor: "#667eea" },
    auditor: "Carlos Lima",
    desempenho: 89,
    pontos: 35,
    totalPontos: 40,
    status: "bom",
  },
  {
    id: 6,
    data: "2024-01-10",
    setor: { id: "bebidas", nome: "Bebidas", icone: "🥤" },
    tipo: { id: "presenca", nome: "Presença", cor: "#4CAF50" },
    auditor: "Fernanda Rocha",
    desempenho: 76,
    pontos: 30,
    totalPontos: 40,
    status: "atencao",
  },
  {
    id: 7,
    data: "2024-01-09",
    setor: { id: "hortifruti", nome: "Hortifruti", icone: "🥦" },
    tipo: { id: "qualidade", nome: "Qualidade", cor: "#9C27B0" },
    auditor: "João Silva",
    desempenho: 92,
    pontos: 36,
    totalPontos: 40,
    status: "excelente",
  },
]);

// Insights automáticos
const insights = ref([
  {
    id: 1,
    tipo: "positivo",
    icone: "🚀",
    titulo: "Performance em Alta",
    descricao: "Crescimento consistente de 5.2% nas últimas 7 auditorias",
    prioridade: "Alta",
  },
  {
    id: 2,
    tipo: "alerta",
    icone: "⚠️",
    titulo: "Setor Crítico",
    descricao: "Bebidas apresenta desempenho 15% abaixo da média",
    prioridade: "Urgente",
  },
  {
    id: 3,
    tipo: "sugestao",
    icone: "💡",
    titulo: "Oportunidade de Melhoria",
    descricao:
      "Auditorias de etiqueta têm melhor desempenho - replicar boas práticas",
    prioridade: "Média",
  },
]);

// Computed properties
const dadosAtuais = computed(() => {
  return dadosAuditorias[periodoSelecionado.value] || dadosAuditorias["7d"];
});

const desempenhoAtual = computed(() => {
  const desempenhos = dadosAtuais.value.desempenhos;
  return desempenhos[desempenhos.length - 1];
});

const variacaoDesempenho = computed(() => {
  const desempenhos = dadosAtuais.value.desempenhos;
  if (desempenhos.length < 2) return 0;
  const primeiro = desempenhos[0];
  const ultimo = desempenhos[desempenhos.length - 1];
  return (((ultimo - primeiro) / primeiro) * 100).toFixed(1);
});

const tendenciaGeral = computed(() => {
  return variacaoDesempenho.value >= 0 ? "Positiva ↗" : "Negativa ↘";
});

const consistencia = computed(() => {
  const desempenhos = dadosAtuais.value.desempenhos;
  const media = desempenhos.reduce((a, b) => a + b, 0) / desempenhos.length;
  return Math.round(100 - (desvioPadrao.value / media) * 100);
});

const desvioPadrao = computed(() => {
  const desempenhos = dadosAtuais.value.desempenhos;
  const media = desempenhos.reduce((a, b) => a + b, 0) / desempenhos.length;
  const squaredDiffs = desempenhos.map((val) => Math.pow(val - media, 2));
  const avgSquaredDiff =
    squaredDiffs.reduce((a, b) => a + b, 0) / desempenhos.length;
  return Math.sqrt(avgSquaredDiff).toFixed(1);
});

const meta = computed(() => dadosAtuais.value.meta);

const atingimentoMeta = computed(() => {
  return Math.round((desempenhoAtual.value / meta.value) * 100);
});

const melhorDesempenho = computed(() => {
  const desempenhos = dadosAtuais.value.desempenhos;
  const maxIndex = desempenhos.indexOf(Math.max(...desempenhos));
  return {
    valor: Math.max(...desempenhos),
    data: dadosAtuais.value.labels[maxIndex],
  };
});

const piorDesempenho = computed(() => {
  const desempenhos = dadosAtuais.value.desempenhos;
  const minIndex = desempenhos.indexOf(Math.min(...desempenhos));
  return {
    valor: Math.min(...desempenhos),
    data: dadosAtuais.value.labels[minIndex],
  };
});

const velocidadeMelhoria = computed(() => {
  return Math.max(0, variacaoDesempenho.value);
});

const estabilidade = computed(() => {
  return Math.max(0, 100 - desvioPadrao.value * 2);
});

const previsao30dias = computed(() => {
  const crescimentoDiario =
    variacaoDesempenho.value / dadosAtuais.value.desempenhos.length;
  return Math.min(
    100,
    Math.round(desempenhoAtual.value + crescimentoDiario * 30),
  );
});

// Métodos
const initializeCharts = () => {
  if (!graficoLinha.value || !graficoComparacao.value) return;

  // Gráfico de Linha Principal
  graficoLinhaInstance.value = new Chart(graficoLinha.value, {
    type: "line",
    data: {
      labels: dadosAtuais.value.labels,
      datasets: [
        {
          label: "Desempenho Real",
          data: dadosAtuais.value.desempenhos,
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.05)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: "Meta",
          data: Array(dadosAtuais.value.labels.length).fill(
            dadosAtuais.value.meta,
          ),
          borderColor: "#4CAF50",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointStyle: false,
        },
        {
          label: "Média Móvel",
          data: dadosAtuais.value.mediaMovel,
          borderColor: "#FF9800",
          borderWidth: 2,
          fill: false,
          pointStyle: false,
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
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          min: 70,
          max: 100,
          grid: {
            color: "rgba(0,0,0,0.05)",
            drawBorder: false,
          },
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    },
  });

  // Gráfico de Comparação por Setor
  graficoComparacaoInstance.value = new Chart(graficoComparacao.value, {
    type: "bar",
    data: {
      labels: dadosAtuais.value.comparacaoSetores.map((s) => s.setor),
      datasets: [
        {
          label: "Variação %",
          data: dadosAtuais.value.comparacaoSetores.map((s) => s.variacao),
          backgroundColor: dadosAtuais.value.comparacaoSetores.map((s) =>
            s.variacao >= 0
              ? "rgba(76, 175, 80, 0.8)"
              : "rgba(244, 67, 54, 0.8)",
          ),
          borderRadius: 8,
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
              const setor =
                dadosAtuais.value.comparacaoSetores[context.dataIndex];
              return [
                `Atual: ${setor.atual}%`,
                `Anterior: ${setor.anterior}%`,
                `Variação: ${setor.variacao >= 0 ? "+" : ""}${setor.variacao}%`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    },
  });
};

const updateCharts = () => {
  if (graficoLinhaInstance.value) {
    graficoLinhaInstance.value.data.labels = dadosAtuais.value.labels;
    graficoLinhaInstance.value.data.datasets[0].data =
      dadosAtuais.value.desempenhos;
    graficoLinhaInstance.value.data.datasets[1].data = Array(
      dadosAtuais.value.labels.length,
    ).fill(dadosAtuais.value.meta);
    graficoLinhaInstance.value.data.datasets[2].data =
      dadosAtuais.value.mediaMovel;
    graficoLinhaInstance.value.update();
  }

  if (graficoComparacaoInstance.value) {
    graficoComparacaoInstance.value.data.labels =
      dadosAtuais.value.comparacaoSetores.map((s) => s.setor);
    graficoComparacaoInstance.value.data.datasets[0].data =
      dadosAtuais.value.comparacaoSetores.map((s) => s.variacao);
    graficoComparacaoInstance.value.data.datasets[0].backgroundColor =
      dadosAtuais.value.comparacaoSetores.map((s) =>
        s.variacao >= 0 ? "rgba(76, 175, 80, 0.8)" : "rgba(244, 67, 54, 0.8)",
      );
    graficoComparacaoInstance.value.update();
  }
};

const getLinhaClasse = (auditoria) => {
  return {
    "linha-destaque": auditoria.desempenho >= 90,
    "linha-atencao": auditoria.desempenho < 80,
  };
};

const getCorDesempenho = (desempenho) => {
  if (desempenho >= 90) return "#4CAF50";
  if (desempenho >= 80) return "#FF9800";
  return "#f44336";
};

const formatarData = (data) => {
  return new Date(data).toLocaleDateString("pt-BR");
};

const toggleDetalhes = () => {
  mostrarDetalhes.value = !mostrarDetalhes.value;
};

const verDetalhesAuditoria = (auditoria) => {
  auditoriaSelecionada.value = auditoria;
};

const fecharModal = () => {
  auditoriaSelecionada.value = null;
};

const exportarAuditoria = (auditoria) => {
  console.log("Exportando auditoria:", auditoria);
  alert(`Auditoria ${auditoria.id} exportada com sucesso!`);
};

const exportarRelatorio = () => {
  console.log("Exportando relatório completo...");
  alert("Relatório de evolução exportado com sucesso!");
};

const gerarInsights = () => {
  console.log("Gerando insights...");
  alert("Novos insights gerados com sucesso!");
};

const aplicarInsight = (insight) => {
  console.log("Aplicando insight:", insight);
  alert(`Insight "${insight.titulo}" aplicado com sucesso!`);
};

// Lifecycle
onMounted(() => {
  initializeCharts();
  window.addEventListener("resize", () => {
    if (graficoLinhaInstance.value) graficoLinhaInstance.value.resize();
    if (graficoComparacaoInstance.value)
      graficoComparacaoInstance.value.resize();
  });
});

onUnmounted(() => {
  if (graficoLinhaInstance.value) graficoLinhaInstance.value.destroy();
  if (graficoComparacaoInstance.value)
    graficoComparacaoInstance.value.destroy();
});

// Watchers
watch(periodoSelecionado, () => {
  updateCharts();
});
</script>

<style scoped>
.evolucao-auditorias-container {
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
  min-width: 140px;
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

/* Métricas Rápidas */
.metricas-rapidas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metrica-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.metrica-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.metrica-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.metrica-icon.desempenho {
  background: rgba(102, 126, 234, 0.1);
}

.metrica-icon.tendencia {
  background: rgba(76, 175, 80, 0.1);
}

.metrica-icon.consistencia {
  background: rgba(255, 152, 0, 0.1);
}

.metrica-icon.meta {
  background: rgba(156, 39, 176, 0.1);
}

.metrica-valor {
  font-size: 1.8rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.metrica-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.metrica-variacao {
  font-size: 0.8rem;
  font-weight: 600;
}

.metrica-variacao.positiva {
  color: #4caf50;
}

.metrica-variacao.negativa {
  color: #f44336;
}

.metrica-detalhe {
  font-size: 0.8rem;
  color: #a0aec0;
}

/* Gráficos Section */
.graficos-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.graficos-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.grafico-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.grafico-card.principal {
  grid-column: 1;
}

.grafico-card.comparacao {
  grid-column: 2;
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.grafico-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.grafico-legenda {
  display: flex;
  gap: 1rem;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #718096;
}

.legenda-cor {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legenda-cor.desempenho {
  background: #667eea;
}

.legenda-cor.meta {
  background: #4caf50;
}

.legenda-cor.media {
  background: #ff9800;
}

.periodo-comparacao {
  font-size: 0.8rem;
  color: #718096;
}

.grafico-container {
  height: 300px;
  position: relative;
}

.grafico-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Indicadores */
.indicadores-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.indicador-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #667eea;
}

.indicador-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.indicador-icon {
  font-size: 1.5rem;
}

.indicador-icon.velocidade {
  color: #4caf50;
}

.indicador-icon.estabilidade {
  color: #ff9800;
}

.indicador-icon.previsao {
  color: #9c27b0;
}

.indicador-title {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.indicador-value {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.indicador-progress {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.indicador-progress .progress-bar {
  height: 100%;
  background: #667eea;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.indicador-desc {
  font-size: 0.8rem;
  color: #718096;
}

/* Análise Section */
.analise-section {
  padding: 2rem;
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

.toggle-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: #5a6fd8;
}

/* Tabela de Auditorias */
.tabela-auditorias {
  margin-bottom: 2rem;
}

.auditorias-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.auditorias-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

.auditorias-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.auditorias-table tr:last-child td {
  border-bottom: none;
}

.auditorias-table tr.linha-destaque {
  background: rgba(76, 175, 80, 0.05);
}

.auditorias-table tr.linha-atencao {
  background: rgba(244, 67, 54, 0.05);
}

.setor-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setor-icone {
  font-size: 1.2rem;
}

.tipo-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.desempenho-bar {
  position: relative;
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
  position: relative;
}

.desempenho-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.pontuacao {
  font-weight: 600;
  color: #2c3e50;
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
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.status-badge.atencao {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.acoes-cell {
  display: flex;
  gap: 0.5rem;
}

.acao-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.acao-btn:hover {
  background: #f8fafc;
}

/* Insights Section */
.insights-section {
  margin-top: 2rem;
}

.insights-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.insight-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid;
}

.insight-card.positivo {
  border-left-color: #4caf50;
}

.insight-card.alerta {
  border-left-color: #ff9800;
}

.insight-card.sugestao {
  border-left-color: #2196f3;
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.insight-icone {
  font-size: 1.5rem;
}

.insight-titulo {
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
}

.insight-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.insight-badge.positivo {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.insight-badge.alerta {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.insight-badge.sugestao {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.insight-descricao {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.insight-acoes {
  display: flex;
  justify-content: flex-end;
}

.insight-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.insight-btn:hover {
  background: #5a6fd8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:hover {
  background: #f8fafc;
}

.modal-body {
  padding: 1.5rem;
}

.auditoria-detalhes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detalhe-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.detalhe-item:last-child {
  border-bottom: none;
}

.detalhe-item label {
  font-weight: 600;
  color: #4a5568;
}

.detalhe-item span {
  color: #2c3e50;
}

.detalhe-valor {
  font-weight: 600;
  color: #667eea;
}

/* Responsividade */
@media (max-width: 1024px) {
  .graficos-grid {
    grid-template-columns: 1fr;
  }

  .grafico-card.principal,
  .grafico-card.comparacao {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .section-header,
  .graficos-section,
  .analise-section {
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

  .metricas-rapidas {
    grid-template-columns: repeat(2, 1fr);
  }

  .analise-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .auditorias-table {
    display: block;
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .metricas-rapidas {
    grid-template-columns: 1fr;
  }

  .indicadores-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
