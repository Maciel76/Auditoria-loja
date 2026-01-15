<template>
  <div class="summary-cards-container">
    <!-- Loading state -->
    <div v-if="loading" class="summary-cards">
      <div v-for="i in 4" :key="i" class="summary-card skeleton">
        <div class="summary-icon skeleton-icon"></div>
        <div class="summary-content">
          <div class="skeleton-line skeleton-value"></div>
          <div class="skeleton-line skeleton-label"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="buscarMetricas" class="retry-button">
        Tentar novamente
      </button>
    </div>

    <!-- Data loaded -->
    <div v-else class="summary-cards">
      <div class="summary-card">
        <div class="summary-icon distribuicao">
          <i class="fas fa-chart-bar"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ auditoriasRealizadas }}</div>
          <div class="summary-label">Auditorias Realizadas</div>
          <div class="summary-trend positive" v-if="variacaoAuditorias > 0">
            +{{ variacaoAuditorias }}% vs anterior
          </div>
          <div
            class="summary-trend negative"
            v-else-if="variacaoAuditorias < 0"
          >
            {{ variacaoAuditorias }}% vs anterior
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon desempenho">
          <i class="fas fa-trophy"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">#{{ posicaoGeral }}</div>
          <div class="summary-label">Posição geral da loja</div>
        </div>
      </div>

      <div class="summary-card colaborador-destaque-card">
        <div class="summary-icon setor-destaque">
          <i class="fas fa-star"></i>
        </div>
        <div class="summary-content">
          <div class="colaborador-nome-wrapper">
            <div class="summary-value colaborador-nome">
              {{ colaboradorDestaque }}
            </div>
            <div class="colaborador-tooltip">{{ colaboradorDestaque }}</div>
          </div>
          <div class="summary-label">Auditor Destaque</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon tipo-predominante">
          <i class="fas fa-users"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ totalColaboradores }}</div>
          <div class="summary-label">Total Colaboradores</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon itens-auditados">
          <i class="fas fa-boxes"></i>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ totalItensAuditadosFormatado }}</div>
          <div class="summary-label">Total Itens Auditados</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

// Estado de loading e erro
const loading = ref(true);
const error = ref(null);

// Instância do API
const { get } = useApi();

// Dados da API
const dadosMetricas = ref({
  auditoriasRealizadas: 0,
  variacaoAuditorias: 0,
  posicaoGeral: 0,
  colaboradorDestaque: "N/A",
  totalColaboradores: 0,
  totalItensAuditados: 0,
});

// Computed properties para os dados
const auditoriasRealizadas = computed(
  () => dadosMetricas.value.auditoriasRealizadas
);
const variacaoAuditorias = computed(
  () => dadosMetricas.value.variacaoAuditorias
);
const posicaoGeral = computed(() => dadosMetricas.value.posicaoGeral);
const colaboradorDestaque = computed(
  () => dadosMetricas.value.colaboradorDestaque
);
const totalColaboradores = computed(
  () => dadosMetricas.value.totalColaboradores
);
const totalItensAuditados = computed(
  () => dadosMetricas.value.totalItensAuditados
);

// Função para formatar números grandes
const formatarNumero = (valor) => {
  if (valor >= 1000000) {
    return (valor / 1000000).toFixed(1).replace(".0", "") + " mi";
  }
  if (valor >= 1000) {
    return (valor / 1000).toFixed(1).replace(".0", "") + " mil";
  }
  return valor.toString();
};

// Computed property para Total Itens Auditados formatado
const totalItensAuditadosFormatado = computed(() =>
  formatarNumero(dadosMetricas.value.totalItensAuditados)
);

// Função para buscar métricas da loja
const buscarMetricas = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await get("/metricas/lojas");

    if (response.data) {
      dadosMetricas.value = {
        auditoriasRealizadas: response.data.auditoriasRealizadas || 0,
        variacaoAuditorias: response.data.variacaoAuditorias || 0,
        posicaoGeral: response.data.posicaoGeral || 0,
        colaboradorDestaque: response.data.colaboradorDestaque || "N/A",
        totalColaboradores: response.data.totalColaboradores || 0,
        totalItensAuditados: response.data.totalItensAuditados || 0,
      };
    }
  } catch (err) {
    console.error("Erro ao buscar métricas da loja:", err);
    error.value = err.message || "Erro ao carregar dados";
  } finally {
    loading.value = false;
  }
};

// Carregar dados ao montar o componente
onMounted(() => {
  buscarMetricas();
});

// Expor função de atualização para componentes pai (opcional)
defineExpose({
  buscarMetricas,
});
</script>

<style scoped>
.summary-cards-container {
  width: 100%;
  padding: 1rem 0;
}

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
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Estilo especial para o card do colaborador em destaque */
.colaborador-destaque-card {
  overflow: visible;
  position: relative;
}

.colaborador-nome-wrapper {
  position: relative;
  display: inline-block;
}

.colaborador-nome {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
  transition: color 0.3s ease;
  font-size: 1.1rem;
  font-weight: 700;
}

.colaborador-nome-wrapper:hover .colaborador-nome {
  color: #ffc107;
}

/* Tooltip flutuante */
.colaborador-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(-5px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1000;
}

/* Seta do tooltip */
.colaborador-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #764ba2;
}

/* Mostrar tooltip no hover */
.colaborador-nome-wrapper:hover .colaborador-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* Animação de destaque no card ao hover */
.colaborador-destaque-card:hover {
  border-color: rgba(255, 193, 7, 0.3);
  box-shadow: 0 4px 16px rgba(255, 193, 7, 0.15);
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

.summary-icon.distribuicao {
  background: rgba(102, 126, 234, 0.1);
}

.summary-icon.distribuicao i {
  color: #667eea;
}

.summary-icon.desempenho {
  background: rgba(255, 152, 0, 0.1);
}

.summary-icon.desempenho i {
  color: #ff9800;
}

.summary-icon.setor-destaque {
  background: rgba(255, 193, 7, 0.1);
}

.summary-icon.setor-destaque i {
  color: #ffc107;
}

.summary-icon.tipo-predominante {
  background: rgba(158, 158, 158, 0.1);
}

.summary-icon.tipo-predominante i {
  color: #9e9e9e;
}

.summary-icon.itens-auditados {
  background: rgba(33, 150, 243, 0.1);
}

.summary-icon.itens-auditados i {
  color: #2196f3;
}

.summary-emoji {
  font-size: 1.5rem;
}

.summary-content {
  flex: 1;
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

/* Loading skeleton styles */
.summary-card.skeleton {
  pointer-events: none;
}

.skeleton-icon {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 10px;
}

.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-value {
  height: 1.5rem;
  width: 60%;
}

.skeleton-label {
  height: 0.9rem;
  width: 80%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error state styles */
.error-container {
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.error-message {
  color: #f44336;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.retry-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.retry-button:active {
  transform: translateY(0);
}

/* Responsividade */
@media (max-width: 1200px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .summary-card {
    padding: 1rem;
  }

  .summary-icon {
    width: 40px;
    height: 40px;
  }

  .summary-emoji {
    font-size: 1.2rem;
  }

  .summary-value {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .summary-card {
    padding: 1.25rem;
  }
}
</style>
