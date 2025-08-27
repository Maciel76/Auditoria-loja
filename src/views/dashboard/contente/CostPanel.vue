<template>
  <div class="cost-panel">
    <div class="panel-header">
      <h2>Custo de Ruptura</h2>
      <div class="trend-indicator" :class="trendDirection">
        <i :class="trendIcon"></i>
        <span>{{ trendPercentage }}%</span>
      </div>
    </div>

    <div class="cost-value">
      <span class="currency">R$</span>
      {{ formattedCost }}
      <span class="unit">Mi</span>
    </div>

    <div class="cost-chart">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="cost-comparison">
      <div class="comparison-item">
        <div class="comparison-label">Mês anterior</div>
        <div class="comparison-value">R$ 22,45 Mi</div>
      </div>
      <div class="comparison-item">
        <div class="comparison-label">Variação</div>
        <div class="comparison-value" :class="trendDirection">
          {{ trendDirection === "up" ? "+" : "" }}{{ trendValue }} Mi
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "CostPanel",
  props: {
    cost: String,
  },
  data() {
    return {
      trendDirection: "up",
      trendPercentage: "12.08",
      trendValue: "2.71",
      historicalData: [22.45, 20.18, 23.76, 21.34, 22.89, 25.16],
    };
  },
  computed: {
    formattedCost() {
      return this.cost.replace(" Mi", "");
    },
    trendIcon() {
      return this.trendDirection === "up"
        ? "fas fa-arrow-up"
        : "fas fa-arrow-down";
    },
  },
  mounted() {
    this.renderChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext("2d");

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              label: "Custo de Ruptura",
              data: this.historicalData,
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderColor: "#F44336",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: "#F44336",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
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
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              callbacks: {
                label: function (context) {
                  return `R$ ${context.raw} Mi`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                callback: function (value) {
                  return "R$ " + value;
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.cost-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
}

.trend-indicator.up {
  color: #f44336;
  background-color: rgba(244, 67, 54, 0.1);
}

.trend-indicator.down {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.cost-value {
  font-size: 2rem;
  font-weight: 700;
  color: #f44336;
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
}

.cost-value .currency {
  font-size: 1.2rem;
  margin-right: 4px;
}

.cost-value .unit {
  font-size: 1.2rem;
  margin-left: 4px;
  font-weight: 500;
}

.cost-chart {
  height: 120px;
  position: relative;
  margin-bottom: 20px;
}

.cost-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: auto;
}

.comparison-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f5f7f9;
}

.comparison-label {
  font-size: 0.8rem;
  color: #78909c;
  margin-bottom: 4px;
}

.comparison-value {
  font-weight: 600;
}

.comparison-value.up {
  color: #f44336;
}

.comparison-value.down {
  color: #4caf50;
}
</style>
