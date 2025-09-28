<template>
  <div class="metricas-container">
    <!-- Header com Filtros -->
    <div class="metricas-header">
      <div class="header-left">
        <div class="icon-title">
          <div class="icon-area">📊</div>
          <h1 class="titulo">Métricas de Auditoria</h1>
        </div>
        <p class="descricao">
          Acompanhe os principais indicadores de auditoria da loja em tempo real
        </p>
      </div>
      <div class="header-controls">
        <select v-model="periodoSelecionado" class="filtro-select">
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="trimestre">Este Trimestre</option>
          <option value="ano">Este Ano</option>
        </select>
        <button class="relatorio-btn" @click="gerarRelatorio">
          📥 Relatório
        </button>
      </div>
    </div>

    <!-- Grid de Métricas Principais -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon total">📋</div>
        <div class="kpi-content">
          <span class="kpi-valor">24</span>
          <span class="kpi-label">Auditorias Realizadas</span>
          <div class="kpi-variacao positiva">+12% vs anterior</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon conformidade">✅</div>
        <div class="kpi-content">
          <span class="kpi-valor">94%</span>
          <span class="kpi-label">Conformidade Geral</span>
          <div class="kpi-variacao positiva">+5% vs anterior</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon pendentes">⏳</div>
        <div class="kpi-content">
          <span class="kpi-valor">3</span>
          <span class="kpi-label">Pendentes</span>
          <div class="kpi-variacao negativa">-2 vs anterior</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon tempo">⏱️</div>
        <div class="kpi-content">
          <span class="kpi-valor">2.1</span>
          <span class="kpi-label">Dias Médios</span>
          <div class="kpi-variacao neutra">±0.3 vs anterior</div>
        </div>
      </div>
    </div>

    <!-- Gráficos e Visualizações -->
    <div class="charts-grid">
      <!-- Gráfico de Conformidade por Setor -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Conformidade por Setor</h3>
          <span class="chart-subtitle">Percentual de conformidade</span>
        </div>
        <div class="chart-container">
          <div class="bar-chart">
            <div
              v-for="setor in conformidadeSetores"
              :key="setor.nome"
              class="bar-item"
            >
              <div class="bar-label">
                <span>{{ setor.nome }}</span>
                <span class="bar-value">{{ setor.percentual }}%</span>
              </div>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :class="setor.cor"
                  :style="{ width: setor.percentual + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Distribuição -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Status das Auditorias</h3>
          <span class="chart-subtitle">Distribuição atual</span>
        </div>
        <div class="chart-container">
          <div class="donut-chart">
            <div class="donut-segment concluidas"></div>
            <div class="donut-segment pendentes-chart"></div>
            <div class="donut-segment atrasadas"></div>
            <div class="donut-center">
              <span class="donut-total">24</span>
              <span class="donut-label">Total</span>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color concluida"></div>
              <span>Concluídas (18)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color pendente"></div>
              <span>Pendentes (3)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color atrasada"></div>
              <span>Atrasadas (3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Setores com Performance -->
    <div class="tabela-card">
      <div class="tabela-header">
        <h3>Performance por Setor</h3>
        <span class="tabela-subtitle">Ordenado por conformidade</span>
      </div>
      <div class="tabela-container">
        <table class="performance-table">
          <thead>
            <tr>
              <th>Setor</th>
              <th>Conformidade</th>
              <th>Auditorias</th>
              <th>Não Conformidades</th>
              <th>Tendência</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="setor in performanceSetores" :key="setor.nome">
              <td class="setor-name">
                <span class="setor-icon">{{ setor.icone }}</span>
                {{ setor.nome }}
              </td>
              <td>
                <div class="conformidade-cell">
                  <span class="conformidade-value"
                    >{{ setor.conformidade }}%</span
                  >
                  <div class="progress-mini">
                    <div
                      class="progress-mini-fill"
                      :class="setor.status"
                      :style="{ width: setor.conformidade + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="auditorias-count">{{ setor.auditorias }}</td>
              <td class="nao-conformidades">{{ setor.naoConformidades }}</td>
              <td>
                <div class="tendencia-indicator" :class="setor.tendencia">
                  {{
                    setor.tendencia === "positiva"
                      ? "↑"
                      : setor.tendencia === "negativa"
                      ? "↓"
                      : "→"
                  }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Alertas e Ações Rápidas -->
    <div class="alertas-grid">
      <div class="alerta-card critico">
        <div class="alerta-header">
          <span class="alerta-icon">🚨</span>
          <h4>Alertas Críticos</h4>
        </div>
        <div class="alerta-content">
          <div class="alerta-item">
            <span class="alerta-text">Estoque com 15% de não conformidade</span>
            <button class="action-btn pequeno">Verificar</button>
          </div>
          <div class="alerta-item">
            <span class="alerta-text">2 auditorias próximas do vencimento</span>
            <button class="action-btn pequeno">Agendar</button>
          </div>
        </div>
      </div>

      <div class="alerta-card sucesso">
        <div class="alerta-header">
          <span class="alerta-icon">⭐</span>
          <h4>Destaques Positivos</h4>
        </div>
        <div class="alerta-content">
          <div class="destaque-item">
            <span class="destaque-text">Limpeza: 100% de conformidade</span>
          </div>
          <div class="destaque-item">
            <span class="destaque-text">5 setores acima da meta</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando métricas...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const periodoSelecionado = ref("mes");
const carregando = ref(true);

const conformidadeSetores = ref([
  { nome: "Limpeza", percentual: 100, cor: "excelente" },
  { nome: "Atendimento", percentual: 95, cor: "bom" },
  { nome: "Estoque", percentual: 92, cor: "bom" },
  { nome: "Segurança", percentual: 88, cor: "medio" },
  { nome: "Cadastro", percentual: 85, cor: "medio" },
  { nome: "Financeiro", percentual: 78, cor: "baixo" },
]);

const performanceSetores = ref([
  {
    nome: "Limpeza",
    icone: "🧹",
    conformidade: 100,
    auditorias: 5,
    naoConformidades: 0,
    status: "excelente",
    tendencia: "positiva",
  },
  {
    nome: "Atendimento",
    icone: "👥",
    conformidade: 95,
    auditorias: 8,
    naoConformidades: 2,
    status: "bom",
    tendencia: "positiva",
  },
  {
    nome: "Estoque",
    icone: "📦",
    conformidade: 92,
    auditorias: 6,
    naoConformidades: 3,
    status: "bom",
    tendencia: "neutra",
  },
  {
    nome: "Segurança",
    icone: "🔒",
    conformidade: 88,
    auditorias: 4,
    naoConformidades: 4,
    status: "medio",
    tendencia: "positiva",
  },
  {
    nome: "Cadastro",
    icone: "📝",
    conformidade: 85,
    auditorias: 3,
    naoConformidades: 5,
    status: "medio",
    tendencia: "negativa",
  },
  {
    nome: "Financeiro",
    icone: "💰",
    conformidade: 78,
    auditorias: 5,
    naoConformidades: 8,
    status: "baixo",
    tendencia: "negativa",
  },
]);

const gerarRelatorio = () => {
  // Simular geração de relatório
  carregando.value = true;
  setTimeout(() => {
    carregando.value = false;
    alert("Relatório gerado com sucesso!");
  }, 1000);
};

onMounted(() => {
  // Simular carregamento de dados
  setTimeout(() => {
    carregando.value = false;
  }, 2000);
});
</script>

<style scoped>
.metricas-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(67, 97, 238, 0.12);
  padding: 2rem;
  margin: 1.5rem auto;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.metricas-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left {
  flex: 1;
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.icon-area {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #48bb78 0%, #ed8936 100%);
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
  background: linear-gradient(135deg, #48bb78 0%, #ed8936 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.descricao {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
  padding-left: 4.5rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
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

.relatorio-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #48bb78 0%, #ed8936 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.relatorio-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.kpi-icon.total {
  background: #ebf8ff;
}
.kpi-icon.conformidade {
  background: #f0fff4;
}
.kpi-icon.pendentes {
  background: #fef5e7;
}
.kpi-icon.tempo {
  background: #faf5ff;
}

.kpi-content {
  flex: 1;
}

.kpi-valor {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.kpi-label {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.5rem;
  display: block;
}

.kpi-variacao {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.kpi-variacao.positiva {
  background: #c6f6d5;
  color: #22543d;
}

.kpi-variacao.negativa {
  background: #fed7d7;
  color: #c53030;
}

.kpi-variacao.neutra {
  background: #e2e8f0;
  color: #4a5568;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.chart-header {
  margin-bottom: 1.5rem;
  background: none;
  padding: 0;
}

.chart-header h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  background: none;
  -webkit-background-clip: initial;
  background-clip: initial;
  -webkit-text-fill-color: initial;
}

.chart-subtitle {
  font-size: 0.9rem;
  color: #718096;
  background: none;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.bar-value {
  font-weight: 600;
  color: #2d3748;
}

.bar-track {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.bar-fill.excelente {
  background: linear-gradient(90deg, #48bb78, #68d391);
}
.bar-fill.bom {
  background: linear-gradient(90deg, #ed8936, #f6ad55);
}
.bar-fill.medio {
  background: linear-gradient(90deg, #ed8936, #f6ad55);
}
.bar-fill.baixo {
  background: linear-gradient(90deg, #f56565, #fc8181);
}

/* Donut Chart */
.donut-chart {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    #48bb78 0% 75%,
    #ed8936 75% 87.5%,
    #f56565 87.5% 100%
  );
  position: relative;
  margin: 0 auto 1.5rem;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.donut-label {
  font-size: 0.8rem;
  color: #718096;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-color.concluida {
  background: #48bb78;
}
.legend-color.pendente {
  background: #ed8936;
}
.legend-color.atrasada {
  background: #f56565;
}

/* Tabela */
.tabela-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  margin-bottom: 1.5rem;
}

.tabela-header {
  margin-bottom: 1.5rem;
}

.tabela-header h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
}

.tabela-subtitle {
  font-size: 0.9rem;
  color: #718096;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
}

.performance-table th {
  background: #f7fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.performance-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.setor-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.setor-icon {
  font-size: 1.2rem;
}

.conformidade-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.conformidade-value {
  font-weight: 600;
  min-width: 40px;
}

.progress-mini {
  width: 80px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-mini-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-mini-fill.excelente {
  background: #48bb78;
}
.progress-mini-fill.bom {
  background: #ed8936;
}
.progress-mini-fill.medio {
  background: #ed8936;
}
.progress-mini-fill.baixo {
  background: #f56565;
}

.auditorias-count,
.nao-conformidades {
  text-align: center;
  font-weight: 600;
}

.tendencia-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto;
}

.tendencia-indicator.positiva {
  background: #c6f6d5;
  color: #22543d;
}

.tendencia-indicator.negativa {
  background: #fed7d7;
  color: #c53030;
}

.tendencia-indicator.neutra {
  background: #e2e8f0;
  color: #4a5568;
}

/* Alertas Grid */
.alertas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.alerta-card {
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.alerta-card.critico {
  background: #fed7d7;
  border-left: 6px solid #e53e3e;
}

.alerta-card.sucesso {
  background: #c6f6d5;
  border-left: 6px solid #38a169;
}

.alerta-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.alerta-header h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.alerta-icon {
  font-size: 1.5rem;
}

.alerta-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alerta-item,
.destaque-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.alerta-text,
.destaque-text {
  font-size: 0.95rem;
  font-weight: 500;
}

.action-btn.pequeno {
  padding: 0.4rem 1rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.pequeno:hover {
  background: #38a169;
}

/* Loading State */
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
  border-radius: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #48bb78;
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
  .metricas-container {
    padding: 1rem;
    margin: 1rem;
  }

  .metricas-header {
    flex-direction: column;
    gap: 1rem;
  }

  .descricao {
    padding-left: 0;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .alertas-grid {
    grid-template-columns: 1fr;
  }

  .performance-table {
    font-size: 0.8rem;
  }

  .performance-table th,
  .performance-table td {
    padding: 0.5rem;
  }
}
</style>
