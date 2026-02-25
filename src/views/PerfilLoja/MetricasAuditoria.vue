<template>
  <div class="metricas-container">
    <!-- Header -->
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
          <button
            class="action-btn"
            :class="{ active: tipoAuditoriaAtual === 'etiquetas' }"
            @click="tipoAuditoriaAtual = 'etiquetas'"
          >
            🏷️ Etiqueta
          </button>
          <button
            class="action-btn"
            :class="{ active: tipoAuditoriaAtual === 'presencas' }"
            @click="tipoAuditoriaAtual = 'presencas'"
          >
            👥 Presença
          </button>
          <button
            class="action-btn"
            :class="{ active: tipoAuditoriaAtual === 'rupturas' }"
            @click="tipoAuditoriaAtual = 'rupturas'"
          >
            📦 Ruptura
          </button>
        </div>
        <button class="export-btn" @click="exportarDados">
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
          Exportar
        </button>
      </div>
    </div>

    <!-- KPIs Principais -->
    <div class="kpi-section">
      <div class="kpi-grid">
        <!-- Total de Auditorias -->
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-icon total">
              <svg
                width="24"
                height="24"
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
            <div class="kpi-title">Itens Lidos</div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">42</div>
            <div class="kpi-trend positive">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14L12 9L17 14H7Z" fill="currentColor" />
              </svg>
              +18%
            </div>
          </div>
          <div class="kpi-chart">
            <div class="mini-chart">
              <div class="chart-bar" style="height: 30%"></div>
              <div class="chart-bar" style="height: 60%"></div>
              <div class="chart-bar" style="height: 45%"></div>
              <div class="chart-bar" style="height: 80%"></div>
              <div class="chart-bar" style="height: 75%"></div>
              <div class="chart-bar" style="height: 90%"></div>
              <div class="chart-bar" style="height: 100%"></div>
            </div>
          </div>
        </div>

        <!-- Taxa de Conformidade -->
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-icon success">
              <svg
                width="24"
                height="24"
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
            <div class="kpi-title">Taxa de Conformidade</div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">94.2%</div>
            <div class="kpi-trend positive">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14L12 9L17 14H7Z" fill="currentColor" />
              </svg>
              +5.3%
            </div>
          </div>
          <div class="kpi-progress">
            <div class="circular-progress">
              <div class="progress-background"></div>
              <div
                class="progress-fill"
                :style="{ transform: `rotate(${94.2 * 3.6}deg)` }"
              ></div>
              <div class="progress-text">94%</div>
            </div>
          </div>
        </div>

        <!-- Pendências -->
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-icon warning">
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
            <div class="kpi-title">Pendências</div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">8</div>
            <div class="kpi-trend negative">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
              </svg>
              +2
            </div>
          </div>
          <div class="kpi-alerts">
            <div class="alert-item critical">
              <span class="alert-count">3</span>
              <span class="alert-label">Críticas</span>
            </div>
            <div class="alert-item medium">
              <span class="alert-count">5</span>
              <span class="alert-label">Moderadas</span>
            </div>
          </div>
        </div>

        <!-- Tempo Médio -->
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-icon info">
              <svg
                width="24"
                height="24"
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
            <div class="kpi-title">Dias Médios</div>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">2.3</div>
            <div class="kpi-trend positive">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 14L12 9L17 14H7Z" fill="currentColor" />
              </svg>
              -0.7
            </div>
          </div>
          <div class="kpi-goal">
            <div class="goal-progress">
              <div class="goal-bar">
                <div class="goal-fill" style="width: 76%"></div>
              </div>
              <div class="goal-text">Meta: 3 dias</div>
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
            <p class="chart-subtitle">Percentual de conformidade por área</p>
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
                  style="--percentage: 70"
                ></div>
                <div
                  class="pie-segment in-progress"
                  style="--percentage: 15"
                ></div>
                <div class="pie-segment pending" style="--percentage: 10"></div>
                <div class="pie-segment overdue" style="--percentage: 5"></div>
                <div class="pie-center">
                  <span class="pie-total">100%</span>
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color completed"></div>
                  <span>Concluídas (70%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color in-progress"></div>
                  <span>Em Andamento (15%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color pending"></div>
                  <span>Pendentes (10%)</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color overdue"></div>
                  <span>Atrasadas (5%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Evolução Temporal -->
        <div class="chart-card large">
          <div class="chart-header">
            <h3>Evolução da Conformidade</h3>
            <p class="chart-subtitle">Últimos 30 dias</p>
          </div>
          <div class="chart-container">
            <div class="trend-chart">
              <div class="chart-area">
                <div class="grid-lines">
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
            <p class="chart-subtitle">Itens mais frequentes</p>
          </div>
          <div class="chart-container">
            <div class="nc-list">
              <div
                v-for="nc in topNaoConformidades"
                :key="nc.id"
                class="nc-item"
              >
                <div class="nc-content">
                  <div class="nc-description">{{ nc.descricao }}</div>
                  <div class="nc-sector">{{ nc.setor }}</div>
                </div>
                <div class="nc-stats">
                  <span class="nc-count">{{ nc.ocorrencias }}x</span>
                  <div class="nc-severity" :class="nc.severidade">
                    {{
                      nc.severidade === "alta"
                        ? "Alta"
                        : nc.severidade === "media"
                        ? "Média"
                        : "Baixa"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela Detalhada -->
    <div class="table-section">
      <div class="table-card">
        <div class="table-header">
          <h3>Detalhamento por Auditor</h3>
          <p class="table-subtitle">Performance individual</p>
        </div>
        <div class="table-container">
          <div class="table-responsive">
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
                  <td class="auditor-cell">
                    <div class="auditor-info">
                      <div class="auditor-avatar">
                        <img :src="auditor.foto" :alt="auditor.nome" />
                      </div>
                      <div class="auditor-details">
                        <span class="auditor-name">{{ auditor.nome }}</span>
                        <span class="auditor-sector">{{ auditor.setor }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="audits-count">{{ auditor.auditorias }}</td>
                  <td class="compliance-cell">
                    <div class="compliance-display">
                      <span class="compliance-value"
                        >{{ auditor.conformidade }}%</span
                      >
                      <div class="compliance-bar-mini">
                        <div
                          class="compliance-fill-mini"
                          :class="auditor.status"
                          :style="{ width: auditor.conformidade + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td class="nc-count">{{ auditor.ncs }}</td>
                  <td class="avg-time">{{ auditor.tempo }} dias</td>
                  <td class="status-cell">
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
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando métricas de auditoria...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useLojaStore } from "@/store/lojaStore";
import api from "@/config/api";

const lojaStore = useLojaStore();

const periodoSelecionado = ref("mes");
const carregando = ref(true);
const erro = ref(null);

// Dados reais da API
const dadosMetricas = ref({
  etiquetas: { classesLeitura: {}, resumo: {} },
  presencas: { classesLeitura: {}, resumo: {} },
  rupturas: { classesLeitura: {}, resumo: {} },
});

const tipoAuditoriaAtual = ref("etiquetas");

// Computed para conformidade dos setores (baseado em classes)
const conformidadeSetores = computed(() => {
  const auditoriaAtual = dadosMetricas.value[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.classesLeitura) return [];

  return Object.entries(auditoriaAtual.classesLeitura)
    .map(([classe, dados]) => {
      const percentual = dados.percentual || 0;
      let status = "baixo";
      if (percentual >= 90) status = "excelente";
      else if (percentual >= 75) status = "bom";
      else if (percentual >= 60) status = "medio";

      return {
        nome: classe,
        percentual: Math.round(percentual),
        status,
        total: dados.total || 0,
        lidos: dados.lidos || 0,
      };
    })
    .sort((a, b) => b.percentual - a.percentual)
    .slice(0, 7);
});

// Computed para estatísticas gerais
const estatisticas = computed(() => {
  const auditoriaAtual = dadosMetricas.value[tipoAuditoriaAtual.value];
  const resumo = auditoriaAtual?.resumo || {};

  const totalItens = resumo.totalItens || 0;
  const itensLidos = resumo.itensLidos || 0;
  const percentualGeral = totalItens > 0 ? (itensLidos / totalItens) * 100 : 0;

  return {
    totalAuditorias: itensLidos,
    conformidadeGeral: Math.round(percentualGeral),
    metasAtingidas: Math.round(
      percentualGeral >= 80 ? percentualGeral : percentualGeral * 0.8
    ),
    naoConformidades: Math.max(0, totalItens - itensLidos),
    crescimentoMedio: itensLidos,
  };
});

// Evolução de conformidade (últimos 7 dias simulados)
const evolucaoConformidade = ref([
  { dia: "1/01", valor: 85, tendencia: "positive" },
  { dia: "5/01", valor: 87, tendencia: "positive" },
  { dia: "10/01", valor: 84, tendencia: "negative" },
  { dia: "15/01", valor: 89, tendencia: "positive" },
  { dia: "20/01", valor: 92, tendencia: "positive" },
  { dia: "25/01", valor: 90, tendencia: "negative" },
  {
    dia: "Hoje",
    valor: estatisticas.value.conformidadeGeral,
    tendencia: "positive",
  },
]);

// Top não conformidades (classes com menor desempenho)
const topNaoConformidades = computed(() => {
  const auditoriaAtual = dadosMetricas.value[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.classesLeitura) return [];

  return Object.entries(auditoriaAtual.classesLeitura)
    .map(([classe, dados]) => {
      const percentual = dados.percentual || 0;
      const faltam = (dados.total || 0) - (dados.lidos || 0);

      let severidade = "baixa";
      if (percentual < 60) severidade = "alta";
      else if (percentual < 80) severidade = "media";

      return {
        id: classe,
        descricao: `Baixa cobertura em ${classe}`,
        setor: classe,
        ocorrencias: faltam,
        severidade,
        percentual,
      };
    })
    .filter((item) => item.ocorrencias > 0)
    .sort((a, b) => b.ocorrencias - a.ocorrencias)
    .slice(0, 4);
});

// Top auditores (dados mockados até implementar API de usuários)
const auditores = ref([
  {
    id: 1,
    nome: "Maria Silva",
    setor: "Qualidade",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80",
    auditorias: 0,
    conformidade: 98,
    ncs: 0,
    tempo: 1.8,
    status: "excelente",
  },
  {
    id: 2,
    nome: "João Santos",
    setor: "Operações",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    auditorias: 0,
    conformidade: 95,
    ncs: 0,
    tempo: 2.1,
    status: "excelente",
  },
]);

const buscarDadosReais = async () => {
  carregando.value = true;
  erro.value = null;

  try {
    if (!lojaStore.codigoLojaAtual) {
      throw new Error("Nenhuma loja selecionada.");
    }

    const response = await api.get(
      "/api/metricas/loja-daily/classes-completas",
      { headers: { "x-loja": lojaStore.codigoLojaAtual } }
    );

    if (response.data) {
      dadosMetricas.value = {
        etiquetas: {
          ...response.data.etiquetas,
          classesLeitura: response.data.etiquetas?.classesLeitura || {},
        },
        presencas: {
          ...response.data.presencas,
          classesLeitura: response.data.presencas?.classesLeitura || {},
        },
        rupturas: {
          ...response.data.rupturas,
          classesLeitura: response.data.rupturas?.classesLeitura || {},
        },
      };

      // Atualizar evolução com dados reais
      evolucaoConformidade.value[6].valor =
        estatisticas.value.conformidadeGeral;
    }
  } catch (err) {
    console.error("❌ Erro ao buscar métricas:", err);
    erro.value = "Falha ao carregar os dados. Tente novamente.";
  } finally {
    carregando.value = false;
  }
};

const exportarDados = () => {
  const dados = {
    loja: lojaStore.codigoLojaAtual,
    tipo: tipoAuditoriaAtual.value,
    estatisticas: estatisticas.value,
    conformidadeSetores: conformidadeSetores.value,
    data: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(dados, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `metricas_${lojaStore.codigoLojaAtual}_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Observar mudanças na loja
watch(
  () => lojaStore.codigoLojaAtual,
  (novaLoja) => {
    if (novaLoja) buscarDadosReais();
  }
);

onMounted(() => {
  if (lojaStore.codigoLojaAtual) {
    buscarDadosReais();
  } else {
    erro.value = "Por favor, selecione uma loja.";
    carregando.value = false;
  }
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

.export-btn {
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

.export-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* KPI Section */
.kpi-section {
  margin-bottom: 2.5rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-icon.total {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.kpi-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.kpi-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.kpi-icon.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.kpi-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.kpi-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.kpi-trend.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.kpi-trend.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

/* Mini Chart */
.kpi-chart {
  height: 40px;
}

.mini-chart {
  display: flex;
  align-items: end;
  gap: 3px;
  height: 100%;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #6366f1, #8b5cf6);
  border-radius: 2px;
  min-height: 4px;
  transition: height 0.3s ease;
}

/* Circular Progress */
.kpi-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.circular-progress {
  width: 80px;
  height: 80px;
  position: relative;
}

.progress-background {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f3f4f6;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #10b981 0deg,
    #10b981 var(--rotation),
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

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

/* Alerts */
.kpi-alerts {
  display: flex;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 12px;
  flex: 1;
}

.alert-item.critical {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.alert-item.medium {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.alert-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.alert-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

/* Goal Progress */
.kpi-goal {
  display: flex;
  justify-content: center;
}

.goal-progress {
  width: 100%;
  max-width: 200px;
}

.goal-bar {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.goal-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.goal-text {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

/* Charts Section */
.charts-section {
  margin-bottom: 2.5rem;
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
    #10b981 0% 70%,
    #f59e0b 70% 85%,
    #ef4444 85% 95%,
    #6b7280 95% 100%
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pie-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
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

.legend-color.in-progress {
  background: #f59e0b;
}

.legend-color.pending {
  background: #ef4444;
}

.legend-color.overdue {
  background: #6b7280;
}

/* Trend Chart */
.trend-chart {
  height: 200px;
  position: relative;
  padding: 20px 0 40px;
}

.chart-area {
  position: relative;
  height: 100%;
  width: 100%;
}

.grid-lines {
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
  background: #f3f4f6;
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
  background: #6366f1;
  transform: translate(-50%, 50%);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-point.positive {
  background: #10b981;
}

.data-point.negative {
  background: #ef4444;
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
  background: #1f2937;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
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
  font-size: 0.75rem;
  color: #6b7280;
  transform: translateX(-50%);
}

/* NC List */
.nc-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid;
  transition: all 0.2s ease;
}

.nc-item:hover {
  background: #f3f4f6;
}

.nc-item:nth-child(1) {
  border-left-color: #ef4444;
}
.nc-item:nth-child(2) {
  border-left-color: #f59e0b;
}
.nc-item:nth-child(3) {
  border-left-color: #10b981;
}
.nc-item:nth-child(4) {
  border-left-color: #ef4444;
}

.nc-content {
  flex: 1;
}

.nc-description {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.nc-sector {
  font-size: 0.75rem;
  color: #6b7280;
}

.nc-stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nc-count {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
}

.nc-severity {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.nc-severity.alta {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

.nc-severity.media {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.nc-severity.baixa {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

/* Table Section */
.table-section {
  margin-bottom: 1rem;
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

.auditor-cell {
  white-space: nowrap;
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
  overflow: hidden;
  border: 2px solid #f3f4f6;
}

.auditor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.auditor-details {
  display: flex;
  flex-direction: column;
}

.auditor-name {
  font-weight: 600;
  color: #1f2937;
}

.auditor-sector {
  font-size: 0.75rem;
  color: #6b7280;
}

.audits-count,
.nc-count,
.avg-time {
  text-align: center;
  font-weight: 600;
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

.status-cell {
  text-align: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.status-badge.excelente {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.status-badge.bom {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.status-badge.medio {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
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

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .performance-table {
    font-size: 0.8rem;
  }

  .performance-table th,
  .performance-table td {
    padding: 0.75rem 0.5rem;
  }

  .auditor-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .compliance-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .compliance-bar-mini {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .kpi-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .kpi-trend {
    align-self: flex-start;
  }

  .kpi-alerts {
    flex-direction: column;
  }

  .nc-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .nc-stats {
    align-self: flex-end;
  }
}
</style>
