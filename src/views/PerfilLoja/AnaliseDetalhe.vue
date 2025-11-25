<template>
  <div class="analise-detalhe">
    <div class="detalhe-header">
      <h3>Análise Detalhada</h3>
      <p>Análise aprofundada dos dados e métricas</p>
    </div>

    <div class="analise-content">
      <div class="analise-section">
        <h4>📊 Métricas Principais</h4>
        <div class="metrics-grid">
          <div v-for="metric in metrics" :key="metric.name" class="metric-card">
            <span class="metric-name">{{ metric.name }}</span>
            <span class="metric-value" :class="metric.trend">{{
              metric.value
            }}</span>
            <span class="metric-trend" :class="metric.trend">
              {{
                metric.trend === "up"
                  ? "📈"
                  : metric.trend === "down"
                  ? "📉"
                  : "➡️"
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="analise-section">
        <h4>📈 Tendências</h4>
        <div class="chart-container">
          <canvas ref="tendenciaChart"></canvas>
        </div>
      </div>

      <div class="analise-section">
        <h4>🔍 Insights</h4>
        <div class="insights-list">
          <div
            v-for="insight in insights"
            :key="insight.id"
            class="insight-item"
          >
            <span class="insight-icon">{{ insight.icon }}</span>
            <div class="insight-content">
              <strong>{{ insight.title }}</strong>
              <p>{{ insight.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "AnaliseDetalhe",
  props: {
    dados: Object,
  },
  setup() {
    const tendenciaChart = ref(null);
    let chartInstance = null;

    const metrics = ref([
      { name: "Taxa de Conclusão", value: "78.5%", trend: "up" },
      { name: "Produtividade", value: "125 itens/h", trend: "down" },
      { name: "Qualidade", value: "91.2%", trend: "up" },
      { name: "Rupturas", value: "2.1%", trend: "down" },
    ]);

    const insights = ref([
      {
        id: 1,
        icon: "💡",
        title: "Oportunidade de Melhoria",
        description:
          "A produtividade pode ser aumentada em 15% com a otimização do roteiro de auditoria.",
      },
      {
        id: 2,
        icon: "⚠️",
        title: "Atenção Necessária",
        description:
          "A taxa de ruptura aumentou 5% no último mês na região sul.",
      },
      {
        id: 3,
        icon: "🎯",
        title: "Meta Atingida",
        description:
          "A qualidade das auditorias superou a meta de 90% pelo terceiro mês consecutivo.",
      },
    ]);

    onMounted(() => {
      if (tendenciaChart.value) {
        const ctx = tendenciaChart.value.getContext("2d");
        chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            datasets: [
              {
                label: "Taxa de Conclusão",
                data: [65, 68, 72, 75, 78, 82],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Evolução da Taxa de Conclusão",
              },
            },
            scales: {
              y: {
                min: 60,
                max: 100,
                ticks: {
                  callback: function (value) {
                    return value + "%";
                  },
                },
              },
            },
          },
        });
      }
    });

    return {
      tendenciaChart,
      metrics,
      insights,
    };
  },
};
</script>

<style scoped>
.analise-detalhe {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.detalhe-header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.detalhe-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.8em;
}

.detalhe-header p {
  margin: 5px 0 0 0;
  color: #6b7280;
}

.analise-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.analise-section h4 {
  margin: 0 0 20px 0;
  color: #374151;
  font-size: 1.3em;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 15px;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.metric-name {
  font-size: 0.9em;
  color: #6b7280;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 1.8em;
  font-weight: 700;
  margin-bottom: 5px;
}

.metric-value.up {
  color: #10b981;
}
.metric-value.down {
  color: #ef4444;
}

.metric-trend {
  font-size: 1.2em;
}

.chart-container {
  position: relative;
  height: 300px;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 15px;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease;
}

.insight-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.insight-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-content strong {
  display: block;
  margin-bottom: 5px;
  color: #1f2937;
  font-size: 1.1em;
}

.insight-content p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}
</style>
