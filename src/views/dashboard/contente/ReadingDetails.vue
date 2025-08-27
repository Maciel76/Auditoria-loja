<template>
  <div class="reading-details">
    <div class="panel-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">📖</div>
          <h2>Detalhes da Leitura</h2>
        </div>
        <div class="header-controls">
          <div class="time-filter">
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
          <button class="refresh-btn" @click="refreshData">
            <span class="refresh-icon">🔄</span>
          </button>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">⏰</div>
        <div class="stat-content">
          <div class="stat-value">{{ lastReading }}</div>
          <div class="stat-label">Última Leitura</div>
          <div class="stat-trend">+15min</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">✅</div>
        <div class="stat-content">
          <div class="stat-value">92.99%</div>
          <div class="stat-label">Taxa de Sucesso</div>
          <div class="stat-trend success">+2.5%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">⚡</div>
        <div class="stat-content">
          <div class="stat-value">1.2s</div>
          <div class="stat-label">Tempo Médio</div>
          <div class="stat-trend warning">-0.3s</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">📊</div>
        <div class="stat-content">
          <div class="stat-value">245/min</div>
          <div class="stat-label">Velocidade</div>
          <div class="stat-trend info">+18/min</div>
        </div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-header">
        <h3>Progresso da Leitura</h3>
        <div class="progress-percentage">{{ progressPercentage }}%</div>
      </div>
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
    </div>

    <div class="timeline-section">
      <div class="section-header">
        <h3>Histórico de Leituras</h3>
        <div class="section-badge">{{ timelineData.length }} eventos</div>
      </div>
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

    <div class="actions-section">
      <div class="action-group">
        <button class="action-btn primary" @click="exportReport">
          <span class="btn-icon">📄</span>
          <span class="btn-text">Exportar Relatório</span>
        </button>
        <button class="action-btn secondary" @click="showFullHistory">
          <span class="btn-icon">📋</span>
          <span class="btn-text">Histórico Completo</span>
        </button>
      </div>
      <div class="action-group">
        <button class="action-btn outline" @click="generateAnalysis">
          <span class="btn-icon">📈</span>
          <span class="btn-text">Análise Detalhada</span>
        </button>
        <button class="action-btn outline" @click="sendNotification">
          <span class="btn-icon">🔔</span>
          <span class="btn-text">Notificar Equipe</span>
        </button>
      </div>
    </div>

    <div class="panel-footer">
      <div class="footer-info">
        <span class="info-icon">⏱️</span>
        <span>Atualizado: {{ lastUpdate }}</span>
      </div>
      <div class="footer-stats">
        <span class="stat">📊 12.5K leituras</span>
        <span class="stat">👥 24 colaboradores</span>
        <span class="stat">⏰ 3.2h total</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReadingDetails",
  props: {
    lastReading: String,
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
          description: "Leitura finalizada - 9299 itens lidos",
        },
        {
          time: "13:45",
          description: "Leitura em andamento - 8456 itens lidos",
        },
        {
          time: "12:30",
          description: "Leitura em andamento - 7234 itens lidos",
        },
        {
          time: "11:15",
          description: "Leitura em andamento - 5678 itens lidos",
        },
        {
          time: "10:00",
          description: "Leitura iniciada - 1234 itens lidos",
        },
      ],
      progressPercentage: 92.99,
      progressMarkers: [
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

<style>
:root {
  /* Cores para o painel de detalhes */
  --details-primary: #4361ee;
  --details-secondary: #3a0ca3;
  --details-success: #4caf50;
  --details-warning: #ff9800;
  --details-info: #2196f3;
  --details-bg: #ffffff;
  --details-text: #212529;
  --details-text-light: #6c757d;
  --details-border: #dee2e6;
  --details-shadow: rgba(0, 0, 0, 0.08);
}

.reading-details {
  background: var(--details-bg);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px var(--details-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.panel-header {
  margin-bottom: 10px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.title-section h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--details-text);
  background: linear-gradient(
    135deg,
    var(--details-primary),
    var(--details-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--details-border);
  border-radius: 8px;
  background: var(--details-bg);
  color: var(--details-text);
  font-size: 0.9rem;
  min-width: 120px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--details-border);
  border-radius: 8px;
  background: var(--details-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: var(--details-primary);
  color: white;
  border-color: var(--details-primary);
  transform: rotate(180deg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 10px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--details-primary),
    var(--details-secondary)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--details-shadow);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-icon.primary {
  background: rgba(67, 97, 238, 0.15);
  color: var(--details-primary);
}

.stat-icon.success {
  background: rgba(76, 175, 80, 0.15);
  color: var(--details-success);
}

.stat-icon.warning {
  background: rgba(255, 152, 0, 0.15);
  color: var(--details-warning);
}

.stat-icon.info {
  background: rgba(33, 150, 243, 0.15);
  color: var(--details-info);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--details-text);
  margin-bottom: 2px;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--details-text-light);
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}

.stat-trend.success {
  background: rgba(76, 175, 80, 0.15);
  color: var(--details-success);
}

.stat-trend.warning {
  background: rgba(255, 152, 0, 0.15);
  color: var(--details-warning);
}

.stat-trend.info {
  background: rgba(33, 150, 243, 0.15);
  color: var(--details-info);
}

.progress-section {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 20px;
  border-radius: 16px;
  margin: 10px 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--details-text);
  font-weight: 600;
}

.progress-percentage {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--details-success);
  background: rgba(76, 175, 80, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

.progress-container {
  position: relative;
  height: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  width: 100%;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--details-success),
    #66bb6a,
    var(--details-success)
  );
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
  background: var(--details-bg);
  border: 2px solid var(--details-text-light);
  border-radius: 50%;
  margin: 0 auto 4px;
}

.progress-marker.active .marker-dot {
  background: var(--details-success);
  border-color: var(--details-success);
}

.marker-label {
  font-size: 0.7rem;
  color: var(--details-text-light);
  font-weight: 600;
}

.timeline-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 10px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--details-text);
  font-weight: 600;
}

.section-badge {
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--details-text-light);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.timeline::-webkit-scrollbar {
  width: 6px;
}

.timeline::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.timeline::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.timeline-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.timeline-item.highlight {
  background: linear-gradient(
    135deg,
    rgba(67, 97, 238, 0.1),
    rgba(67, 97, 238, 0.05)
  );
  border-left: 4px solid var(--details-primary);
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
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.marker-line {
  width: 2px;
  flex: 1;
  background: var(--details-border);
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
  color: var(--details-text);
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
  color: var(--details-success);
}

.timeline-badge.warning {
  background: rgba(255, 152, 0, 0.15);
  color: var(--details-warning);
}

.timeline-badge.info {
  background: rgba(33, 150, 243, 0.15);
  color: var(--details-info);
}

.timeline-desc {
  font-size: 0.9rem;
  color: var(--details-text);
  margin-bottom: 8px;
  line-height: 1.4;
}

.timeline-metrics {
  display: flex;
  gap: 12px;
}

.metric {
  font-size: 0.75rem;
  color: var(--details-text-light);
  font-weight: 500;
}

.actions-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 10px 0;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: var(--details-bg);
  color: var(--details-text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-align: left;
}

.action-btn.primary {
  background: var(--details-primary);
  color: white;
}

.action-btn.primary:hover {
  background: var(--details-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(67, 97, 238, 0.3);
}

.action-btn.secondary {
  background: rgba(0, 0, 0, 0.05);
}

.action-btn.secondary:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.action-btn.outline {
  border-color: var(--details-border);
}

.action-btn.outline:hover {
  border-color: var(--details-primary);
  color: var(--details-primary);
  transform: translateY(-2px);
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--details-border);
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--details-text-light);
}

.footer-stats {
  display: flex;
  gap: 16px;
}

.footer-stats .stat {
  font-size: 0.8rem;
  color: var(--details-text-light);
  font-weight: 500;
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
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .reading-details {
    padding: 20px;
    gap: 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .panel-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .footer-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .title-section h2 {
    font-size: 1.3rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
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

  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .timeline-metrics {
    flex-wrap: wrap;
  }
}
</style>
