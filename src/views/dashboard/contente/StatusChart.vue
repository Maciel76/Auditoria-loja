<template>
  <div class="status-chart">
    <div class="panel-header">
      <h2>Status da Auditoria</h2>
      <div class="info-icon">
        <i class="fas fa-info-circle"></i>
      </div>
    </div>

    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="status-details">
      <div class="status-item">
        <div class="status-color" style="background-color: #4caf50"></div>
        <div class="status-info">
          <div class="status-value">{{ updated }}</div>
          <div class="status-label">Etiqueta Atualizadas</div>
        </div>
        <div class="status-percentage">{{ updatedPercentage }}%</div>
      </div>

      <div class="status-item">
        <div class="status-color" style="background-color: #ff9800"></div>
        <div class="status-info">
          <div class="status-value">{{ outdated }}</div>
          <div class="status-label">Etiqueta Desatualizada</div>
        </div>
        <div class="status-percentage">{{ outdatedPercentage }}%</div>
      </div>

      <div class="status-item">
        <div class="status-color" style="background-color: #f44336"></div>
        <div class="status-info">
          <div class="status-value">{{ unread }}</div>
          <div class="status-label">Etiqueta Não Lidas</div>
        </div>
        <div class="status-percentage">{{ unreadPercentage }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "StatusChart",
  props: {
    updated: Number,
    outdated: Number,
    unread: Number,
  },
  computed: {
    total() {
      return this.updated + this.outdated + this.unread;
    },
    updatedPercentage() {
      return ((this.updated / this.total) * 100).toFixed(2);
    },
    outdatedPercentage() {
      return ((this.outdated / this.total) * 100).toFixed(2);
    },
    unreadPercentage() {
      return ((this.unread / this.total) * 100).toFixed(2);
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
  watch: {
    updated() {
      this.renderChart();
    },
    outdated() {
      this.renderChart();
    },
    unread() {
      this.renderChart();
    },
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext("2d");

      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Atualizado", "Desatualizado", "Não Lidos"],
          datasets: [
            {
              data: [this.updated, this.outdated, this.unread],
              backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
              borderColor: ["#4CAF50", "#FF9800", "#F44336"],
              borderWidth: 1,
              borderRadius: 4,
              hoverOffset: 10,
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
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              callbacks: {
                label: function (context) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${context.label}: ${value} (${percentage}%)`;
                },
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
.status-chart {
  background: white;
  border-radius: 12px;
  border-top: #e7c91c 4px solid;
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

.info-icon {
  color: #90a4ae;
  cursor: pointer;
}

.info-icon:hover {
  color: #546e7a;
}

.chart-container {
  height: 180px;
  position: relative;
  margin-bottom: 20px;
}

.status-details .status-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.status-details .status-item:last-child {
  border-bottom: none;
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
}

.status-info {
  flex: 1;
}

.status-value {
  font-weight: 600;
  font-size: 1.1rem;
}

.status-label {
  font-size: 0.8rem;
  color: #78909c;
}

.status-percentage {
  font-weight: 600;
  color: #546e7a;
}
</style>
