<!-- components/ProgressBar.vue - Componente de barra de progresso -->
<template>
  <div class="progress-container">
    <!-- Barra de Progresso Principal -->
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${progress.percentage}%` }"
      >
        <span class="progress-text">{{ progress.percentage }}%</span>
      </div>
    </div>

    <!-- Mensagem Atual -->
    <div class="progress-message">
      <span class="message-icon">
        <span v-if="progress.status === 'concluido'">🎉</span>
        <span v-else-if="progress.status === 'erro'">❌</span>
        <span v-else class="loading-dots">⏳</span>
      </span>
      {{ progress.message }}
    </div>

    <!-- Detalhes dos Estágios -->
    <div class="stages-container" v-if="showStages">
      <div
        v-for="(stage, key) in progress.stages"
        :key="key"
        class="stage-item"
        :class="{
          'completed': stage.completed,
          'in-progress': !stage.completed && stage.percentage > 0,
          'pending': stage.percentage === 0
        }"
      >
        <div class="stage-info">
          <span class="stage-icon">
            <span v-if="stage.completed">✅</span>
            <span v-else-if="stage.percentage > 0" class="mini-spinner">🔄</span>
            <span v-else>⏸️</span>
          </span>
          <span class="stage-name">{{ stage.name }}</span>
        </div>
        <div class="stage-progress">
          <span class="stage-percentage">{{ stage.percentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  progress: {
    type: Object,
    required: true
  },
  showStages: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.progress-container {
  margin: 1.5rem 0;
}

/* Barra de Progresso Principal */
.progress-bar {
  width: 100%;
  height: 40px;
  background: linear-gradient(90deg, #e2e8f0 0%, #f7fafc 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 50%, #2f855a 100%);
  border-radius: 20px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 60px;
  animation: progress-shine 2s ease-in-out infinite;
}

@keyframes progress-shine {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.progress-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Mensagem de Status */
.progress-message {
  text-align: center;
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f8faff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  color: #4a5568;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.message-icon {
  font-size: 1.2rem;
}

.loading-dots {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Estágios */
.stages-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.stage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.stage-item:last-child {
  border-bottom: none;
}

.stage-item.completed {
  background: linear-gradient(90deg, #f0fff4 0%, transparent 100%);
  color: #22543d;
}

.stage-item.in-progress {
  background: linear-gradient(90deg, #eff6ff 0%, transparent 100%);
  color: #1e40af;
  font-weight: 500;
}

.stage-item.pending {
  color: #718096;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stage-icon {
  font-size: 1.1rem;
}

.mini-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stage-name {
  font-weight: 500;
}

.stage-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stage-percentage {
  font-weight: bold;
  font-size: 0.9rem;
  min-width: 40px;
  text-align: right;
}

/* Estados especiais */
.progress-container.completed .progress-fill {
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
}

.progress-container.error .progress-fill {
  background: linear-gradient(90deg, #f56565 0%, #e53e3e 100%);
}

/* Responsividade */
@media (max-width: 640px) {
  .progress-bar {
    height: 35px;
  }

  .stage-item {
    padding: 0.5rem 0;
  }

  .stage-name {
    font-size: 0.9rem;
  }

  .stage-percentage {
    font-size: 0.8rem;
  }
}
</style>