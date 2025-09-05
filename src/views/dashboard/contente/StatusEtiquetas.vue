<template>
  <div class="status-etiquetas">
    <div class="header">
      <h2>Status de Etiquetas</h2>
      <div class="header-actions">
        <button class="refresh-btn" @click="refreshData">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <div class="charts-container">
      <!-- Gráfico Desatualizadas -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <i class="fas fa-clock"></i>
            Desatualizadas
          </h3>
          <div class="chart-info">
            <i class="fas fa-info-circle"></i>
          </div>
        </div>
        
        <div class="chart-main">
          <div class="circular-progress">
            <div class="progress-circle">
              <svg class="progress-ring" width="120" height="120">
                <circle
                  class="progress-ring-bg"
                  cx="60"
                  cy="60"
                  r="54"
                  stroke-width="8"
                />
                <circle
                  class="progress-ring-fill desatualizadas"
                  cx="60"
                  cy="60"
                  r="54"
                  stroke-width="8"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="desatualizadasOffset"
                />
              </svg>
              <div class="progress-text">
                <span class="progress-value">{{ desatualizadas }}%</span>
              </div>
            </div>
          </div>
          
          <div class="chart-details">
            <div class="detail-item">
              <span class="detail-label">Atual</span>
              <span class="detail-value">{{ desatualizadas }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Mínimo</span>
              <span class="detail-value">0,00%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Máximo</span>
              <span class="detail-value">3,00%</span>
            </div>
          </div>
        </div>

        <div class="chart-footer">
          <div class="trend-indicator negative">
            <i class="fas fa-arrow-down"></i>
            <span>+0.5% desde ontem</span>
          </div>
        </div>
      </div>

      <!-- Gráfico Não Lidas -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <i class="fas fa-eye-slash"></i>
            Não Lidas
          </h3>
          <div class="chart-info">
            <i class="fas fa-info-circle"></i>
          </div>
        </div>
        
        <div class="chart-main">
          <div class="circular-progress">
            <div class="progress-circle">
              <svg class="progress-ring" width="120" height="120">
                <circle
                  class="progress-ring-bg"
                  cx="60"
                  cy="60"
                  r="54"
                  stroke-width="8"
                />
                <circle
                  class="progress-ring-fill nao-lidas"
                  cx="60"
                  cy="60"
                  r="54"
                  stroke-width="8"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="naoLidasOffset"
                />
              </svg>
              <div class="progress-text">
                <span class="progress-value">{{ naoLidas }}%</span>
              </div>
            </div>
          </div>
          
          <div class="chart-details">
            <div class="detail-item">
              <span class="detail-label">Atual</span>
              <span class="detail-value">{{ naoLidas }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Mínimo</span>
              <span class="detail-value">0,00%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Máximo</span>
              <span class="detail-value">100,00%</span>
            </div>
          </div>
        </div>

        <div class="chart-footer">
          <div class="trend-indicator positive">
            <i class="fas fa-arrow-down"></i>
            <span>-2.1% desde ontem</span>
          </div>
        </div>
      </div>
    </div>

    <div class="status-summary">
      <div class="summary-item">
        <div class="summary-icon desatualizadas">
          <i class="fas fa-clock"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ desatualizadas }}%</div>
          <div class="summary-label">Desatualizadas</div>
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-icon nao-lidas">
          <i class="fas fa-eye-slash"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ naoLidas }}%</div>
          <div class="summary-label">Não Lidas</div>
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-icon total">
          <i class="fas fa-tags"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">10.247</div>
          <div class="summary-label">Total de Etiquetas</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'StatusEtiquetas',
  setup() {
    const desatualizadas = ref(2.34);
    const naoLidas = ref(77.08);
    
    // Cálculos para o círculo de progresso
    const radius = 54;
    const circumference = ref(2 * Math.PI * radius);
    
    const desatualizadasOffset = computed(() => {
      return circumference.value - (desatualizadas.value / 100 * circumference.value);
    });
    
    const naoLidasOffset = computed(() => {
      return circumference.value - (naoLidas.value / 100 * circumference.value);
    });
    
    const refreshData = () => {
      // Simular atualização de dados
      desatualizadas.value = parseFloat((Math.random() * 5).toFixed(2));
      naoLidas.value = parseFloat((Math.random() * 100).toFixed(2));
    };
    
    return {
      desatualizadas,
      naoLidas,
      circumference,
      desatualizadasOffset,
      naoLidasOffset,
      refreshData
    };
  }
};
</script>

<style scoped>
.status-etiquetas {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f3f6;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #546e7a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  border-color: #4361ee;
  color: #4361ee;
  transform: rotate(180deg);
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.chart-info {
  color: #78909c;
  cursor: pointer;
  transition: color 0.3s ease;
}

.chart-info:hover {
  color: #4361ee;
}

.chart-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.circular-progress {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: #e9ecef;
}

.progress-ring-fill {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-ring-fill.desatualizadas {
  stroke: #ff9800;
}

.progress-ring-fill.nao-lidas {
  stroke: #f44336;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.chart-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.detail-label {
  font-size: 0.9rem;
  color: #546e7a;
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: #2c3e50;
}

.chart-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 16px;
}

.trend-indicator.positive {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.trend-indicator.negative {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.status-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.2rem;
}

.summary-icon.desatualizadas {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.summary-icon.nao-lidas {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.summary-icon.total {
  background: rgba(67, 97, 238, 0.15);
  color: #4361ee;
}

.summary-content {
  flex: 1;
}

.summary-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 0.85rem;
  color: #78909c;
  font-weight: 500;
}

/* Animações */
@keyframes progressAnimation {
  0% {
    stroke-dashoffset: v-bind('circumference');
  }
}

.progress-ring-fill {
  animation: progressAnimation 1s ease-out;
}

/* Responsividade */
@media (max-width: 1024px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .status-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .status-etiquetas {
    padding: 16px;
  }
  
  .chart-main {
    flex-direction: column;
    text-align: center;
  }
  
  .chart-details {
    width: 100%;
  }
  
  .header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .header h2 {
    font-size: 1.3rem;
  }
  
  .chart-title {
    font-size: 1rem;
  }
  
  .progress-circle {
    width: 100px;
    height: 100px;
  }
  
  .progress-value {
    font-size: 1.2rem;
  }
  
  .summary-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>