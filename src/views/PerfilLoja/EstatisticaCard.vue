<template>
  <div class="graficos-performance-container">
    <div class="section-header">
      <h2>Performance da Loja</h2>
      <div class="time-filter">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          :class="['filter-btn', { active: activePeriod === period.value }]"
          @click="activePeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="stats-cards">
      <div class="stat-card" v-for="stat in statistics" :key="stat.title">
        <div class="stat-icon" :style="{ background: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-title">{{ stat.title }}</div>
          <div class="stat-trend" :class="stat.trend">
            <i :class="stat.trendIcon"></i>
            {{ stat.trendValue }}
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-grid">
      <div class="chart-container large">
        <div class="chart-header">
          <h3>Desempenho por Setor</h3>
          <div class="chart-legend">
            <span class="legend-item"
              ><div class="legend-color high"></div>
              Alto</span
            >
            <span class="legend-item"
              ><div class="legend-color medium"></div>
              Médio</span
            >
            <span class="legend-item"
              ><div class="legend-color low"></div>
              Baixo</span
            >
          </div>
        </div>
        <canvas ref="radarChart"></canvas>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <h3>Auditorias Mensais</h3>
        </div>
        <canvas ref="barChart"></canvas>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <h3>Tipos de Auditoria</h3>
        </div>
        <canvas ref="doughnutChart"></canvas>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <h3>Evolução Semanal</h3>
        </div>
        <canvas ref="lineChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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

const barChart = ref(null);
const doughnutChart = ref(null);
const lineChart = ref(null);
const radarChart = ref(null);

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
    value: "156",
    trend: "up",
    trendValue: "+12%",
    trendIcon: "fas fa-arrow-up",
    icon: "fas fa-clipboard-check",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    title: "Taxa de Acerto",
    value: "92%",
    trend: "up",
    trendValue: "+3.2%",
    trendIcon: "fas fa-arrow-up",
    icon: "fas fa-bullseye",
    color: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
  },
  {
    title: "Itens Verificados",
    value: "12.4k",
    trend: "up",
    trendValue: "+8.7%",
    trendIcon: "fas fa-arrow-up",
    icon: "fas fa-boxes",
    color: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
  },
  {
    title: "Tempo Médio",
    value: "24min",
    trend: "down",
    trendValue: "-15%",
    trendIcon: "fas fa-arrow-down",
    icon: "fas fa-clock",
    color: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
  },
]);

onMounted(() => {
  initializeCharts();
});

watch(activePeriod, () => {
  // Em uma implementação real, aqui buscaria novos dados da API
  updateChartData();
});

const initializeCharts = () => {
  // Gráfico de Radar - Desempenho por Setor
  new Chart(radarChart.value, {
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
          data: [95, 88, 91, 94, 89, 76],
          backgroundColor: "rgba(102, 126, 234, 0.2)",
          borderColor: "#667eea",
          borderWidth: 2,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#667eea",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 50,
          suggestedMax: 100,
          ticks: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });

  // Gráfico de Barras - Auditorias Mensais
  new Chart(barChart.value, {
    type: "bar",
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
          label: "Auditorias",
          data: [12, 19, 15, 22, 30, 25, 28, 32, 27, 20, 18, 24],
          backgroundColor: "rgba(102, 126, 234, 0.8)",
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.05)" },
        },
      },
    },
  });

  // Gráfico de Rosca - Tipos de Auditoria
  new Chart(doughnutChart.value, {
    type: "doughnut",
    data: {
      labels: ["Etiqueta", "Presença", "Ruptura"],
      datasets: [
        {
          data: [60, 25, 15],
          backgroundColor: [
            "rgba(102, 126, 234, 0.8)",
            "rgba(76, 175, 80, 0.8)",
            "rgba(255, 107, 107, 0.8)",
          ],
          borderWidth: 0,
          spacing: 5,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
      },
    },
  });

  // Gráfico de Linha - Evolução Semanal
  new Chart(lineChart.value, {
    type: "line",
    data: {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      datasets: [
        {
          label: "Performance",
          data: [85, 88, 90, 87, 92, 94, 91],
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { color: "rgba(0,0,0,0.05)" },
          min: 80,
          max: 100,
        },
      },
    },
  });
};

const updateChartData = () => {
  // Simulação de atualização de dados baseado no período selecionado
  console.log("Período selecionado:", activePeriod.value);
  // Na implementação real, aqui atualizaria os dados dos gráficos
};
</script>

<style scoped>
.graficos-performance-container {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(102, 126, 234, 0.08);
  padding: 2rem;
  margin: 2rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0;
}

.time-filter {
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
}

.filter-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.filter-btn:hover:not(.active) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

/* Cards de Estatísticas */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-title {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-trend.up {
  color: #4caf50;
}

.stat-trend.down {
  color: #f44336;
}

/* Grid de Gráficos */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.chart-container.large {
  grid-column: span 2;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
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

canvas {
  width: 100% !important;
  height: 250px !important;
}

/* Responsividade */
@media (max-width: 1200px) {
  .chart-container.large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .graficos-performance-container {
    padding: 1.5rem;
    margin: 1rem 0;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .time-filter {
    width: 100%;
    justify-content: center;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .chart-legend {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .graficos-performance-container {
    padding: 1rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .filter-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
