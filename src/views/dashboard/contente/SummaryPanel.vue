<template>
  <div class="summary-panel">
    <div class="panel-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">📋</div>
          <h2>Resumo de Leituras</h2>
        </div>
        <div
          class="status-badge"
          :class="unreadPercentage > 5 ? 'warning' : 'success'"
        >
          <span class="badge-icon">{{
            unreadPercentage > 5 ? "⚠️" : "✅"
          }}</span>
          <span class="badge-text">{{ unreadPercentage }}% não lidos</span>
        </div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-info">
        <div class="progress-labels">
          <span class="progress-label">
            <span class="label-icon">✔️</span>
            Lidos: {{ read }}
          </span>
          <span class="progress-label">
            <span class="label-icon">📦</span>
            Total: {{ total }}
          </span>
        </div>
        <div class="progress-percentage">
          {{ readPercentage.toFixed(1) }}% concluído
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: readPercentage + '%' }">
            <div class="progress-shimmer"></div>
          </div>
        </div>
        <div class="progress-marker" :style="{ left: readPercentage + '%' }">
          <div class="marker-dot"></div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ total }}</div>
          <div class="stat-label">Estoque Total</div>
        </div>
        <div class="stat-trend">+2%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ read }}</div>
          <div class="stat-label">Lidos</div>
        </div>
        <div class="stat-trend success">+8%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ unread }}</div>
          <div class="stat-label">Não Lidos</div>
        </div>
        <div class="stat-trend warning">-5%</div>
      </div>
    </div>

    <div class="performance-section">
      <div class="performance-item">
        <div class="performance-icon">⚡</div>
        <div class="performance-info">
          <div class="performance-value">92.3%</div>
          <div class="performance-label">Eficiência</div>
        </div>
      </div>
      <div class="performance-item">
        <div class="performance-icon">🕒</div>
        <div class="performance-info">
          <div class="performance-value">1.2h</div>
          <div class="performance-label">Tempo médio</div>
        </div>
      </div>
    </div>

    <div class="panel-footer">
      <div class="footer-info">
        <span class="update-info">🔄 Atualizado: {{ lastUpdate }}</span>
      </div>
      <button class="action-btn" @click="handleRefresh">
        <span class="btn-icon">↻</span>
        Atualizar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SummaryPanel",
  props: {
    total: Number,
    read: Number,
    unread: Number,
    percentage: Number,
  },
  data() {
    return {
      lastUpdate: new Date().toLocaleTimeString("pt-BR"),
    };
  },
  computed: {
    readPercentage() {
      return (this.read / this.total) * 100;
    },
    unreadPercentage() {
      return (this.unread / this.total) * 100;
    },
  },
  methods: {
    handleRefresh() {
      this.lastUpdate = new Date().toLocaleTimeString("pt-BR");
      this.$emit("refresh");
    },
  },
};
</script>

<style>
:root {
  /* Cores para o painel de resumo */
  --summary-primary: #4361ee;
  --summary-secondary: #3a0ca3;
  --summary-success: #4caf50;
  --summary-warning: #ff9800;
  --summary-danger: #f44336;
  --summary-bg: #ffffff;
  --summary-text: #212529;
  --summary-text-light: #6c757d;
  --summary-border: #dee2e6;
  --summary-shadow: rgba(0, 0, 0, 0.08);
}

.summary-panel {
  background: var(--summary-bg);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px var(--summary-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  position: relative;
  overflow: hidden;
}

.summary-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--summary-primary),
    var(--summary-secondary)
  );
}

.panel-header {
  margin-bottom: 10px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: var(--summary-text);
  background: linear-gradient(
    135deg,
    var(--summary-primary),
    var(--summary-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.status-badge.success {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.status-badge.warning {
  background: rgba(255, 152, 0, 0.15);
  color: #ef6c00;
  border: 1px solid rgba(255, 152, 0, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.progress-section {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 20px;
  border-radius: 16px;
  margin: 10px 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-labels {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--summary-text-light);
  font-weight: 500;
}

.label-icon {
  font-size: 0.8rem;
}

.progress-percentage {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--summary-success);
  background: rgba(76, 175, 80, 0.1);
  padding: 8px 12px;
  border-radius: 12px;
}

.progress-container {
  position: relative;
  height: 16px;
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
    var(--summary-success),
    #66bb6a,
    var(--summary-success)
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

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.marker-dot {
  width: 20px;
  height: 20px;
  background: var(--summary-bg);
  border: 3px solid var(--summary-success);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 10px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 14px;
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
    var(--summary-primary),
    var(--summary-secondary)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--summary-shadow);
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

.stat-icon.total {
  background: rgba(67, 97, 238, 0.15);
  color: var(--summary-primary);
}

.stat-icon.success {
  background: rgba(76, 175, 80, 0.15);
  color: var(--summary-success);
}

.stat-icon.warning {
  background: rgba(255, 152, 0, 0.15);
  color: var(--summary-warning);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--summary-text);
  margin-bottom: 2px;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--summary-text-light);
  font-weight: 500;
}

.stat-trend {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.1);
}

.stat-trend.success {
  background: rgba(76, 175, 80, 0.15);
  color: var(--summary-success);
}

.stat-trend.warning {
  background: rgba(255, 152, 0, 0.15);
  color: var(--summary-warning);
}

.performance-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 10px 0;
}

.performance-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
}

.performance-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.performance-info {
  flex: 1;
}

.performance-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--summary-text);
  margin-bottom: 2px;
}

.performance-label {
  font-size: 0.75rem;
  color: var(--summary-text-light);
  font-weight: 500;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--summary-border);
}

.footer-info {
  font-size: 0.85rem;
  color: var(--summary-text-light);
}

.update-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--summary-border);
  border-radius: 20px;
  background: var(--summary-bg);
  color: var(--summary-text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
}

.action-btn:hover {
  background: var(--summary-primary);
  color: white;
  border-color: var(--summary-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.action-btn:hover .btn-icon {
  transform: rotate(180deg);
}

/* Responsividade */
@media (max-width: 768px) {
  .summary-panel {
    padding: 20px;
    gap: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .performance-section {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .progress-info {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .panel-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .title-section h2 {
    font-size: 1.3rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .stat-content {
    text-align: center;
  }

  .performance-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>
