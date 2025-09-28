<template>
  <div class="metricas-container">
    <!-- Header -->
    <div class="metricas-header">
      <div class="header-left">
        <div class="icon-title">
          <div class="icon-area">📊</div>
          <div class="text-content">
            <div class="titulo">Métricas de Auditoria</div>
            <div class="descricao">
              Acompanhe os principais indicadores de auditoria da loja em tempo
              real
            </div>
          </div>
        </div>
      </div>
      <div class="header-controls">
        <select v-model="periodoSelecionado" class="filtro-select">
          <option value="hoje">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="trimestre">Este Trimestre</option>
        </select>
        <button class="export-btn" @click="exportarDados">📥 Exportar</button>
      </div>
    </div>

    <!-- KPIs Principais -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon total">📋</div>
        <div class="kpi-content">
          <span class="kpi-valor">42</span>
          <span class="kpi-label">Total de Auditorias</span>
          <div class="kpi-variacao positiva">+18% vs anterior</div>
        </div>
        <div class="kpi-trend">
          <div class="trend-chart">
            <div class="trend-bar" style="height: 30%"></div>
            <div class="trend-bar" style="height: 60%"></div>
            <div class="trend-bar" style="height: 45%"></div>
            <div class="trend-bar" style="height: 80%"></div>
            <div class="trend-bar" style="height: 75%"></div>
            <div class="trend-bar" style="height: 90%"></div>
            <div class="trend-bar" style="height: 100%"></div>
          </div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon conformidade">✅</div>
        <div class="kpi-content">
          <span class="kpi-valor">94.2%</span>
          <span class="kpi-label">Taxa de Conformidade</span>
          <div class="kpi-variacao positiva">+5.3% vs anterior</div>
        </div>
        <div class="kpi-progress">
          <div class="progress-circle">
            <div class="circle-background"></div>
            <div
              class="circle-progress"
              :style="{ transform: `rotate(${94.2 * 3.6}deg)` }"
            ></div>
            <div class="circle-text">94%</div>
          </div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon pendentes">⏳</div>
        <div class="kpi-content">
          <span class="kpi-valor">8</span>
          <span class="kpi-label">Pendências</span>
          <div class="kpi-variacao negativa">+2 vs anterior</div>
        </div>
        <div class="kpi-alertas">
          <div class="alerta-item critico">3 Críticas</div>
          <div class="alerta-item medio">5 Moderadas</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon tempo">⏱️</div>
        <div class="kpi-content">
          <span class="kpi-valor">2.3</span>
          <span class="kpi-label">Dias Médios</span>
          <div class="kpi-variacao positiva">-0.7 vs anterior</div>
        </div>
        <div class="kpi-meta">
          <div class="meta-progress">
            <div class="meta-bar">
              <div class="meta-fill" style="width: 76%"></div>
            </div>
            <span class="meta-text">Meta: 3 dias</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos e Visualizações -->
    <div class="charts-section">
      <div class="charts-grid">
        <!-- Gráfico de Conformidade por Setor -->
        <div class="chart-card large">
          <div class="chart-header">
            <h3>Conformidade por Setor</h3>
            <span class="chart-subtitle"
              >Percentual de conformidade por área</span
            >
          </div>
          <div class="chart-container">
            <div class="horizontal-bars">
              <div
                v-for="setor in conformidadeSetores"
                :key="setor.nome"
                class="bar-item"
              >
                <div class="bar-info">
                  <span class="bar-label">{{ setor.nome }}</span>
                  <span class="bar-value">{{ setor.percentual }}%</span>
                </div>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :class="setor.status"
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
            <div class="pie-chart">
              <div
                class="pie-segment concluidas"
                style="--percentage: 70; --color: #48bb78"
              ></div>
              <div
                class="pie-segment andamento"
                style="--percentage: 15; --color: #ed8936"
              ></div>
              <div
                class="pie-segment pendentes"
                style="--percentage: 10; --color: #e53e3e"
              ></div>
              <div
                class="pie-segment atrasadas"
                style="--percentage: 5; --color: #718096"
              ></div>
              <div class="pie-center">
                <span class="pie-total">100%</span>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color" style="background: #48bb78"></div>
                <span>Concluídas (70%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #ed8936"></div>
                <span>Em Andamento (15%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #e53e3e"></div>
                <span>Pendentes (10%)</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #718096"></div>
                <span>Atrasadas (5%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Evolução Temporal -->
        <div class="chart-card large">
          <div class="chart-header">
            <h3>Evolução da Conformidade</h3>
            <span class="chart-subtitle">Últimos 30 dias</span>
          </div>
          <div class="chart-container">
            <div class="line-chart">
              <div class="chart-grid">
                <div
                  class="grid-line"
                  v-for="n in 5"
                  :key="n"
                  :style="{ bottom: n * 20 + '%' }"
                ></div>
              </div>
              <div class="data-line">
                <div
                  v-for="(ponto, index) in evolucaoConformidade"
                  :key="index"
                  class="data-point"
                  :style="{
                    left:
                      index * (100 / (evolucaoConformidade.length - 1)) + '%',
                    bottom: ponto.valor * 0.8 + '%',
                  }"
                  :class="ponto.tendencia"
                >
                  <div class="point-tooltip">{{ ponto.valor }}%</div>
                </div>
              </div>
              <div class="chart-labels">
                <span
                  v-for="(ponto, index) in evolucaoConformidade"
                  :key="index"
                  class="label"
                  :style="{
                    left:
                      index * (100 / (evolucaoConformidade.length - 1)) + '%',
                  }"
                >
                  {{ ponto.dia }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Não Conformidades -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Top Não Conformidades</h3>
            <span class="chart-subtitle">Itens mais frequentes</span>
          </div>
          <div class="chart-container">
            <div class="nc-list">
              <div
                v-for="nc in topNaoConformidades"
                :key="nc.id"
                class="nc-item"
              >
                <div class="nc-info">
                  <span class="nc-descricao">{{ nc.descricao }}</span>
                  <span class="nc-setor">{{ nc.setor }}</span>
                </div>
                <div class="nc-stats">
                  <span class="nc-count">{{ nc.ocorrencias }}x</span>
                  <div class="nc-badge" :class="nc.severidade">
                    {{ nc.severidade }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela Detalhada -->
    <div class="tabela-section">
      <div class="tabela-card">
        <div class="tabela-header">
          <h3>Detalhamento por Auditor</h3>
          <span class="tabela-subtitle">Performance individual</span>
        </div>
        <div class="tabela-container">
          <table class="performance-table">
            <thead>
              <tr>
                <th>Auditor</th>
                <th>Auditorias</th>
                <th>Conformidade</th>
                <th>NCs Encontradas</th>
                <th>Tempo Médio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="auditor in auditores" :key="auditor.id">
                <td class="auditor-info">
                  <div class="auditor-avatar">{{ auditor.avatar }}</div>
                  <div class="auditor-details">
                    <span class="auditor-nome">{{ auditor.nome }}</span>
                    <span class="auditor-setor">{{ auditor.setor }}</span>
                  </div>
                </td>
                <td class="auditorias-count">{{ auditor.auditorias }}</td>
                <td>
                  <div class="conformidade-cell">
                    <span class="conformidade-value"
                      >{{ auditor.conformidade }}%</span
                    >
                    <div class="progress-mini">
                      <div
                        class="progress-mini-fill"
                        :class="auditor.status"
                        :style="{ width: auditor.conformidade + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="nc-count">{{ auditor.ncs }}</td>
                <td class="tempo-medio">{{ auditor.tempo }} dias</td>
                <td>
                  <div class="status-badge" :class="auditor.status">
                    {{
                      auditor.status === "excelente"
                        ? "Excelente"
                        : auditor.status === "bom"
                        ? "Bom"
                        : auditor.status === "medio"
                        ? "Médio"
                        : "Atenção"
                    }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando métricas de auditoria...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const periodoSelecionado = ref("mes");
const carregando = ref(true);

const conformidadeSetores = ref([
  { nome: "Limpeza", percentual: 100, status: "excelente" },
  { nome: "Atendimento", percentual: 96, status: "excelente" },
  { nome: "Caixas", percentual: 94, status: "excelente" },
  { nome: "Estoque", percentual: 89, status: "bom" },
  { nome: "Segurança", percentual: 87, status: "bom" },
  { nome: "Alimentos", percentual: 82, status: "medio" },
  { nome: "Vestuário", percentual: 78, status: "medio" },
]);

const evolucaoConformidade = ref([
  { dia: "1/10", valor: 85, tendencia: "positiva" },
  { dia: "5/10", valor: 87, tendencia: "positiva" },
  { dia: "10/10", valor: 84, tendencia: "negativa" },
  { dia: "15/10", valor: 89, tendencia: "positiva" },
  { dia: "20/10", valor: 92, tendencia: "positiva" },
  { dia: "25/10", valor: 90, tendencia: "negativa" },
  { dia: "30/10", valor: 94, tendencia: "positiva" },
]);

const topNaoConformidades = ref([
  {
    id: 1,
    descricao: "Produto fora de posição",
    setor: "Estoque",
    ocorrencias: 12,
    severidade: "media",
  },
  {
    id: 2,
    descricao: "Preço não atualizado",
    setor: "Caixas",
    ocorrencias: 8,
    severidade: "alta",
  },
  {
    id: 3,
    descricao: "Limpeza inadequada",
    setor: "Limpeza",
    ocorrencias: 6,
    severidade: "baixa",
  },
  {
    id: 4,
    descricao: "Falta de EPI",
    setor: "Segurança",
    ocorrencias: 5,
    severidade: "alta",
  },
]);

const auditores = ref([
  {
    id: 1,
    nome: "Maria Silva",
    setor: "Qualidade",
    avatar: "👩",
    auditorias: 15,
    conformidade: 98,
    ncs: 3,
    tempo: 1.8,
    status: "excelente",
  },
  {
    id: 2,
    nome: "João Santos",
    setor: "Operações",
    avatar: "👨",
    auditorias: 12,
    conformidade: 95,
    ncs: 5,
    tempo: 2.1,
    status: "excelente",
  },
  {
    id: 3,
    nome: "Ana Oliveira",
    setor: "Qualidade",
    avatar: "👩",
    auditorias: 8,
    conformidade: 88,
    ncs: 8,
    tempo: 2.5,
    status: "bom",
  },
  {
    id: 4,
    nome: "Pedro Costa",
    setor: "Operações",
    avatar: "👨",
    auditorias: 6,
    conformidade: 82,
    ncs: 10,
    tempo: 3.2,
    status: "medio",
  },
  {
    id: 5,
    nome: "Carla Lima",
    setor: "Qualidade",
    avatar: "👩",
    auditorias: 10,
    conformidade: 91,
    ncs: 6,
    tempo: 2.0,
    status: "excelente",
  },
]);

const exportarDados = () => {
  carregando.value = true;
  setTimeout(() => {
    carregando.value = false;
    alert("Dados exportados com sucesso!");
  }, 1000);
};

onMounted(() => {
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
  align-items: flex-start;
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

.text-content {
  display: flex;
  flex-direction: column;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.25rem 0;
}

.descricao {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
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

.export-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
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

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
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

/* Trend Chart */
.kpi-trend {
  width: 60px;
  height: 40px;
}

.trend-chart {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 100%;
}

.trend-bar {
  width: 4px;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 2px;
  transition: height 0.3s ease;
}

/* Progress Circle */
.kpi-progress {
  width: 60px;
  height: 60px;
}

.progress-circle {
  width: 60px;
  height: 60px;
  position: relative;
}

.circle-background {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e2e8f0;
}

.circle-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #48bb78 0deg,
    #48bb78 var(--rotation),
    transparent var(--rotation)
  );
  clip-path: polygon(
    50% 50%,
    50% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    0% 0%,
    50% 0%
  );
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 700;
  color: #2d3748;
}

/* Alertas */
.kpi-alertas {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alerta-item {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.alerta-item.critico {
  background: #fed7d7;
  color: #c53030;
}

.alerta-item.medio {
  background: #fef5e7;
  color: #dd6b20;
}

/* Meta Progress */
.meta-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-bar {
  width: 80px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.meta-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #68d391);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.meta-text {
  font-size: 0.8rem;
  color: #718096;
}

/* Charts Section */
.charts-section {
  margin-bottom: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.chart-card.large {
  grid-column: span 1;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
}

.chart-subtitle {
  font-size: 0.9rem;
  color: #718096;
}

/* Horizontal Bars */
.horizontal-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.bar-label {
  font-weight: 500;
  color: #2d3748;
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
  background: linear-gradient(90deg, #4299e1, #63b3ed);
}
.bar-fill.medio {
  background: linear-gradient(90deg, #ed8936, #f6ad55);
}

/* Pie Chart */
.pie-chart {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto 1.5rem;
  background: conic-gradient(
    var(--color) 0% calc(var(--percentage) * 1%),
    transparent calc(var(--percentage) * 1%) 100%
  );
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
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

/* Line Chart */
.line-chart {
  height: 200px;
  position: relative;
  padding: 20px 0 40px 0;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}

.data-line {
  position: relative;
  height: 100%;
  width: 100%;
}

.data-point {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #667eea;
  transform: translate(-50%, 50%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.data-point.positiva {
  background: #48bb78;
}
.data-point.negativa {
  background: #f56565;
}

.data-point:hover {
  transform: translate(-50%, 50%) scale(1.5);
  z-index: 10;
}

.point-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.data-point:hover .point-tooltip {
  opacity: 1;
}

.chart-labels {
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}

.label {
  font-size: 0.8rem;
  color: #718096;
  transform: translateX(-50%);
}

/* NC List */
.nc-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #e53e3e;
}

.nc-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nc-descricao {
  font-weight: 500;
  color: #2d3748;
}

.nc-setor {
  font-size: 0.8rem;
  color: #718096;
}

.nc-stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nc-count {
  font-weight: 700;
  color: #2d3748;
}

.nc-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.nc-badge.alta {
  background: #fed7d7;
  color: #c53030;
}
.nc-badge.media {
  background: #fef5e7;
  color: #dd6b20;
}
.nc-badge.baixa {
  background: #e6fffa;
  color: #234e52;
}

/* Tabela Section */
.tabela-section {
  margin-bottom: 1rem;
}

.tabela-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
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

.auditor-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auditor-avatar {
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

.auditor-details {
  display: flex;
  flex-direction: column;
}

.auditor-nome {
  font-weight: 600;
  color: #2d3748;
}

.auditor-setor {
  font-size: 0.8rem;
  color: #718096;
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
  background: #4299e1;
}
.progress-mini-fill.medio {
  background: #ed8936;
}

.auditorias-count,
.nc-count,
.tempo-medio {
  text-align: center;
  font-weight: 600;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.status-badge.excelente {
  background: #c6f6d5;
  color: #22543d;
}
.status-badge.bom {
  background: #bee3f8;
  color: #1a365d;
}
.status-badge.medio {
  background: #fef5e7;
  color: #744210;
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
  .metricas-container {
    padding: 1rem;
    margin: 1rem;
  }

  .metricas-header {
    flex-direction: column;
    gap: 1rem;
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

  .chart-card.large {
    grid-column: span 1;
  }

  .performance-table {
    font-size: 0.8rem;
  }

  .performance-table th,
  .performance-table td {
    padding: 0.5rem;
  }

  .auditor-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
