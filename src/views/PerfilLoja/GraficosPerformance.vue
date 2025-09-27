<template>
  <div class="graficos-performance-container">
    <h2>Performance da Loja</h2>
    <div class="charts-wrapper">
      <div class="chart-card">
        <canvas ref="barChart"></canvas>
      </div>
      <div class="chart-card">
        <canvas ref="doughnutChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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

const barChart = ref(null);
const doughnutChart = ref(null);

onMounted(() => {
  // Gráfico de barras: Auditorias por mês
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
          backgroundColor: "rgba(102, 126, 234, 0.7)",
          borderRadius: 8,
        },
        {
          label: "Rupturas",
          data: [2, 3, 1, 4, 2, 5, 3, 2, 4, 3, 2, 1],
          backgroundColor: "rgba(255, 107, 107, 0.7)",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Auditorias e Rupturas por Mês",
          color: "#333",
          font: { size: 18, weight: "bold" },
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#eee" },
        },
      },
    },
  });

  // Gráfico doughnut: Distribuição de tipos de auditoria
  new Chart(doughnutChart.value, {
    type: "doughnut",
    data: {
      labels: ["Etiqueta", "Presença", "Ruptura"],
      datasets: [
        {
          label: "Tipos de Auditoria",
          data: [60, 25, 15],
          backgroundColor: [
            "rgba(102, 126, 234, 0.8)",
            "rgba(46, 204, 113, 0.8)",
            "rgba(255, 107, 107, 0.8)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#333", font: { size: 14 } },
        },
        title: {
          display: true,
          text: "Distribuição dos Tipos de Auditoria",
          color: "#333",
          font: { size: 18, weight: "bold" },
        },
      },
      cutout: "70%",
    },
  });
});
</script>

<style scoped>
.graficos-performance-container {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.08);
  padding: 2rem;
  margin: 2rem 0;
}
.graficos-performance-container h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #667eea;
  font-weight: 700;
}
.charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.chart-card {
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.07);
  padding: 1.5rem 2rem;
  min-width: 320px;
  max-width: 420px;
  flex: 1 1 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
canvas {
  width: 100% !important;
  max-width: 350px;
  height: 280px !important;
}
@media (max-width: 900px) {
  .charts-wrapper {
    flex-direction: column;
    align-items: center;
  }
}
</style>
