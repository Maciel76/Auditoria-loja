<template>
  <div class="reading-details-full">
    <div class="header-main">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">📊</div>
          <h1>Analise Auditoria - Etiqueta</h1>
        </div>
        <div class="header-controls">
          <div class="time-filter">
            <span class="filter-label">Período:</span>
            <select v-model="selectedPeriod" class="filter-select">
              <option
                v-for="period in timePeriods"
                :key="period.value"
                :value="period.value"
              >
                {{ period.label }}
              </option>
            </select>
          </div>
          <div class="header-buttons">
            <button class="header-btn primary" @click="refreshData">
              <span class="btn-icon">🔄</span>
              Atualizar Dados
            </button>
          </div>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <span class="stat-icon">⏱️</span>
          <span class="stat-text">Atualizado: {{ lastUpdate }}</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">📊</span>
          <span class="stat-text">12.5K leituras</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">👥</span>
          <span class="stat-text">24 colaboradores</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">⏰</span>
          <span class="stat-text">3.2h total</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">⏰</span>
          <span class="stat-text">1.2h Restante</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- Primeira linha: Estatísticas principais -->
      <div class="stats-row">
        <div class="stat-card large">
          <div class="stat-header">
            <div class="stat-icon-container primary">
              <span class="stat-icon">⏰</span>
            </div>
          </div>
          <div class="stat-value">{{ lastReading }}</div>
          <div class="stat-label">Última Leitura</div>
          <div class="stat-comparison">vs. 14:15 anterior</div>
        </div>

        <div class="stat-card large">
          <div class="stat-header">
            <div class="stat-icon-container success">
              <span class="stat-icon">✅</span>
            </div>
          </div>
          <div class="stat-value">92.99%</div>
          <br />
          <div class="stat-label">Taxa de Sucesso</div>
          <div class="stat-comparison">Meta: 95%</div>
        </div>

        <div class="stat-card large">
          <div class="stat-header">
            <div class="stat-icon-container warning">
              <span class="stat-icon">⚡</span>
            </div>
          </div>
          <div class="stat-value">1.2s</div>
          <div class="stat-label">Tempo Médio</div>
          <div class="stat-comparison">Melhor: 0.8s</div>
        </div>

        <div class="stat-card large">
          <div class="stat-header">
            <div class="stat-icon-container info">
              <span class="stat-icon">📊</span>
            </div>
          </div>
          <div class="stat-value">245/min</div>
          <div class="stat-label">Velocidade</div>
          <div class="stat-comparison">Recorde: 312/min</div>
        </div>
      </div>

      <!-- Segunda linha: Progresso e Status -->
      <div class="content-row">
        <div class="content-col wide">
          <div class="card">
            <div class="card-header">
              <h2>Progresso da Leitura</h2>
              <div class="progress-percentage">{{ progressPercentage }}%</div>
            </div>
            <div class="card-content">
              <div class="progress-container">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: progressPercentage + '%' }"
                  >
                    <div class="progress-shimmer"></div>
                  </div>
                </div>
                <div class="progress-markers">
                  <div
                    v-for="marker in progressMarkers"
                    :key="marker.percentage"
                    class="progress-marker"
                    :style="{ left: marker.percentage + '%' }"
                    :class="{ active: progressPercentage >= marker.percentage }"
                  >
                    <div class="marker-dot"></div>
                    <div class="marker-label">{{ marker.label }}</div>
                  </div>
                </div>
              </div>
              <div class="progress-details">
                <div class="progress-item">
                  <span class="progress-item-label">Itens Processados</span>
                  <span class="progress-item-value">9.299/10.000</span>
                </div>
                <div class="progress-item">
                  <span class="progress-item-label">Tempo Decorrido</span>
                  <span class="progress-item-value">1.2h</span>
                </div>
                <div class="progress-item">
                  <span class="progress-item-label">Itens Restante</span>
                  <span class="progress-item-value">
                    <span style="color: orange">700</span>/10.000</span
                  >
                </div>
                <div class="progress-item">
                  <span class="progress-item-label">Velocidade Média</span>
                  <span class="progress-item-value">245/min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-col">
          <div class="card card-graph">
            <div class="card-header">
              <h2>Status de Leitura</h2>
            </div>
            <div class="card-content">
              <div class="status-chart-container">
                <canvas ref="statusChart"></canvas>
              </div>
              <div class="status-details">
                <div class="status-item">
                  <div class="status-color success"></div>
                  <div class="status-info">
                    <div class="status-value">7.800</div>
                    <div class="status-label">Leituras Bem-sucedidas</div>
                  </div>
                  <div class="status-percentage">78%</div>
                </div>
                <div class="status-item">
                  <div class="status-color warning"></div>
                  <div class="status-info">
                    <div class="status-value">1.499</div>
                    <div class="status-label">Leituras com Avisos</div>
                  </div>
                  <div class="status-percentage">15%</div>
                </div>
                <div class="status-item">
                  <div class="status-color danger"></div>
                  <div class="status-info">
                    <div class="status-value">701</div>
                    <div class="status-label">Falhas na Leitura</div>
                  </div>
                  <div class="status-percentage">7%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Terceira linha: Timeline e Ações -->
      <div class="content-row">
        <div class="content-col">
          <div class="card">
            <div class="card-header">
              <h2>Histórico de Leituras</h2>
              <div class="section-badge">{{ timelineData.length }} eventos</div>
            </div>
            <div class="card-content">
              <div class="timeline">
                <div
                  v-for="(item, index) in timelineData"
                  :key="index"
                  class="timeline-item"
                  :class="{ highlight: index === 0 }"
                >
                  <div class="timeline-marker">
                    <div class="marker-icon">
                      {{ getTimelineIcon(item.description) }}
                    </div>
                    <div class="marker-line"></div>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <div class="timeline-time">{{ item.time }}</div>
                      <div
                        class="timeline-badge"
                        :class="getStatusClass(item.description)"
                      >
                        {{ getStatusText(item.description) }}
                      </div>
                    </div>
                    <div class="timeline-desc">{{ item.description }}</div>
                    <div class="timeline-metrics" v-if="index === 0">
                      <span class="metric">⏱️ 2.3s</span>
                      <span class="metric">✅ 99.8%</span>
                      <span class="metric">⚡ 312/min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-col">
          <div class="card">
            <div class="card-header">
              <h2>Ações Rápidas</h2>
            </div>
            <div class="card-content">
              <div class="actions-grid">
                <button class="action-card primary" @click="generateAnalysis">
                  <div class="action-icon">📈</div>
                  <div class="action-content">
                    <div class="action-title">Análise Detalhada</div>
                    <div class="action-desc">
                      Relatório completo de performance
                    </div>
                  </div>
                </button>

                <button class="action-card success" @click="showFullHistory">
                  <div class="action-icon">📋</div>
                  <div class="action-content">
                    <div class="action-title">Histórico Completo</div>
                    <div class="action-desc">Visualizar todas as leituras</div>
                  </div>
                </button>

                <button class="action-card warning" @click="sendNotification">
                  <div class="action-icon">🔔</div>
                  <div class="action-content">
                    <div class="action-title">Notificar Equipe</div>
                    <div class="action-desc">Enviar alertas e updates</div>
                  </div>
                </button>

                <button class="action-card info" @click="exportReport">
                  <div class="action-icon">📄</div>
                  <div class="action-content">
                    <div class="action-title">Exportar Relatório</div>
                    <div class="action-desc">PDF, CSV ou Excel</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quarta linha: Métricas de Performance -->
      <div class="content-row">
        <div class="content-col full">
          <div class="card">
            <div class="card-header">
              <h2>Métricas de Performance</h2>
            </div>
            <div class="card-content">
              <div class="metrics-grid">
                <div class="metric-item">
                  <div class="metric-icon">🎯</div>
                  <div class="metric-content">
                    <div class="metric-value">94.5%</div>
                    <div class="metric-label">Precisão</div>
                  </div>
                  <div class="metric-trend positive">+2.3%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-icon">🚀</div>
                  <div class="metric-content">
                    <div class="metric-value">278/min</div>
                    <div class="metric-label">Pico de Velocidade</div>
                  </div>
                  <div class="metric-trend positive">+15%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-icon">📦</div>
                  <div class="metric-content">
                    <div class="metric-value">12.5K</div>
                    <div class="metric-label">Itens Processados</div>
                  </div>
                  <div class="metric-trend positive">+8.7%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-icon">⏱️</div>
                  <div class="metric-content">
                    <div class="metric-value">1.8s</div>
                    <div class="metric-label">Tempo Médio</div>
                  </div>
                  <div class="metric-trend negative">-0.4s</div>
                </div>
              </div>
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
  name: "ReadingDetailsFull",
  props: {
    lastReading: String,
  },
  setup() {
    const statusChart = ref(null);
    let chartInstance = null;

    onMounted(() => {
      if (statusChart.value) {
        const ctx = statusChart.value.getContext("2d");

        chartInstance = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Bem-sucedidas", "Com Avisos", "Falhas"],
            datasets: [
              {
                data: [7800, 1499, 701],
                backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
                borderWidth: 0,
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
              },
            },
          },
        });
      }
    });

    return {
      statusChart,
    };
  },
  data() {
    return {
      selectedPeriod: "today",
      timePeriods: [
        { label: "Hoje", value: "today" },
        { label: "Esta Semana", value: "week" },
        { label: "Este Mês", value: "month" },
        { label: "Este Trimestre", value: "quarter" },
      ],
      timelineData: [
        {
          time: "13:58",
          description:
            "Leitura finalizada - 9299 itens processados com 92.99% de sucesso",
        },
        {
          time: "13:45",
          description: "Leitura em andamento - 8456 itens processados",
        },
        {
          time: "12:30",
          description: "Leitura em andamento - 7234 itens processados",
        },
        {
          time: "11:15",
          description: "Leitura em andamento - 5678 itens processados",
        },
        {
          time: "10:00",
          description:
            "Leitura iniciada - Sistema preparado para processar 10000 itens",
        },
      ],
      progressPercentage: 66.0,
      progressMarkers: [
        { percentage: 10, label: "10%" },
        { percentage: 25, label: "25%" },
        { percentage: 50, label: "50%" },
        { percentage: 75, label: "75%" },
        { percentage: 100, label: "100%" },
      ],
      lastUpdate: new Date().toLocaleTimeString("pt-BR"),
    };
  },
  methods: {
    getTimelineIcon(description) {
      if (description.includes("finalizada")) return "✅";
      if (description.includes("andamento")) return "⏳";
      if (description.includes("iniciada")) return "🚀";
      return "📝";
    },
    getStatusClass(description) {
      if (description.includes("finalizada")) return "success";
      if (description.includes("andamento")) return "warning";
      if (description.includes("iniciada")) return "info";
      return "";
    },
    getStatusText(description) {
      if (description.includes("finalizada")) return "Concluído";
      if (description.includes("andamento")) return "Em Andamento";
      if (description.includes("iniciada")) return "Iniciado";
      return "Evento";
    },
    refreshData() {
      this.lastUpdate = new Date().toLocaleTimeString("pt-BR");
      this.$emit("refresh");
      // Simular atualização de dados
      this.progressPercentage = Math.min(100, this.progressPercentage + 2);
    },
    exportReport() {
      console.log("Exportando relatório...");
    },
    showFullHistory() {
      console.log("Mostrando histórico completo...");
    },
    generateAnalysis() {
      console.log("Gerando análise...");
    },
    sendNotification() {
      console.log("Enviando notificação...");
    },
  },
};
</script>

<style scoped>
.reading-details-full {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.header-main {
  width: 100%;
  background: rgb(255, 255, 255);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  font-size: 40px;
}

.title-section h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-weight: 500;
  color: #546e7a;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 0.9rem;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.header-btn.primary {
  background: #4361ee;
  color: white;
}

.header-btn.primary:hover {
  background: #3a0ca3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.header-btn.outline {
  background: transparent;
  border: 1px solid #4361ee;
  color: #4361ee;
}

.header-btn.outline:hover {
  background: rgba(67, 97, 238, 0.1);
}

.header-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #546e7a;
}

.main-content {
  margin: 0;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-card.large {
  display: flex;
  padding: 28px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stat-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-icon-container.primary {
  background: rgba(67, 97, 238, 0.15);
  color: #4361ee;
}

.stat-icon-container.success {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.stat-icon-container.warning {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.stat-icon-container.info {
  background: rgba(33, 150, 243, 0.15);
  color: #2196f3;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
}

.stat-trend.positive {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.stat-trend.negative {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  color: #546e7a;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-comparison {
  font-size: 0.85rem;
  color: #78909c;
}

.content-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.content-col.wide {
  grid-column: span 2;
}

.content-col.full {
  grid-column: span 3;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  height: 100%;
}
.card-graph {
  width: 100%; /* Mudar de 50% para 100% */
  max-width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 600;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: 800;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

.progress-container {
  position: relative;
  height: 20px;
  background: #f1f3f6;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  width: 100%;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4361ee, #3a0ca3);
  border-radius: 10px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

.progress-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.progress-marker {
  position: absolute;
  top: -10px;
  transform: translateX(-50%);
  text-align: center;
}

.marker-dot {
  width: 8px;
  height: 8px;
  background: white;
  border: 2px solid #78909c;
  border-radius: 50%;
  margin: 0 auto 4px;
}

.progress-marker.active .marker-dot {
  background: #4361ee;
  border-color: #4361ee;
}

.marker-label {
  font-size: 0.7rem;
  color: #78909c;
  font-weight: 600;
}

.progress-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-item-label {
  font-weight: 500;
  color: #546e7a;
}

.progress-item-value {
  font-weight: 600;
  color: #2c3e50;
}

.status-chart-container {
  height: 200px;
  position: relative;
  margin-bottom: 20px;
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-color.success {
  background: #4caf50;
}

.status-color.warning {
  background: #ff9800;
}

.status-color.danger {
  background: #f44336;
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

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.timeline-item.highlight {
  background: linear-gradient(
    135deg,
    rgba(67, 97, 238, 0.1),
    rgba(67, 97, 238, 0.05)
  );
  border-left: 4px solid #4361ee;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.marker-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.marker-line {
  width: 2px;
  flex: 1;
  background: #e0e0e0;
}

.timeline-item:last-child .marker-line {
  display: none;
}

.timeline-content {
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-time {
  font-weight: 700;
  color: #2c3e50;
  font-size: 0.9rem;
}

.timeline-badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.timeline-badge.success {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.timeline-badge.warning {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.timeline-badge.info {
  background: rgba(33, 150, 243, 0.15);
  color: #2196f3;
}

.timeline-desc {
  font-size: 0.9rem;
  color: #546e7a;
  margin-bottom: 8px;
  line-height: 1.4;
}

.timeline-metrics {
  display: flex;
  gap: 12px;
}

.metric {
  font-size: 0.75rem;
  color: #78909c;
  font-weight: 500;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  background: #f8f9fa;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-card.primary {
  background: rgba(67, 97, 238, 0.1);
  color: #4361ee;
}

.action-card.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.action-card.warning {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.action-card.info {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.action-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 0.8rem;
  opacity: 0.8;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.metric-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-weight: 700;
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 2px;
}

.metric-label {
  font-size: 0.8rem;
  color: #78909c;
}

.metric-trend {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
}

.metric-trend.positive {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.metric-trend.negative {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.section-badge {
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #78909c;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Responsividade */
@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-row {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-controls {
    flex-direction: column;
    gap: 16px;
  }

  .header-buttons {
    justify-content: center;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .progress-details {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item {
    flex-direction: column;
    gap: 12px;
  }

  .timeline-marker {
    flex-direction: row;
    align-items: center;
  }

  .marker-line {
    width: 100%;
    height: 2px;
  }
}

@media (max-width: 480px) {
  .reading-details-full {
    padding: 10px;
  }

  .header-main {
    padding: 16px;
  }

  .title-section h1 {
    font-size: 1.4rem;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 1.8rem;
  }

  .card {
    padding: 16px;
  }
}
</style>
