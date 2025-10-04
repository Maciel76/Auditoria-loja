<template>
  <div class="performance-map-container">
    <!-- Header -->
    <div class="section-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">🗺️</div>
          <div class="title-content">
            <h2>Mapa de Performance</h2>
            <p>Visualize o desempenho das áreas da loja de forma geográfica</p>
          </div>
        </div>
        <div class="header-controls">
          <div class="filter-group">
            <div class="filter-item">
              <label class="filter-label">Visualização:</label>
              <div class="view-toggle">
                <button
                  class="toggle-btn"
                  :class="{ active: visualizacaoAtiva === 'setorial' }"
                  @click="visualizacaoAtiva = 'setorial'"
                >
                  📊 Setorial
                </button>
                <button
                  class="toggle-btn"
                  :class="{ active: visualizacaoAtiva === 'geografica' }"
                  @click="visualizacaoAtiva = 'geografica'"
                >
                  🗺️ Geográfica
                </button>
              </div>
            </div>
            <div class="filter-item">
              <label class="filter-label">Métrica:</label>
              <select v-model="metricaSelecionada" class="filter-select">
                <option value="conformidade">Conformidade</option>
                <option value="desempenho">Desempenho</option>
                <option value="atendimento">Atendimento</option>
                <option value="estoque">Gestão de Estoque</option>
              </select>
            </div>
          </div>
          <div class="header-actions">
            <button class="action-btn secondary" @click="exportarMapa">
              📥 Exportar Mapa
            </button>
            <button class="action-btn primary" @click="alternarVistaDetalhada">
              {{ vistaDetalhada ? "Vista Simplificada" : "Vista Detalhada" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon media">📊</div>
          <div class="summary-content">
            <div class="summary-value">{{ desempenhoMedio }}%</div>
            <div class="summary-label">Desempenho Médio</div>
            <div class="summary-trend" :class="tendenciaGeral">
              {{ tendenciaGeral === "positive" ? "↗" : "↘" }}
              {{ Math.abs(variacaoMedia) }}%
            </div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon excelente">🏆</div>
          <div class="summary-content">
            <div class="summary-value">{{ setorDestaque.nome }}</div>
            <div class="summary-label">Setor em Destaque</div>
            <div class="summary-trend positive">
              {{ setorDestaque.pontuacao }}%
            </div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon atencao">⚠️</div>
          <div class="summary-content">
            <div class="summary-value">{{ setorCritico.nome }}</div>
            <div class="summary-label">Necessita Atenção</div>
            <div class="summary-trend negative">
              {{ setorCritico.pontuacao }}%
            </div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon auditorias">📋</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalAuditorias }}</div>
            <div class="summary-label">Auditorias Realizadas</div>
            <div class="summary-trend positive">+12%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="map-content">
      <!-- Mapa Setorial -->
      <div v-if="visualizacaoAtiva === 'setorial'" class="mapa-setorial">
        <div class="setores-grid" :class="{ detailed: vistaDetalhada }">
          <div
            v-for="setor in setores"
            :key="setor.id"
            class="setor-card"
            :class="[
              setor.status,
              {
                selecionado: setorSelecionado?.id === setor.id,
                'with-details': vistaDetalhada,
              },
            ]"
            @click="selecionarSetor(setor)"
          >
            <div class="setor-header">
              <div class="setor-icon">{{ setor.icone }}</div>
              <div class="setor-info">
                <span class="setor-nome">{{ setor.nome }}</span>
                <span class="setor-score">{{ setor.pontuacao }}%</span>
              </div>
              <div class="setor-tendencia" :class="setor.tendencia">
                {{
                  setor.tendencia === "positiva"
                    ? "↗"
                    : setor.tendencia === "negativa"
                    ? "↘"
                    : "→"
                }}
              </div>
            </div>

            <div class="setor-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: setor.pontuacao + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ setor.pontuacao }}% da meta</span>
            </div>

            <div class="setor-stats">
              <div class="stat">
                <span class="stat-value">{{ setor.auditorias }}</span>
                <span class="stat-label">Auditorias</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ setor.nc }}</span>
                <span class="stat-label">NCs</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ setor.meta }}%</span>
                <span class="stat-label">Meta</span>
              </div>
            </div>

            <div v-if="vistaDetalhada" class="setor-details">
              <div class="detail-item">
                <span class="detail-label">Última Auditoria:</span>
                <span class="detail-value">{{ setor.ultimaAuditoria }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Responsável:</span>
                <span class="detail-value">{{ setor.responsavel }}</span>
              </div>
              <div class="detail-actions">
                <button
                  class="detail-btn"
                  @click.stop="iniciarAuditoria(setor)"
                >
                  🎯 Auditoria Rápida
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mapa Geográfico -->
      <div v-else class="mapa-geografico">
        <div class="mapa-header">
          <h3>Layout da Loja - Visualização Geográfica</h3>
          <div class="mapa-actions">
            <button class="mapa-btn" @click="alternarLegenda">
              {{ legendaVisivel ? "Ocultar" : "Mostrar" }} Legenda
            </button>
            <button class="mapa-btn" @click="zoomReset">🔍 Resetar Zoom</button>
          </div>
        </div>

        <div class="layout-container">
          <div
            class="layout-loja"
            :class="{ 'legenda-visible': legendaVisivel }"
          >
            <!-- Áreas da Loja -->
            <div
              v-for="area in areasGeograficas"
              :key="area.id"
              class="area"
              :class="[
                area.classe,
                area.status,
                { selecionada: areaSelecionada?.id === area.id },
              ]"
              :style="{
                gridColumn: area.gridColumn,
                gridRow: area.gridRow,
              }"
              @click="selecionarArea(area)"
            >
              <div class="area-content">
                <div class="area-icon">{{ area.icone }}</div>
                <div class="area-info">
                  <span class="area-name">{{ area.nome }}</span>
                  <span class="area-score">{{ area.pontuacao }}%</span>
                </div>
                <div class="area-badge" :class="area.status">
                  {{ area.status }}
                </div>
              </div>

              <div class="area-overlay">
                <div class="overlay-content">
                  <h4>{{ area.nome }}</h4>
                  <p>Desempenho: {{ area.pontuacao }}%</p>
                  <p>Auditorias: {{ area.auditorias }}</p>
                  <p>NCs: {{ area.nc }}</p>
                  <button
                    class="overlay-btn"
                    @click.stop="verDetalhesArea(area)"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>

            <!-- Elementos de Layout -->
            <div class="corredor vertical-1"></div>
            <div class="corredor vertical-2"></div>
            <div class="corredor horizontal-1"></div>
            <div class="corredor horizontal-2"></div>
          </div>

          <!-- Legenda Flutuante -->
          <div v-if="legendaVisivel" class="legenda-flutuante">
            <div class="legenda-header">
              <h4>Legenda de Performance</h4>
              <button class="legenda-close" @click="legendaVisivel = false">
                ×
              </button>
            </div>
            <div class="legenda-items">
              <div class="legenda-item">
                <div class="legenda-color excelente"></div>
                <div class="legenda-info">
                  <span class="legenda-status">Excelente</span>
                  <span class="legenda-range">90-100%</span>
                </div>
              </div>
              <div class="legenda-item">
                <div class="legenda-color bom"></div>
                <div class="legenda-info">
                  <span class="legenda-status">Bom</span>
                  <span class="legenda-range">80-89%</span>
                </div>
              </div>
              <div class="legenda-item">
                <div class="legenda-color medio"></div>
                <div class="legenda-info">
                  <span class="legenda-status">Médio</span>
                  <span class="legenda-range">70-79%</span>
                </div>
              </div>
              <div class="legenda-item">
                <div class="legenda-color baixo"></div>
                <div class="legenda-info">
                  <span class="legenda-status">Atenção</span>
                  <span class="legenda-range">&lt;70%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Painel de Insights -->
    <div v-if="vistaDetalhada" class="insights-panel">
      <div class="insights-header">
        <h3>💡 Insights do Mapa de Performance</h3>
        <span class="insights-count"
          >{{ insights.length }} insights identificados</span
        >
      </div>
      <div class="insights-grid">
        <div
          v-for="insight in insights"
          :key="insight.id"
          class="insight-card"
          :class="insight.tipo"
        >
          <div class="insight-icon">{{ insight.icone }}</div>
          <div class="insight-content">
            <h4>{{ insight.titulo }}</h4>
            <p>{{ insight.descricao }}</p>
            <div class="insight-actions">
              <button
                v-for="acao in insight.acoes"
                :key="acao"
                class="insight-btn"
                @click="executarAcao(insight, acao)"
              >
                {{ acao }}
              </button>
            </div>
          </div>
          <div class="insight-priority" :class="insight.prioridade">
            {{ insight.prioridade }}
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="itemSelecionado" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <div class="modal-icon">{{ itemSelecionado.icone }}</div>
            <h3>{{ itemSelecionado.nome }}</h3>
          </div>
          <button class="modal-close" @click="fecharModal">×</button>
        </div>

        <div class="modal-body">
          <div class="metricas-principais">
            <div class="metrica-destaque">
              <span class="metrica-valor"
                >{{ itemSelecionado.pontuacao }}%</span
              >
              <span class="metrica-label">Pontuação Geral</span>
              <div
                class="metrica-comparacao"
                :class="itemSelecionado.tendencia"
              >
                {{ itemSelecionado.tendencia === "positiva" ? "↗" : "↘" }}
                {{ Math.abs(itemSelecionado.variacao) }}% vs período anterior
              </div>
            </div>
          </div>

          <div class="metricas-detalhadas">
            <div class="metrica-item">
              <span class="metrica-numero">{{
                itemSelecionado.auditorias
              }}</span>
              <span class="metrica-desc">Auditorias Realizadas</span>
            </div>
            <div class="metrica-item">
              <span class="metrica-numero">{{ itemSelecionado.nc }}</span>
              <span class="metrica-desc">Não Conformidades</span>
            </div>
            <div class="metrica-item">
              <span class="metrica-numero">{{ itemSelecionado.meta }}%</span>
              <span class="metrica-desc">Meta de Desempenho</span>
            </div>
          </div>

          <div class="acoes-rapidas">
            <h4>Ações Rápidas</h4>
            <div class="acoes-grid">
              <button
                class="acao-btn primary"
                @click="iniciarAuditoria(itemSelecionado)"
              >
                🎯 Nova Auditoria
              </button>
              <button
                class="acao-btn secondary"
                @click="gerarRelatorio(itemSelecionado)"
              >
                📊 Relatório Detalhado
              </button>
              <button
                class="acao-btn secondary"
                @click="agendarVisita(itemSelecionado)"
              >
                🗓️ Agendar Visita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <span>Carregando mapa de performance...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// Estado do componente
const visualizacaoAtiva = ref("setorial");
const metricaSelecionada = ref("conformidade");
const vistaDetalhada = ref(false);
const legendaVisivel = ref(true);
const setorSelecionado = ref(null);
const areaSelecionada = ref(null);
const carregando = ref(true);

// Computed
const itemSelecionado = computed(
  () => setorSelecionado.value || areaSelecionada.value
);

// Dados dos setores
const setores = ref([
  {
    id: 1,
    nome: "Entrada",
    icone: "🚪",
    pontuacao: 98,
    auditorias: 5,
    nc: 1,
    meta: 95,
    status: "excelente",
    tendencia: "positiva",
    variacao: 2.1,
    ultimaAuditoria: "15/01/2024",
    responsavel: "João Silva",
  },
  {
    id: 2,
    nome: "Caixas",
    icone: "💸",
    pontuacao: 92,
    auditorias: 8,
    nc: 3,
    meta: 90,
    status: "excelente",
    tendencia: "positiva",
    variacao: 1.8,
    ultimaAuditoria: "14/01/2024",
    responsavel: "Maria Santos",
  },
  {
    id: 3,
    nome: "Atendimento",
    icone: "👥",
    pontuacao: 95,
    auditorias: 6,
    nc: 2,
    meta: 92,
    status: "excelente",
    tendencia: "positiva",
    variacao: 3.2,
    ultimaAuditoria: "13/01/2024",
    responsavel: "Pedro Costa",
  },
  {
    id: 4,
    nome: "Eletrônicos",
    icone: "📱",
    pontuacao: 88,
    auditorias: 4,
    nc: 4,
    meta: 85,
    status: "bom",
    tendencia: "positiva",
    variacao: 2.5,
    ultimaAuditoria: "12/01/2024",
    responsavel: "Ana Oliveira",
  },
  {
    id: 5,
    nome: "Vestuário",
    icone: "👕",
    pontuacao: 85,
    auditorias: 7,
    nc: 6,
    meta: 80,
    status: "bom",
    tendencia: "neutra",
    variacao: 0.5,
    ultimaAuditoria: "11/01/2024",
    responsavel: "Carlos Lima",
  },
  {
    id: 6,
    nome: "Alimentos",
    icone: "🍎",
    pontuacao: 78,
    auditorias: 5,
    nc: 8,
    meta: 75,
    status: "medio",
    tendencia: "negativa",
    variacao: -2.1,
    ultimaAuditoria: "10/01/2024",
    responsavel: "Fernanda Rocha",
  },
  {
    id: 7,
    nome: "Estoque",
    icone: "📦",
    pontuacao: 82,
    auditorias: 3,
    nc: 5,
    meta: 80,
    status: "bom",
    tendencia: "positiva",
    variacao: 1.2,
    ultimaAuditoria: "09/01/2024",
    responsavel: "Ricardo Alves",
  },
  {
    id: 8,
    nome: "Limpeza",
    icone: "🧹",
    pontuacao: 100,
    auditorias: 4,
    nc: 0,
    meta: 95,
    status: "excelente",
    tendencia: "positiva",
    variacao: 5.0,
    ultimaAuditoria: "08/01/2024",
    responsavel: "Patrícia Souza",
  },
]);

// Dados do mapa geográfico
const areasGeograficas = ref([
  {
    id: 1,
    nome: "Entrada",
    icone: "🚪",
    pontuacao: 98,
    auditorias: 5,
    nc: 1,
    status: "excelente",
    classe: "entrada",
    gridColumn: "1",
    gridRow: "1",
  },
  {
    id: 2,
    nome: "Caixas",
    icone: "💸",
    pontuacao: 92,
    auditorias: 8,
    nc: 3,
    status: "excelente",
    classe: "caixas",
    gridColumn: "2 / 4",
    gridRow: "1",
  },
  {
    id: 3,
    nome: "Atendimento",
    icone: "👥",
    pontuacao: 95,
    auditorias: 6,
    nc: 2,
    status: "excelente",
    classe: "atendimento",
    gridColumn: "1",
    gridRow: "2",
  },
  {
    id: 4,
    nome: "Eletrônicos",
    icone: "📱",
    pontuacao: 88,
    auditorias: 4,
    nc: 4,
    status: "bom",
    classe: "eletronicos",
    gridColumn: "2",
    gridRow: "2",
  },
  {
    id: 5,
    nome: "Vestuário",
    icone: "👕",
    pontuacao: 85,
    auditorias: 7,
    nc: 6,
    status: "bom",
    classe: "vestuario",
    gridColumn: "3",
    gridRow: "2",
  },
  {
    id: 6,
    nome: "Alimentos",
    icone: "🍎",
    pontuacao: 78,
    auditorias: 5,
    nc: 8,
    status: "medio",
    classe: "alimentos",
    gridColumn: "1 / 3",
    gridRow: "3",
  },
  {
    id: 7,
    nome: "Estoque",
    icone: "📦",
    pontuacao: 82,
    auditorias: 3,
    nc: 5,
    status: "bom",
    classe: "estoque",
    gridColumn: "3",
    gridRow: "3",
  },
  {
    id: 8,
    nome: "Limpeza",
    icone: "🧹",
    pontuacao: 100,
    auditorias: 4,
    nc: 0,
    status: "excelente",
    classe: "limpeza",
    gridColumn: "1",
    gridRow: "3",
  },
]);

// Insights
const insights = ref([
  {
    id: 1,
    tipo: "destaque",
    icone: "🏆",
    titulo: "Área de Limpeza com Performance Perfeita",
    descricao:
      "100% de conformidade em todas as auditorias realizadas. Setor exemplar!",
    acoes: ["Documentar Práticas", "Compartilhar Melhores Práticas"],
    prioridade: "Alta",
  },
  {
    id: 2,
    tipo: "alerta",
    icone: "⚠️",
    titulo: "Atenção Necessária no Setor de Alimentos",
    descricao:
      "Performance abaixo de 80% com tendência negativa. Necessidade de intervenção.",
    acoes: ["Plano de Ação", "Auditoria Extra"],
    prioridade: "Urgente",
  },
  {
    id: 3,
    tipo: "oportunidade",
    icone: "💡",
    titulo: "Oportunidade em Eletrônicos",
    descricao:
      "Crescimento positivo de 2.5%. Potencial para atingir excelência.",
    acoes: ["Capacitar Equipe", "Otimizar Processos"],
    prioridade: "Média",
  },
]);

// Computed properties
const desempenhoMedio = computed(() => {
  return Math.round(
    setores.value.reduce((sum, setor) => sum + setor.pontuacao, 0) /
      setores.value.length
  );
});

const variacaoMedia = computed(() => {
  return (
    setores.value.reduce((sum, setor) => sum + setor.variacao, 0) /
    setores.value.length
  );
});

const tendenciaGeral = computed(() => {
  return variacaoMedia.value >= 0 ? "positive" : "negative";
});

const setorDestaque = computed(() => {
  return setores.value.reduce((prev, current) =>
    prev.pontuacao > current.pontuacao ? prev : current
  );
});

const setorCritico = computed(() => {
  return setores.value.reduce((prev, current) =>
    prev.pontuacao < current.pontuacao ? prev : current
  );
});

const totalAuditorias = computed(() => {
  return setores.value.reduce((sum, setor) => sum + setor.auditorias, 0);
});

// Métodos
const selecionarSetor = (setor) => {
  setorSelecionado.value = setor;
  areaSelecionada.value = null;
};

const selecionarArea = (area) => {
  areaSelecionada.value = area;
  setorSelecionado.value = null;
};

const fecharModal = () => {
  setorSelecionado.value = null;
  areaSelecionada.value = null;
};

const alternarVistaDetalhada = () => {
  vistaDetalhada.value = !vistaDetalhada.value;
};

const alternarLegenda = () => {
  legendaVisivel.value = !legendaVisivel.value;
};

const zoomReset = () => {
  console.log("Resetando zoom do mapa...");
};

const exportarMapa = () => {
  console.log("Exportando mapa...");
  alert("Mapa de performance exportado com sucesso!");
};

const iniciarAuditoria = (item) => {
  console.log("Iniciando auditoria para:", item.nome);
  alert(`Auditoria iniciada para ${item.nome}`);
};

const gerarRelatorio = (item) => {
  console.log("Gerando relatório para:", item.nome);
  alert(`Relatório gerado para ${item.nome}`);
};

const agendarVisita = (item) => {
  console.log("Agendando visita para:", item.nome);
  alert(`Visita agendada para ${item.nome}`);
};

const verDetalhesArea = (area) => {
  selecionarArea(area);
};

const executarAcao = (insight, acao) => {
  console.log(`Executando ação: ${acao} para insight: ${insight.titulo}`);
  alert(`Ação "${acao}" executada para: ${insight.titulo}`);
};

onMounted(() => {
  // Simular carregamento de dados
  setTimeout(() => {
    carregando.value = false;
  }, 2000);
});
</script>

<style scoped>
.performance-map-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
}

/* Header Section */
.section-header {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
}

.title-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.title-content p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

.header-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  gap: 1.5rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.view-toggle {
  display: flex;
  background: #f7fafc;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid #e2e8f0;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.toggle-btn.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #667eea;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
  min-width: 160px;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.action-btn.secondary:hover {
  background: #f8fafc;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.summary-icon.media {
  background: rgba(102, 126, 234, 0.1);
}

.summary-icon.excelente {
  background: rgba(76, 175, 80, 0.1);
}

.summary-icon.atencao {
  background: rgba(255, 152, 0, 0.1);
}

.summary-icon.auditorias {
  background: rgba(156, 39, 176, 0.1);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.summary-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.summary-trend.positive {
  color: #4caf50;
}

.summary-trend.negative {
  color: #f44336;
}

/* Map Content */
.map-content {
  padding: 2rem;
}

/* Mapa Setorial */
.setores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.setores-grid.detailed {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.setor-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.setor-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.setor-card.excelente::before {
  background: linear-gradient(90deg, #48bb78, #68d391);
}
.setor-card.bom::before {
  background: linear-gradient(90deg, #4299e1, #63b3ed);
}
.setor-card.medio::before {
  background: linear-gradient(90deg, #ed8936, #f6ad55);
}
.setor-card.baixo::before {
  background: linear-gradient(90deg, #f56565, #fc8181);
}

.setor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
}

.setor-card.selecionado {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.2);
}

.setor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.setor-icon {
  font-size: 2rem;
}

.setor-info {
  flex: 1;
}

.setor-nome {
  display: block;
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

.setor-score {
  font-size: 1.3rem;
  font-weight: 700;
}

.setor-card.excelente .setor-score {
  color: #48bb78;
}
.setor-card.bom .setor-score {
  color: #4299e1;
}
.setor-card.medio .setor-score {
  color: #ed8936;
}
.setor-card.baixo .setor-score {
  color: #f56565;
}

.setor-tendencia {
  font-size: 1.2rem;
  font-weight: 700;
}

.setor-tendencia.positiva {
  color: #48bb78;
}
.setor-tendencia.negativa {
  color: #f56565;
}
.setor-tendencia.neutra {
  color: #a0aec0;
}

.setor-progress {
  margin-bottom: 1rem;
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
  border-radius: 10px;
  transition: width 0.5s ease;
}

.setor-card.excelente .progress-fill {
  background: linear-gradient(90deg, #48bb78, #68d391);
}
.setor-card.bom .progress-fill {
  background: linear-gradient(90deg, #4299e1, #63b3ed);
}
.setor-card.medio .progress-fill {
  background: linear-gradient(90deg, #ed8936, #f6ad55);
}
.setor-card.baixo .progress-fill {
  background: linear-gradient(90deg, #f56565, #fc8181);
}

.progress-text {
  font-size: 0.8rem;
  color: #718096;
  text-align: center;
  display: block;
}

.setor-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: 700;
  color: #2d3748;
  font-size: 1.2rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
}

.setor-details {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-label {
  color: #718096;
}

.detail-value {
  font-weight: 600;
  color: #2d3748;
}

.detail-actions {
  margin-top: 1rem;
}

.detail-btn {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  background: #5a67d8;
}

/* Mapa Geográfico */
.mapa-geografico {
  position: relative;
}

.mapa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.mapa-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.mapa-actions {
  display: flex;
  gap: 1rem;
}

.mapa-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.mapa-btn:hover {
  background: #f7fafc;
  border-color: #667eea;
  color: #667eea;
}

.layout-container {
  position: relative;
  background: #f8fafc;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.layout-loja {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 150px 150px 150px;
  gap: 1rem;
  height: 500px;
  position: relative;
}

/* Áreas do Mapa Geográfico */
.area {
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 3px solid transparent;
}

.area:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.area.selecionada {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.2);
}

.area-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  z-index: 2;
  position: relative;
}

.area-icon {
  font-size: 2rem;
}

.area-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.area-name {
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
}

.area-score {
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-size: 1.1rem;
}

.area-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.area-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.area:hover .area-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 1rem;
}

.overlay-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.overlay-content p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.overlay-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.overlay-btn:hover {
  background: #5a67d8;
}

/* Cores das áreas baseadas no desempenho */
.area.excelente {
  background: linear-gradient(135deg, #48bb78, #38a169);
}
.area.bom {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}
.area.medio {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
}
.area.baixo {
  background: linear-gradient(135deg, #f56565, #e53e3e);
}

/* Posicionamento das áreas */
.entrada {
  grid-column: 1;
  grid-row: 1;
}
.caixas {
  grid-column: 2 / 4;
  grid-row: 1;
}
.atendimento {
  grid-column: 1;
  grid-row: 2;
}
.eletronicos {
  grid-column: 2;
  grid-row: 2;
}
.vestuario {
  grid-column: 3;
  grid-row: 2;
}
.alimentos {
  grid-column: 1 / 3;
  grid-row: 3;
}
.estoque {
  grid-column: 3;
  grid-row: 3;
}
.limpeza {
  grid-column: 1;
  grid-row: 3;
}

/* Corredores */
.corredor {
  position: absolute;
  background: #e2e8f0;
  z-index: 1;
}

.corredor.vertical-1 {
  left: 33.33%;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #cbd5e0, transparent);
}

.corredor.vertical-2 {
  left: 66.66%;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #cbd5e0, transparent);
}

.corredor.horizontal-1 {
  top: 33.33%;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, #cbd5e0, transparent);
}

.corredor.horizontal-2 {
  top: 66.66%;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, #cbd5e0, transparent);
}

/* Legenda Flutuante */
.legenda-flutuante {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  z-index: 10;
  min-width: 200px;
}

.legenda-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.legenda-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.legenda-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #718096;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legenda-close:hover {
  background: #f7fafc;
}

.legenda-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legenda-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legenda-color.excelente {
  background: #48bb78;
}
.legenda-color.bom {
  background: #4299e1;
}
.legenda-color.medio {
  background: #ed8936;
}
.legenda-color.baixo {
  background: #f56565;
}

.legenda-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.legenda-status {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.legenda-range {
  font-size: 0.8rem;
  color: #718096;
}

/* Insights Panel */
.insights-panel {
  padding: 2rem;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.insights-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.insights-count {
  color: #718096;
  font-weight: 500;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.insight-card.destaque {
  border-left-color: #4caf50;
}

.insight-card.alerta {
  border-left-color: #f44336;
}

.insight-card.oportunidade {
  border-left-color: #ff9800;
}

.insight-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-content h4 {
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.insight-content p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
}

.insight-actions {
  display: flex;
  gap: 0.5rem;
}

.insight-btn {
  padding: 0.4rem 0.8rem;
  background: #667eea;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.insight-btn:hover {
  background: #5a6fd8;
}

.insight-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  height: fit-content;
  flex-shrink: 0;
}

.insight-priority.Alta {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.insight-priority.Urgente {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid #f44336;
}

.insight-priority.Media {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  font-size: 2rem;
}

.modal-title h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f7fafc;
  color: #4a5568;
}

.metricas-principais {
  margin-bottom: 2rem;
}

.metrica-destaque {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
}

.metrica-valor {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.metrica-label {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  display: block;
}

.metrica-comparacao {
  font-size: 0.9rem;
  opacity: 0.8;
}

.metrica-comparacao.positiva {
  color: #68d391;
}
.metrica-comparacao.negativa {
  color: #fc8181;
}

.metricas-detalhadas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.metrica-item {
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.metrica-numero {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.metrica-desc {
  font-size: 0.8rem;
  color: #718096;
}

.acoes-rapidas h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.acoes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.acao-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
}

.acao-btn.primary {
  background: #667eea;
  color: white;
}

.acao-btn.primary:hover {
  background: #5a67d8;
}

.acao-btn.secondary {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.acao-btn.secondary:hover {
  background: #f8fafc;
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
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  z-index: 100;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
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
@media (max-width: 1024px) {
  .setores-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-header,
  .map-content,
  .insights-panel {
    padding: 1.5rem;
  }

  .header-main {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-controls {
    align-items: stretch;
    width: 100%;
  }

  .filter-group {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    justify-content: space-between;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .layout-loja {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 100px);
    height: auto;
  }

  .area {
    grid-column: 1 !important;
    grid-row: auto !important;
  }

  .metricas-detalhadas {
    grid-template-columns: 1fr;
  }

  .legenda-flutuante {
    position: static;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .setores-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }

  .mapa-actions {
    flex-direction: column;
  }
}
</style>
