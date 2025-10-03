<template>
  <div class="estatisticas-container">
    <!-- Cabeçalho -->
    <div class="estatisticas-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">📊</div>
          <div class="title-text">
            <h1>Dashboard de Auditorias</h1>
            <p>Visão geral das métricas e desempenho</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="time-filter">
            <button
              v-for="period in timePeriods"
              :key="period.value"
              class="filter-btn"
              :class="{ active: activePeriod === period.value }"
              @click="activePeriod = period.value"
            >
              {{ period.label }}
            </button>
          </div>
          <button class="export-btn">📥 Exportar Relatório</button>
        </div>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="stats-section">
      <h2 class="section-title">Métricas Principais</h2>
      <div class="stats-grid">
        <div
          v-for="(stat, index) in statistics"
          :key="stat.title"
          class="stat-card"
          :style="{ '--animation-order': index }"
        >
          <div class="stat-background">
            <div class="bg-shape shape-1"></div>
            <div class="bg-shape shape-2"></div>
          </div>
          <div class="stat-content">
            <div class="stat-header">
              <div class="stat-icon" :style="{ background: stat.color }">
                <span class="stat-emoji">{{ stat.emoji }}</span>
              </div>
              <div class="stat-trend" :class="stat.trend">
                <span class="trend-icon">{{ stat.trendIcon }}</span>
                <span class="trend-value">{{ stat.trendValue }}</span>
              </div>
            </div>
            <div class="stat-values">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
            <div class="stat-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{
                    width: stat.progress + '%',
                    background: stat.color,
                  }"
                ></div>
              </div>
              <span class="progress-text">{{ stat.progress }}% da meta</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-section">
      <h2 class="section-title">Análises Visuais</h2>
      <div class="charts-grid">
        <!-- Gráfico de Radar - Desempenho por Setor -->
        <div class="chart-card large">
          <div class="chart-header">
            <div class="chart-title">
              <h3>Desempenho por Setor</h3>
              <p>Análise comparativa entre áreas</p>
            </div>
            <div class="chart-actions">
              <button class="chart-action-btn">🔍 Detalhes</button>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="radarChart"></canvas>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color high"></div>
              <span>Alto (90-100%)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color medium"></div>
              <span>Médio (80-89%)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color low"></div>
              <span>Baixo (&lt;80%)</span>
            </div>
          </div>
        </div>

        <!-- Gráfico de Barras - Auditorias Mensais -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <h3>Auditorias Mensais</h3>
              <p>Volume ao longo do ano</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="barChart"></canvas>
          </div>
        </div>

        <!-- Gráfico de Rosca - Tipos de Auditoria -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <h3>Tipos de Auditoria</h3>
              <p>Distribuição por categoria</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="doughnutChart"></canvas>
          </div>
          <div class="chart-stats">
            <div class="stat-mini">
              <div class="stat-mini-item">
                <span class="stat-mini-label">Etiquetas</span>
                <span class="stat-mini-value">240</span>
              </div>
              <div class="stat-mini-item">
                <span class="stat-mini-label">Presença</span>
                <span class="stat-mini-value">120</span>
              </div>
              <div class="stat-mini-item">
                <span class="stat-mini-label">Ruptura</span>
                <span class="stat-mini-value">50</span>
              </div>
              <div class="stat-mini-item">
                <span class="stat-mini-label">Total</span>
                <span class="stat-mini-value">410</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico de Linha - Evolução Semanal -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <h3>Evolução nas Auditorias</h3>
              <p>Performance nos últimos 7 auditorias</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="lineChart"></canvas>
          </div>
          <div class="performance-badge positive">
            <span>+5.2% em relação às últimas 7 auditorias</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights -->
    <div class="insights-section">
      <div class="insights-header">
        <h2>📊 Insights da Performance</h2>
        <span class="insights-count">3 insights identificados</span>
      </div>
      <div class="insights-grid">
        <div class="insight-card positive">
          <div class="insight-icon">🚀</div>
          <div class="insight-content">
            <h4>Performance em Alta</h4>
            <p>Setor de Hortifruti atingiu 95% de conformidade</p>
          </div>
          <div class="insight-badge">Recomendação</div>
        </div>
        <div class="insight-card warning">
          <div class="insight-icon">⚠️</div>
          <div class="insight-content">
            <h4>Atenção Necessária</h4>
            <p>Bebidas com 76% precisa de intervenção</p>
          </div>
          <div class="insight-badge">Alerta</div>
        </div>
        <div class="insight-card info">
          <div class="insight-icon">📈</div>
          <div class="insight-content">
            <h4>Tendência Positiva</h4>
            <p>Crescimento de 8% na taxa de acerto mensal</p>
          </div>
          <div class="insight-badge">Tendência</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
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
  LineController,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Filler,
} from "chart.js";

// Registrar todos os componentes do Chart.js
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Filler
);

// Refs para os canvas
const barChart = ref(null);
const doughnutChart = ref(null);
const lineChart = ref(null);
const radarChart = ref(null);

// Refs para as instâncias dos gráficos
const barChartInstance = ref(null);
const doughnutChartInstance = ref(null);
const lineChartInstance = ref(null);
const radarChartInstance = ref(null);

const activePeriod = ref("month");
const timePeriods = [
  { label: "Semana", value: "week" },
  { label: "Mês", value: "month" },
  { label: "Trimestre", value: "quarter" },
  { label: "Ano", value: "year" },
];

const statistics = ref([
  {
    title: "Total de Auditorias",
    value: "5",
    trend: "up",
    trendValue: "+12%",
    trendIcon: "↑",
    emoji: "📋",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    progress: 85,
  },
  {
    title: "Colaboradores da Loja",
    value: "34",
    trend: "up",
    trendValue: "34",
    trendIcon: "↑",
    emoji: "👷‍♀️",
    color: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    progress: 50,
  },
  {
    title: "Ranking Geral",
    value: "3",
    trend: "up",
    trendValue: "+8.7%",
    trendIcon: "↑",
    emoji: "🏆",
    color: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
    progress: 98,
  },
  {
    title: "Cancelamentos Auditorias",
    value: "20",
    trend: "up",
    trendValue: "+150%",
    trendIcon: "↑",
    emoji: "🚫",
    color: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
    progress: 220,
  },
]);

// Dados dos gráficos por período
const chartData = {
  week: {
    auditorias: [3, 5, 4, 6, 8, 5, 7],
    performance: [85, 88, 90, 87, 92, 94, 91],
    setores: [92, 85, 88, 91, 86, 73],
    tipos: [45, 30, 25],
  },
  month: {
    auditorias: [12, 19, 15, 22, 30, 25, 28, 32, 27, 20, 18, 24],
    performance: [85, 88, 90, 87, 92, 94, 91],
    setores: [95, 88, 91, 94, 89, 76],
    tipos: [60, 25, 15],
  },
  quarter: {
    auditorias: [45, 67, 55],
    performance: [87, 90, 93],
    setores: [93, 86, 89, 92, 87, 78],
    tipos: [55, 30, 15],
  },
  year: {
    auditorias: [180, 195, 210, 230],
    performance: [88, 91, 94, 96],
    setores: [94, 87, 90, 93, 88, 79],
    tipos: [58, 27, 15],
  },
};

onMounted(async () => {
  await nextTick();
  initializeCharts();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  destroyCharts();
  window.removeEventListener("resize", handleResize);
});

watch(activePeriod, () => {
  updateChartData();
});

const handleResize = () => {
  if (barChartInstance.value) barChartInstance.value.resize();
  if (doughnutChartInstance.value) doughnutChartInstance.value.resize();
  if (lineChartInstance.value) lineChartInstance.value.resize();
  if (radarChartInstance.value) radarChartInstance.value.resize();
};

const destroyCharts = () => {
  if (barChartInstance.value) {
    barChartInstance.value.destroy();
    barChartInstance.value = null;
  }
  if (doughnutChartInstance.value) {
    doughnutChartInstance.value.destroy();
    doughnutChartInstance.value = null;
  }
  if (lineChartInstance.value) {
    lineChartInstance.value.destroy();
    lineChartInstance.value = null;
  }
  if (radarChartInstance.value) {
    radarChartInstance.value.destroy();
    radarChartInstance.value = null;
  }
};

const initializeCharts = () => {
  try {
    if (
      !radarChart.value ||
      !barChart.value ||
      !doughnutChart.value ||
      !lineChart.value
    ) {
      console.warn("Canvas elements not found. Charts cannot be initialized.");
      return;
    }

    // Gráfico de Radar
    radarChartInstance.value = new Chart(radarChart.value, {
      type: "radar",
      data: {
        labels: [
          "Hortifruti",
          "Açougue",
          "Padaria",
          "Laticínios",
          "Mercearia",
          "Bebidas",
        ],
        datasets: [
          {
            label: "Desempenho",
            data: chartData[activePeriod.value].setores,
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderColor: "#667eea",
            borderWidth: 2,
            pointBackgroundColor: "#667eea",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#667eea",
            pointRadius: 4,
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
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
          },
        },
      },
    });

    // Gráfico de Barras
    const barLabels =
      activePeriod.value === "week"
        ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
        : activePeriod.value === "quarter"
        ? ["Q1", "Q2", "Q3"]
        : activePeriod.value === "year"
        ? ["2021", "2022", "2023", "2024"]
        : [
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
          ];

    barChartInstance.value = new Chart(barChart.value, {
      type: "bar",
      data: {
        labels: barLabels,
        datasets: [
          {
            label: "Auditorias",
            data: chartData[activePeriod.value].auditorias,
            backgroundColor: "rgba(102, 126, 234, 0.8)",
            borderRadius: 8,
            borderSkipped: false,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
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

    // Gráfico de Rosca
    doughnutChartInstance.value = new Chart(doughnutChart.value, {
      type: "doughnut",
      data: {
        labels: ["Etiqueta", "Presença", "Ruptura"],
        datasets: [
          {
            data: chartData[activePeriod.value].tipos,
            backgroundColor: [
              "rgba(102, 126, 234, 0.8)",
              "rgba(76, 175, 80, 0.8)",
              "rgba(255, 107, 107, 0.8)",
            ],
            borderWidth: 0,
            spacing: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
          },
        },
      },
    });

    // Gráfico de Linha
    lineChartInstance.value = new Chart(lineChart.value, {
      type: "line",
      data: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [
          {
            label: "Performance",
            data: chartData[activePeriod.value].performance,
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
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
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
            grid: {
              color: "rgba(0,0,0,0.05)",
              drawBorder: false,
            },
            min: 70,
            max: 100,
            ticks: {
              padding: 10,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Erro ao inicializar gráficos:", error);
  }
};

const updateChartData = () => {
  try {
    const currentData = chartData[activePeriod.value];

    if (!currentData) {
      console.warn(
        `Dados não encontrados para o período: ${activePeriod.value}`
      );
      return;
    }

    // Atualizar gráfico de radar
    if (radarChartInstance.value) {
      radarChartInstance.value.data.datasets[0].data = currentData.setores;
      radarChartInstance.value.update("active");
    }

    // Atualizar gráfico de barras
    if (barChartInstance.value) {
      const barLabels =
        activePeriod.value === "week"
          ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
          : activePeriod.value === "quarter"
          ? ["Q1", "Q2", "Q3"]
          : activePeriod.value === "year"
          ? ["2021", "2022", "2023", "2024"]
          : [
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
            ];

      barChartInstance.value.data.labels = barLabels;
      barChartInstance.value.data.datasets[0].data = currentData.auditorias;
      barChartInstance.value.update("active");
    }

    // Atualizar gráfico de rosca
    if (doughnutChartInstance.value) {
      doughnutChartInstance.value.data.datasets[0].data = currentData.tipos;
      doughnutChartInstance.value.update("active");
    }

    // Atualizar gráfico de linha
    if (lineChartInstance.value) {
      lineChartInstance.value.data.datasets[0].data = currentData.performance;
      lineChartInstance.value.update("active");
    }
  } catch (error) {
    console.error("Erro ao atualizar dados dos gráficos:", error);
  }
};
</script>

<style scoped>
/* Estilos Gerais */
.estatisticas-container {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(102, 126, 234, 0.08);
  margin: 2rem 0;
  overflow: hidden;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

/* Header */
.estatisticas-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2.5rem 2rem;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.title-icon {
  font-size: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.title-text h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #fff 0%, #f0f4ff 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.time-filter {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  backdrop-filter: blur(10px);
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
}

.filter-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.export-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/* Seção de Estatísticas */
.stats-section {
  padding: 2.5rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease-out;
  animation-delay: calc(var(--animation-order) * 0.1s);
  animation-fill-mode: both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.03;
}

.shape-1 {
  width: 120px;
  height: 120px;
  background: #667eea;
  top: -30px;
  right: -30px;
}

.shape-2 {
  width: 80px;
  height: 80px;
  background: #764ba2;
  bottom: -20px;
  left: -20px;
}

.stat-content {
  position: relative;
  z-index: 2;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-emoji {
  font-size: 1.8rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-trend.up {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.stat-trend.down {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.trend-icon {
  font-size: 1.1rem;
}

.stat-values {
  margin-bottom: 1.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #2c3e50, #4a5568);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-title {
  font-size: 1rem;
  color: #718096;
  font-weight: 500;
}

.stat-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.progress-text {
  font-size: 0.85rem;
  color: #a0aec0;
  font-weight: 500;
}

/* Seção de Gráficos */
.charts-section {
  padding: 2.5rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.chart-card.large {
  grid-column: span 2;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.chart-title h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.chart-title p {
  margin: 0;
  color: #718096;
  font-size: 0.95rem;
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.chart-action-btn {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: none;
  border-radius: 8px;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.chart-action-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-color.high {
  background: #4caf50;
}

.legend-color.medium {
  background: #ff9800;
}

.legend-color.low {
  background: #f44336;
}

.chart-stats {
  margin-top: 1rem;
}

.stat-mini {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.stat-mini-item {
  text-align: center;
}

.stat-mini-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-mini-label {
  font-size: 0.85rem;
  color: #718096;
}

.performance-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.performance-badge.positive {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

/* Seção de Insights */
.insights-section {
  padding: 2.5rem 2rem;
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.insights-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.insights-count {
  color: #718096;
  font-weight: 500;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.insight-card.positive {
  border-left-color: #4caf50;
}

.insight-card.warning {
  border-left-color: #ff9800;
}

.insight-card.info {
  border-left-color: #667eea;
}

.insight-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.insight-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.insight-content p {
  margin: 0;
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
}

.insight-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.insight-card.positive .insight-badge {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.insight-card.warning .insight-badge {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.insight-card.info .insight-badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

/* Responsividade */
@media (max-width: 1200px) {
  .chart-card.large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .estatisticas-header {
    padding: 2rem 1.5rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-actions {
    align-items: stretch;
    width: 100%;
  }

  .time-filter {
    justify-content: center;
  }

  .stats-section,
  .charts-section,
  .insights-section {
    padding: 2rem 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    gap: 1rem;
  }

  .insights-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .estatisticas-container {
    margin: 1rem 0;
    border-radius: 16px;
  }

  .title-text h1 {
    font-size: 1.8rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .chart-card {
    padding: 1.5rem;
  }

  .chart-container {
    height: 250px;
  }
}
</style>
