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
      <button @click="buscarMetricas" class="retry-button">Tentar novamente</button>
    </div>

    <!-- Data loaded -->
    <div v-else class="summary-cards">
      <div class="summary-card">
        <div class="summary-icon distribuicao">
          <span class="summary-emoji">📊</span>
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
          <span class="summary-emoji">🏆</span>
        </div>
        <div class="summary-content">
          <div class="summary-value">#{{ posicaoGeral }}</div>
          <div class="summary-label">Posição geral da loja</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon setor-destaque">
          <span class="summary-emoji">⭐</span>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ colaboradorDestaque }}</div>
          <div class="summary-label">Colaborador Em Destaque</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon tipo-predominante">
          <span class="summary-emoji">👥</span>
        </div>
        <div class="summary-content">
          <div class="summary-value">{{ totalColaboradores }}</div>
          <div class="summary-label">Colaboradores</div>
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

.summary-icon.desempenho {
  background: rgba(76, 175, 80, 0.1);
}

.summary-icon.setor-destaque {
  background: rgba(255, 193, 7, 0.1);
}

.summary-icon.tipo-predominante {
  background: rgba(156, 39, 176, 0.1);
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
