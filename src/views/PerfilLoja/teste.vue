<template>
  <div class="auditorias-mensais-container">
    <!-- Cabeçalho da Seção -->
    <div class="section-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">📅</div>
          <div class="title-content">
            <h2>Auditorias Mensais</h2>
            <p>Análise detalhada do volume de auditorias ao longo do tempo</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="filter-group">
            <label class="filter-label">Período:</label>
            <select v-model="activePeriod" class="period-select">
              <option
                v-for="period in timePeriods"
                :key="period.value"
                :value="period.value"
              >
                {{ period.label }}
              </option>
            </select>
          </div>
          <button class="export-btn" @click="exportData">
            <span class="export-icon">📊</span>
            Exportar Dados
          </button>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon total">📋</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalAuditorias }}</div>
            <div class="summary-label">Total de Auditorias</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon average">📈</div>
          <div class="summary-content">
            <div class="summary-value">{{ mediaMensal }}</div>
            <div class="summary-label">Média Mensal</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon growth">🚀</div>
          <div class="summary-content">
            <div class="summary-value">{{ crescimento }}%</div>
            <div class="summary-label">Crescimento</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon target">🎯</div>
          <div class="summary-content">
            <div class="summary-value">{{ percentualMeta }}%</div>
            <div class="summary-label">Meta Atingida</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico Principal -->
    <div class="chart-section">
      <div class="chart-container">
        <canvas ref="barChart"></canvas>
      </div>
    </div>

    <!-- Detalhes e Métricas -->
    <div class="details-section">
      <div class="details-grid">
        <!-- Estatísticas Detalhadas -->
        <div class="details-card">
          <h3 class="details-title">📊 Estatísticas Detalhadas</h3>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Mês com Maior Volume</span>
              <span class="metric-value"
                >{{ mesMaiorVolume.mes }} ({{ mesMaiorVolume.valor }})</span
              >
            </div>
            <div class="metric-item">
              <span class="metric-label">Mês com Menor Volume</span>
              <span class="metric-value"
                >{{ mesMenorVolume.mes }} ({{ mesMenorVolume.valor }})</span
              >
            </div>
            <div class="metric-item">
              <span class="metric-label">Tendência</span>
              <span class="metric-value" :class="tendenciaClass">{{
                tendencia
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Previsão Próximo Mês</span>
              <span class="metric-value">{{ previsaoProximoMes }}</span>
            </div>
          </div>
        </div>

        <!-- Distribuição por Tipo -->
        <div class="details-card">
          <h3 class="details-title">🔍 Distribuição por Tipo</h3>
          <div class="distribution-chart">
            <canvas ref="doughnutChart"></canvas>
          </div>
          <div class="distribution-stats">
            <div
              v-for="(tipo, index) in distribuicaoTipos"
              :key="tipo.nome"
              class="distribution-item"
            >
              <div
                class="distribution-color"
                :style="{ background: tipo.cor }"
              ></div>
              <span class="distribution-name">{{ tipo.nome }}</span>
              <span class="distribution-value"
                >{{ tipo.quantidade }} ({{ tipo.percentual }}%)</span
              >
            </div>
          </div>
        </div>

        <!-- Insights e Alertas -->
        <div class="details-card">
          <h3 class="details-title">💡 Insights</h3>
          <div class="insights-list">
            <div
              v-for="insight in insights"
              :key="insight.id"
              class="insight-item"
              :class="insight.tipo"
            >
              <div class="insight-icon">{{ insight.icone }}</div>
              <div class="insight-content">
                <div class="insight-title">{{ insight.titulo }}</div>
                <div class="insight-description">{{ insight.descricao }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Dados -->
    <div class="table-section">
      <div class="table-header">
        <h3>📋 Dados Detalhados</h3>
        <div class="table-actions">
          <button class="table-btn" @click="toggleTableView">
            {{ showTable ? "Ocultar" : "Mostrar" }} Tabela
          </button>
        </div>
      </div>

      <div v-if="showTable" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Período</th>
              <th>Auditorias Realizadas</th>
              <th>Meta</th>
              <th>Atingimento</th>
              <th>Variação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tabelaDados" :key="index">
              <td class="period-cell">{{ item.periodo }}</td>
              <td class="value-cell">{{ item.realizadas }}</td>
              <td class="value-cell">{{ item.meta }}</td>
              <td class="value-cell">{{ item.atingimento }}%</td>
              <td
                class="variation-cell"
                :class="item.variacao >= 0 ? 'positive' : 'negative'"
              >
                {{ item.variacao >= 0 ? "+" : "" }}{{ item.variacao }}%
              </td>
              <td class="status-cell">
                <span class="status-badge" :class="item.status">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
} from "chart.js";

// Registrar componentes do Chart.js
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
);

// Refs para os gráficos
const barChart = ref(null);
const doughnutChart = ref(null);

// Instâncias dos gráficos
const barChartInstance = ref(null);
const doughnutChartInstance = ref(null);

// Estado do componente
const activePeriod = ref("month");
const showTable = ref(false);

// Períodos disponíveis
const timePeriods = [
  { label: "Última Semana", value: "week" },
  { label: "Último Mês", value: "month" },
  { label: "Último Trimestre", value: "quarter" },
  { label: "Último Ano", value: "year" },
];

// Dados dos gráficos
const chartData = {
  week: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    auditorias: [3, 5, 4, 6, 8, 5, 7],
    meta: 40,
    tipos: [
      { nome: "Etiquetas", quantidade: 25, cor: "#667eea" },
      { nome: "Presença", quantidade: 10, cor: "#4CAF50" },
      { nome: "Ruptura", quantidade: 5, cor: "#FF9800" },
    ],
  },
  month: {
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
    auditorias: [12, 19, 15, 22, 30, 25, 28, 32, 27, 20, 18, 24],
    meta: 250,
    tipos: [
      { nome: "Etiquetas", quantidade: 150, cor: "#667eea" },
      { nome: "Presença", quantidade: 75, cor: "#4CAF50" },
      { nome: "Ruptura", quantidade: 25, cor: "#FF9800" },
    ],
  },
  quarter: {
    labels: ["Q1", "Q2", "Q3"],
    auditorias: [45, 67, 55],
    meta: 180,
    tipos: [
      { nome: "Etiquetas", quantidade: 100, cor: "#667eea" },
      { nome: "Presença", quantidade: 50, cor: "#4CAF50" },
      { nome: "Ruptura", quantidade: 17, cor: "#FF9800" },
    ],
  },
  year: {
    labels: ["2021", "2022", "2023", "2024"],
    auditorias: [180, 195, 210, 230],
    meta: 800,
    tipos: [
      { nome: "Etiquetas", quantidade: 480, cor: "#667eea" },
      { nome: "Presença", quantidade: 240, cor: "#4CAF50" },
      { nome: "Ruptura", quantidade: 80, cor: "#FF9800" },
    ],
  },
};

// Computed properties
const totalAuditorias = computed(() => {
  const data = chartData[activePeriod.value];
  return data.auditorias.reduce((sum, val) => sum + val, 0);
});

const mediaMensal = computed(() => {
  const data = chartData[activePeriod.value];
  return Math.round(totalAuditorias.value / data.auditorias.length);
});

const crescimento = computed(() => {
  const data = chartData[activePeriod.value].auditorias;
  if (data.length < 2) return 0;

  const primeiro = data[0];
  const ultimo = data[data.length - 1];
  return Math.round(((ultimo - primeiro) / primeiro) * 100);
});

const percentualMeta = computed(() => {
  const data = chartData[activePeriod.value];
  return Math.round((totalAuditorias.value / data.meta) * 100);
});

const mesMaiorVolume = computed(() => {
  const data = chartData[activePeriod.value];
  const maxValue = Math.max(...data.auditorias);
  const maxIndex = data.auditorias.indexOf(maxValue);
  return {
    mes: data.labels[maxIndex],
    valor: maxValue,
  };
});

const mesMenorVolume = computed(() => {
  const data = chartData[activePeriod.value];
  const minValue = Math.min(...data.auditorias);
  const minIndex = data.auditorias.indexOf(minValue);
  return {
    mes: data.labels[minIndex],
    valor: minValue,
  };
});

const tendencia = computed(() => {
  return crescimento.value >= 0 ? "Crescimento" : "Queda";
});

const tendenciaClass = computed(() => {
  return crescimento.value >= 0 ? "positive" : "negative";
});

const previsaoProximoMes = computed(() => {
  const data = chartData[activePeriod.value].auditorias;
  if (data.length < 2) return mediaMensal.value;

  const ultimo = data[data.length - 1];
  const penultimo = data[data.length - 2];
  const variacao = ((ultimo - penultimo) / penultimo) * 100;

  return Math.round(ultimo * (1 + variacao / 100));
});

const distribuicaoTipos = computed(() => {
  const tipos = chartData[activePeriod.value].tipos;
  const total = tipos.reduce((sum, tipo) => sum + tipo.quantidade, 0);

  return tipos.map((tipo) => ({
    ...tipo,
    percentual: Math.round((tipo.quantidade / total) * 100),
  }));
});

const insights = computed(() => [
  {
    id: 1,
    tipo: "success",
    icone: "🚀",
    titulo: "Performance Positiva",
    descricao: `Crescimento de ${crescimento.value}% no período selecionado`,
  },
  {
    id: 2,
    tipo: "info",
    icone: "📈",
    titulo: "Meta Atingida",
    descricao: `${percentualMeta.value}% da meta mensal foi alcançada`,
  },
  {
    id: 3,
    tipo: "warning",
    icone: "⚠️",
    titulo: "Pico de Atividade",
    descricao: `Maior volume em ${mesMaiorVolume.value.mes} com ${mesMaiorVolume.value.valor} auditorias`,
  },
]);

const tabelaDados = computed(() => {
  const data = chartData[activePeriod.value];
  return data.labels.map((label, index) => {
    const realizado = data.auditorias[index];
    const metaPeriodo = Math.round(data.meta / data.labels.length);
    const atingimento = Math.round((realizado / metaPeriodo) * 100);
    const variacao =
      index > 0
        ? Math.round(
            ((realizado - data.auditorias[index - 1]) /
              data.auditorias[index - 1]) *
              100
          )
        : 0;

    let status = "normal";
    if (atingimento >= 100) status = "excelente";
    else if (atingimento >= 80) status = "bom";
    else if (atingimento < 60) status = "critico";

    return {
      periodo: label,
      realizadas: realizado,
      meta: metaPeriodo,
      atingimento: atingimento,
      variacao: variacao,
      status: status,
    };
  });
});

// Métodos
const initializeCharts = () => {
  if (!barChart.value || !doughnutChart.value) return;

  // Gráfico de Barras Principal
  barChartInstance.value = new Chart(barChart.value, {
    type: "bar",
    data: {
      labels: chartData[activePeriod.value].labels,
      datasets: [
        {
          label: "Auditorias Realizadas",
          data: chartData[activePeriod.value].auditorias,
          backgroundColor: "rgba(102, 126, 234, 0.8)",
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: "Meta",
          data: Array(chartData[activePeriod.value].labels.length).fill(
            Math.round(
              chartData[activePeriod.value].meta /
                chartData[activePeriod.value].labels.length
            )
          ),
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderColor: "rgba(102, 126, 234, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
          type: "line",
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
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
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
          beginAtZero: true,
          grid: {
            color: "rgba(0,0,0,0.05)",
            drawBorder: false,
          },
          ticks: {
            padding: 10,
          },
        },
      },
    },
  });

  // Gráfico de Rosca - Distribuição por Tipo
  doughnutChartInstance.value = new Chart(doughnutChart.value, {
    type: "doughnut",
    data: {
      labels: distribuicaoTipos.value.map((t) => t.nome),
      datasets: [
        {
          data: distribuicaoTipos.value.map((t) => t.quantidade),
          backgroundColor: distribuicaoTipos.value.map((t) => t.cor),
          borderWidth: 0,
          spacing: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
    },
  });
};

const updateCharts = () => {
  if (barChartInstance.value) {
    barChartInstance.value.data.labels = chartData[activePeriod.value].labels;
    barChartInstance.value.data.datasets[0].data =
      chartData[activePeriod.value].auditorias;
    barChartInstance.value.data.datasets[1].data = Array(
      chartData[activePeriod.value].labels.length
    ).fill(
      Math.round(
        chartData[activePeriod.value].meta /
          chartData[activePeriod.value].labels.length
      )
    );
    barChartInstance.value.update();
  }

  if (doughnutChartInstance.value) {
    doughnutChartInstance.value.data.labels = distribuicaoTipos.value.map(
      (t) => t.nome
    );
    doughnutChartInstance.value.data.datasets[0].data =
      distribuicaoTipos.value.map((t) => t.quantidade);
    doughnutChartInstance.value.data.datasets[0].backgroundColor =
      distribuicaoTipos.value.map((t) => t.cor);
    doughnutChartInstance.value.update();
  }
};

const exportData = () => {
  // Simulação de exportação de dados
  console.log("Exportando dados das auditorias...", {
    periodo: activePeriod.value,
    dados: chartData[activePeriod.value],
  });
  alert(`Dados do período ${activePeriod.value} exportados com sucesso!`);
};

const toggleTableView = () => {
  showTable.value = !showTable.value;
};

// Lifecycle
onMounted(() => {
  initializeCharts();
  window.addEventListener("resize", () => {
    if (barChartInstance.value) barChartInstance.value.resize();
    if (doughnutChartInstance.value) doughnutChartInstance.value.resize();
  });
});

onUnmounted(() => {
  if (barChartInstance.value) barChartInstance.value.destroy();
  if (doughnutChartInstance.value) doughnutChartInstance.value.destroy();
});

// Watchers
watch(activePeriod, () => {
  updateCharts();
});
</script>

<style scoped>
.auditorias-mensais-container {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.period-select {
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.export-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-btn:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.summary-icon.total {
  background: rgba(102, 126, 234, 0.1);
}

.summary-icon.average {
  background: rgba(76, 175, 80, 0.1);
}

.summary-icon.growth {
  background: rgba(255, 152, 0, 0.1);
}

.summary-icon.target {
  background: rgba(156, 39, 176, 0.1);
}

.summary-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
}

/* Chart Section */
.chart-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.chart-container {
  height: 400px;
  position: relative;
}

/* Details Section */
.details-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.details-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.details-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-label {
  color: #718096;
  font-size: 0.9rem;
}

.metric-value {
  font-weight: 600;
  color: #2c3e50;
}

.metric-value.positive {
  color: #4caf50;
}

.metric-value.negative {
  color: #f44336;
}

.distribution-chart {
  height: 200px;
  margin-bottom: 1rem;
}

.distribution-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: white;
}

.distribution-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.distribution-name {
  flex: 1;
  font-size: 0.9rem;
  color: #4a5568;
}

.distribution-value {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;
}

.insight-item:hover {
  transform: translateX(4px);
}

.insight-item.success {
  border-left: 4px solid #4caf50;
}

.insight-item.info {
  border-left: 4px solid #2196f3;
}

.insight-item.warning {
  border-left: 4px solid #ff9800;
}

.insight-icon {
  font-size: 1.2rem;
}

.insight-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.insight-description {
  color: #718096;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Table Section */
.table-section {
  padding: 2rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: 1rem;
}

.table-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.table-btn:hover {
  background: #5a6fd8;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.data-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.period-cell {
  font-weight: 600;
  color: #2c3e50;
}

.value-cell {
  color: #4a5568;
  font-weight: 500;
}

.variation-cell {
  font-weight: 600;
}

.variation-cell.positive {
  color: #4caf50;
}

.variation-cell.negative {
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
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.status-badge.normal {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.status-badge.critico {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Responsividade */
@media (max-width: 1024px) {
  .header-main {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .section-header,
  .chart-section,
  .details-section,
  .table-section {
    padding: 1.5rem;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    justify-content: space-between;
  }

  .title-section {
    flex-direction: column;
    text-align: center;
  }

  .title-icon {
    align-self: center;
  }
}
</style>
