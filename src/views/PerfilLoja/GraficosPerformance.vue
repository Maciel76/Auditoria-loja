<template>
  <div class="metricas-container">
    <!-- Header com Filtros -->
    <div class="metricas-header">
      <div class="header-left">
        <div class="icon-title">
          <div class="icon-area">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                fill="currentColor"
              />
            </svg>
          </div>
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
        <div class="filter-group">
          <label for="periodo">Período</label>
          <select
            v-model="periodoSelecionado"
            id="periodo"
            class="filtro-select"
          >
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="ano">Este Ano</option>
          </select>
        </div>
        <button class="relatorio-btn" @click="gerarRelatorio">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z"
              fill="currentColor"
            />
          </svg>
          Relatório
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">24</span>
            <span class="stat-label">Auditorias Realizadas</span>
            <div class="stat-trend positive">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14L12 9L17 14H7Z" fill="currentColor" />
              </svg>
              +12%
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">94%</span>
            <span class="stat-label">Conformidade Geral</span>
            <div class="stat-trend positive">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14L12 9L17 14H7Z" fill="currentColor" />
              </svg>
              +5%
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">3</span>
            <span class="stat-label">Pendentes</span>
            <div class="stat-trend negative">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
              </svg>
              -2
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                fill="currentColor"
              />
              <path
                d="M12.5 7H11V13L16.25 16.15L17 15.08L12.5 12.25V7Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">2.1</span>
            <span class="stat-label">Dias Médios</span>
            <div class="stat-trend neutral">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12L18 8V11H3V13H18V16L22 12Z"
                  fill="currentColor"
                />
              </svg>
              ±0.3
            </div>
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
            <p class="chart-subtitle">Percentual de conformidade</p>
          </div>
          <div class="chart-container">
            <div class="compliance-bars">
              <div
                v-for="setor in conformidadeSetores"
                :key="setor.nome"
                class="compliance-item"
              >
                <div class="sector-info">
                  <span class="sector-name">{{ setor.nome }}</span>
                  <span class="sector-value">{{ setor.percentual }}%</span>
                </div>
                <div class="compliance-bar">
                  <div
                    class="compliance-fill"
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
            <p class="chart-subtitle">Distribuição atual</p>
          </div>
          <div class="chart-container">
            <div class="distribution-chart">
              <div class="pie-chart">
                <div
                  class="pie-segment completed"
                  style="--percentage: 75"
                ></div>
                <div
                  class="pie-segment pending"
                  style="--percentage: 12.5"
                ></div>
                <div
                  class="pie-segment overdue"
                  style="--percentage: 12.5"
                ></div>
                <div class="pie-center">
                  <span class="pie-total">24</span>
                  <span class="pie-label">Total</span>
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color completed"></div>
                  <span>Concluídas (18)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color pending"></div>
                  <span>Pendentes (3)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color overdue"></div>
                  <span>Atrasadas (3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Performance -->
    <div class="table-section">
      <div class="table-card">
        <div class="table-header">
          <h3>Performance por Setor</h3>
          <p class="table-subtitle">Ordenado por conformidade</p>
        </div>
        <div class="table-container">
          <div class="table-responsive">
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
                  <td class="sector-cell">
                    <div class="sector-info-table">
                      <div class="sector-icon">
                        <component
                          :is="setor.iconeComponente"
                          v-if="setor.iconeComponente"
                        />
                        <span v-else>{{ setor.icone }}</span>
                      </div>
                      <span class="sector-name-table">{{ setor.nome }}</span>
                    </div>
                  </td>
                  <td class="compliance-cell">
                    <div class="compliance-display">
                      <span class="compliance-value"
                        >{{ setor.conformidade }}%</span
                      >
                      <div class="compliance-bar-mini">
                        <div
                          class="compliance-fill-mini"
                          :class="setor.status"
                          :style="{ width: setor.conformidade + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="audits-count">{{ setor.auditorias }}</td>
                  <td class="non-compliance">{{ setor.naoConformidades }}</td>
                  <td class="trend-cell">
                    <div class="trend-indicator" :class="setor.tendencia">
                      <svg
                        v-if="setor.tendencia === 'positiva'"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 14L12 9L17 14H7Z" fill="currentColor" />
                      </svg>
                      <svg
                        v-else-if="setor.tendencia === 'negativa'"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
                      </svg>
                      <svg
                        v-else
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas e Ações -->
    <div class="alerts-section">
      <div class="alerts-grid">
        <!-- Alertas Críticos -->
        <div class="alert-card critical">
          <div class="alert-header">
            <div class="alert-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="alert-title">
              <h4>Alertas Críticos</h4>
              <p class="alert-subtitle">Atenção necessária</p>
            </div>
          </div>
          <div class="alert-content">
            <div class="alert-item">
              <div class="alert-indicator"></div>
              <div class="alert-details">
                <span class="alert-text"
                  >Estoque com 15% de não conformidade</span
                >
                <span class="alert-context">Setor: Estoque</span>
              </div>
              <button class="action-btn small primary">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                    fill="currentColor"
                  />
                </svg>
                Verificar
              </button>
            </div>
            <div class="alert-item">
              <div class="alert-indicator"></div>
              <div class="alert-details">
                <span class="alert-text"
                  >2 auditorias próximas do vencimento</span
                >
                <span class="alert-context">Prazo: 2 dias</span>
              </div>
              <button class="action-btn small secondary">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.59 7.59 4 12 4C16.42 4 20 7.59 20 12C20 16.42 16.42 20 12 20Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.5 7H11V13L16.25 16.15L17 15.08L12.5 12.25V7Z"
                    fill="currentColor"
                  />
                </svg>
                Agendar
              </button>
            </div>
          </div>
        </div>

        <!-- Destaques Positivos -->
        <div class="alert-card success">
          <div class="alert-header">
            <div class="alert-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="alert-title">
              <h4>Destaques Positivos</h4>
              <p class="alert-subtitle">Resultados excelentes</p>
            </div>
          </div>
          <div class="alert-content">
            <div class="highlight-item">
              <div class="highlight-indicator"></div>
              <div class="highlight-details">
                <span class="highlight-text"
                  >Limpeza: 100% de conformidade</span
                >
                <span class="highlight-context">5 auditorias realizadas</span>
              </div>
            </div>
            <div class="highlight-item">
              <div class="highlight-indicator"></div>
              <div class="highlight-details">
                <span class="highlight-text">5 setores acima da meta</span>
                <span class="highlight-context">Meta: 90% de conformidade</span>
              </div>
            </div>
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

// Componentes de ícones
const IconeLimpeza = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12H16M12 8V16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
};

const IconeAtendimento = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeEstoque = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeSeguranca = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7ZM18 15.59C17.67 15.85 17.33 16.09 17 16.25V13C17 12.45 16.55 12 16 12H8C7.45 12 7 12.45 7 13V16.25C6.67 16.09 6.33 15.85 6 15.59V13C6 11.9 6.9 11 8 11H16C17.1 11 18 11.9 18 13V15.59Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeCadastro = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeFinanceiro = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 11H11V7H13V9.65L15.28 7.86L16.14 9.14L13.5 11.5H12.5V11Z" fill="currentColor"/>
    </svg>
  `,
};

const periodoSelecionado = ref("mes");
const carregando = ref(true);

const conformidadeSetores = ref([
  { nome: "Limpeza", percentual: 100, status: "excelente" },
  { nome: "Atendimento", percentual: 95, status: "bom" },
  { nome: "Estoque", percentual: 92, status: "bom" },
  { nome: "Segurança", percentual: 88, status: "medio" },
  { nome: "Cadastro", percentual: 85, status: "medio" },
  { nome: "Financeiro", percentual: 78, status: "baixo" },
]);

const performanceSetores = ref([
  {
    nome: "Limpeza",
    icone: "🧹",
    iconeComponente: IconeLimpeza,
    conformidade: 100,
    auditorias: 5,
    naoConformidades: 0,
    status: "excelente",
    tendencia: "positiva",
  },
  {
    nome: "Atendimento",
    icone: "👥",
    iconeComponente: IconeAtendimento,
    conformidade: 95,
    auditorias: 8,
    naoConformidades: 2,
    status: "bom",
    tendencia: "positiva",
  },
  {
    nome: "Estoque",
    icone: "📦",
    iconeComponente: IconeEstoque,
    conformidade: 92,
    auditorias: 6,
    naoConformidades: 3,
    status: "bom",
    tendencia: "neutra",
  },
  {
    nome: "Segurança",
    icone: "🔒",
    iconeComponente: IconeSeguranca,
    conformidade: 88,
    auditorias: 4,
    naoConformidades: 4,
    status: "medio",
    tendencia: "positiva",
  },
  {
    nome: "Cadastro",
    icone: "📝",
    iconeComponente: IconeCadastro,
    conformidade: 85,
    auditorias: 3,
    naoConformidades: 5,
    status: "medio",
    tendencia: "negativa",
  },
  {
    nome: "Financeiro",
    icone: "💰",
    iconeComponente: IconeFinanceiro,
    conformidade: 78,
    auditorias: 5,
    naoConformidades: 8,
    status: "baixo",
    tendencia: "negativa",
  },
]);

const gerarRelatorio = () => {
  carregando.value = true;
  setTimeout(() => {
    carregando.value = false;
    alert("Relatório gerado com sucesso!");
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin: 1.5rem auto;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.metricas-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
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
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.text-content {
  display: flex;
  flex-direction: column;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.descricao {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.header-controls {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filtro-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  font-size: 0.875rem;
}

.filtro-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.relatorio-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.relatorio-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Stats Overview */
.stats-overview {
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon.primary {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.stat-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  display: block;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}

.stat-trend.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.stat-trend.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

.stat-trend.neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

/* Charts Section */
.charts-section {
  margin-bottom: 2.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.chart-card.large {
  grid-column: span 1;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Compliance Bars */
.compliance-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.compliance-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sector-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.sector-name {
  font-weight: 500;
  color: #374151;
}

.sector-value {
  font-weight: 600;
  color: #1f2937;
}

.compliance-bar {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.compliance-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.compliance-fill.excelente {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.compliance-fill.bom {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.compliance-fill.medio {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.compliance-fill.baixo {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

/* Distribution Chart */
.distribution-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.pie-chart {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    #10b981 0% 75%,
    #f59e0b 75% 87.5%,
    #ef4444 87.5% 100%
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pie-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.pie-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-color.completed {
  background: #10b981;
}

.legend-color.pending {
  background: #f59e0b;
}

.legend-color.overdue {
  background: #ef4444;
}

/* Table Section */
.table-section {
  margin-bottom: 2.5rem;
}

.table-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.table-header {
  margin-bottom: 1.5rem;
}

.table-header h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.table-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.table-responsive {
  overflow-x: auto;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
}

.performance-table th {
  background: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.875rem;
  white-space: nowrap;
}

.performance-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.sector-cell {
  white-space: nowrap;
}

.sector-info-table {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sector-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
}

.sector-name-table {
  font-weight: 500;
  color: #1f2937;
}

.compliance-cell {
  min-width: 120px;
}

.compliance-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.compliance-value {
  font-weight: 600;
  color: #1f2937;
  min-width: 40px;
}

.compliance-bar-mini {
  width: 80px;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.compliance-fill-mini {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.compliance-fill-mini.excelente {
  background: #10b981;
}

.compliance-fill-mini.bom {
  background: #3b82f6;
}

.compliance-fill-mini.medio {
  background: #f59e0b;
}

.compliance-fill-mini.baixo {
  background: #ef4444;
}

.audits-count,
.non-compliance {
  text-align: center;
  font-weight: 600;
  color: #1f2937;
}

.trend-cell {
  text-align: center;
}

.trend-indicator {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.trend-indicator.positiva {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.trend-indicator.negativa {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

.trend-indicator.neutra {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

/* Alerts Section */
.alerts-section {
  margin-bottom: 1rem;
}

.alerts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.alert-card {
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.alert-card.critical {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.alert-card.success {
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.2);
}

.alert-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.alert-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.alert-card.critical .alert-icon {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.alert-card.success .alert-icon {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.alert-title h4 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.alert-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item,
.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.alert-indicator,
.highlight-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.5rem;
  flex-shrink: 0;
}

.alert-card.critical .alert-indicator {
  background: #ef4444;
}

.alert-card.success .highlight-indicator {
  background: #10b981;
}

.alert-details,
.highlight-details {
  flex: 1;
}

.alert-text,
.highlight-text {
  display: block;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.alert-context,
.highlight-context {
  font-size: 0.75rem;
  color: #6b7280;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.action-btn.small {
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
}

.action-btn.primary {
  background: #6366f1;
  color: white;
}

.action-btn.primary:hover {
  background: #4f46e5;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
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
  z-index: 10;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #6366f1;
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
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card.large {
    grid-column: span 1;
  }

  .alerts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metricas-container {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 16px;
  }

  .metricas-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-controls {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .filtro-select {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .performance-table {
    font-size: 0.8rem;
  }

  .performance-table th,
  .performance-table td {
    padding: 0.75rem 0.5rem;
  }

  .compliance-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .compliance-bar-mini {
    width: 100%;
  }

  .alert-item,
  .highlight-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .action-btn {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .icon-title {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .icon-area {
    align-self: center;
  }

  .text-content {
    text-align: center;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .stat-trend {
    align-self: center;
  }
}
</style>
