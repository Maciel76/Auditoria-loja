<template>
  <div class="insights-container">
    <!-- Header -->
    <div class="header">
      <div class="icon-title">
        <div class="icon-area">📊</div>
        <h1 class="titulo">Insights da Loja</h1>
      </div>
      <div class="periodo-filtro">
        <select v-model="periodoSelecionado" class="filtro-select">
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="trimestre">Este Trimestre</option>
        </select>
      </div>
    </div>

    <!-- Grid de Insights -->
    <div class="insights-grid">
      <!-- Performance -->
      <div class="insight-card performance">
        <div class="card-header">
          <span class="card-icon">🚀</span>
          <h3>Performance</h3>
        </div>
        <div class="card-content">
          <div class="metric-item">
            <div class="metric-info">
              <span class="metric-label">Setor Top</span>
              <span class="metric-value">Eletrônicos</span>
            </div>
            <div class="metric-badge positive">+15%</div>
          </div>
          <div class="metric-item">
            <div class="metric-info">
              <span class="metric-label">Maior Evolução</span>
              <span class="metric-value">Moda</span>
            </div>
            <div class="metric-badge positive">+12%</div>
          </div>
          <div class="progress-chart">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 85%"></div>
            </div>
            <span>Meta: 85% atingida</span>
          </div>
        </div>
      </div>

      <!-- Alertas -->
      <div class="insight-card alertas">
        <div class="card-header">
          <span class="card-icon">⚠️</span>
          <h3>Alertas Críticos</h3>
        </div>
        <div class="card-content">
          <div class="alerta-item urgente">
            <span class="alerta-text">Setor Alimentos -5% abaixo da meta</span>
          </div>
          <div class="alerta-item medio">
            <span class="alerta-text">Alta ruptura em Limpeza</span>
          </div>
          <div class="alerta-item baixo">
            <span class="alerta-text">Estoque baixo em Eletrodomésticos</span>
          </div>
        </div>
      </div>

      <!-- Tendências -->
      <div class="insight-card tendencias">
        <div class="card-header">
          <span class="card-icon">📈</span>
          <h3>Tendências</h3>
        </div>
        <div class="card-content">
          <div class="tendencia-item">
            <div class="trend-indicator positive">↑</div>
            <span>Vendas online +18%</span>
          </div>
          <div class="tendencia-item">
            <div class="trend-indicator positive">↑</div>
            <span>Clientes fiéis +8%</span>
          </div>
          <div class="tendencia-item">
            <div class="trend-indicator negative">↓</div>
            <span>Setor Livros -3%</span>
          </div>
        </div>
      </div>

      <!-- Recomendações -->
      <div class="insight-card recomendacoes">
        <div class="card-header">
          <span class="card-icon">💡</span>
          <h3>Recomendações</h3>
        </div>
        <div class="card-content">
          <div class="recomendacao-item">
            <span class="recomendacao-text"
              >Reforçar equipe no caixa durante pico</span
            >
            <button class="action-btn">Aplicar</button>
          </div>
          <div class="recomendacao-item">
            <span class="recomendacao-text"
              >Treinamento para setor de vendas</span
            >
            <button class="action-btn">Agendar</button>
          </div>
        </div>
      </div>

      <!-- Reconhecimentos -->
      <div class="insight-card reconhecimentos">
        <div class="card-header">
          <span class="card-icon">🏆</span>
          <h3>Reconhecimentos</h3>
        </div>
        <div class="card-content">
          <div class="reconhecimento-item">
            <div class="employee-avatar">👤</div>
            <div class="employee-info">
              <span class="employee-name">Maria Silva</span>
              <span class="achievement">Meta superada em 25%</span>
            </div>
          </div>
          <div class="reconhecimento-item">
            <div class="employee-avatar">👤</div>
            <div class="employee-info">
              <span class="employee-name">João Santos</span>
              <span class="achievement">Melhor atendimento</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Auditorias -->
      <div class="insight-card auditorias">
        <div class="card-header">
          <span class="card-icon">🔍</span>
          <h3>Última Auditoria</h3>
        </div>
        <div class="card-content">
          <div class="auditoria-stats">
            <div class="stat">
              <span class="stat-value">94%</span>
              <span class="stat-label">Pontuação</span>
            </div>
            <div class="stat">
              <span class="stat-value">12</span>
              <span class="stat-label">Itens OK</span>
            </div>
            <div class="stat">
              <span class="stat-value">2</span>
              <span class="stat-label">Ajustes</span>
            </div>
          </div>
          <div class="auditoria-melhorias">
            <span class="melhoria-text"
              >Organização de estoque melhorou 30%</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Analisando dados...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const periodoSelecionado = ref("semana");
const carregando = ref(true);

onMounted(() => {
  // Simular carregamento de dados
  setTimeout(() => {
    carregando.value = false;
  }, 1500);
});
</script>

<style scoped>
.insights-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(67, 97, 238, 0.12);
  padding: 2rem;
  margin: 1.5rem auto;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-area {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 0.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.filtro-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filtro-select:hover {
  border-color: #667eea;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.insight-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.insight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.card-icon {
  font-size: 1.5rem;
  background: #f7fafc;
  border-radius: 10px;
  padding: 0.5rem;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
}

/* Performance Card */
.performance .card-icon {
  background: #ebf8ff;
}

/* Alertas Card */
.alertas .card-icon {
  background: #fed7d7;
}

/* Tendências Card */
.tendencias .card-icon {
  background: #e6fffa;
}

/* Recomendações Card */
.recomendacoes .card-icon {
  background: #faf5ff;
}

/* Reconhecimentos Card */
.reconhecimentos .card-icon {
  background: #fffaf0;
}

/* Auditorias Card */
.auditorias .card-icon {
  background: #f0fff4;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.metric-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.metric-badge.positive {
  background: #c6f6d5;
  color: #22543d;
}

.progress-chart {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #68d391);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.alerta-item {
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.alerta-item.urgente {
  background: #fed7d7;
  border-left: 4px solid #e53e3e;
}

.alerta-item.medio {
  background: #fef5e7;
  border-left: 4px solid #ed8936;
}

.alerta-item.baixo {
  background: #ebf8ff;
  border-left: 4px solid #3182ce;
}

.alerta-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2d3748;
}

.tendencia-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.tendencia-item:last-child {
  border-bottom: none;
}

.trend-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.trend-indicator.positive {
  background: #c6f6d5;
  color: #22543d;
}

.trend-indicator.negative {
  background: #fed7d7;
  color: #c53030;
}

.recomendacao-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.recomendacao-item:last-child {
  border-bottom: none;
}

.recomendacao-text {
  font-size: 0.95rem;
  color: #2d3748;
  flex: 1;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.reconhecimento-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.reconhecimento-item:last-child {
  border-bottom: none;
}

.employee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.employee-info {
  display: flex;
  flex-direction: column;
}

.employee-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.achievement {
  font-size: 0.85rem;
  color: #718096;
}

.auditoria-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
}

.auditoria-melhorias {
  padding: 1rem;
  background: #f0fff4;
  border-radius: 10px;
  border-left: 4px solid #48bb78;
}

.melhoria-text {
  font-size: 0.95rem;
  color: #22543d;
  font-weight: 500;
}

.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .insights-container {
    padding: 1rem;
    margin: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .auditoria-stats {
    grid-template-columns: 1fr;
  }
}
</style>
