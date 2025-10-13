<template>
  <div class="summary-cards-container">
    <div class="summary-cards">
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
import { ref, computed } from "vue";

// Dados de exemplo - você pode substituir por props posteriormente
const dadosExemplo = ref({
  auditoriasRealizadas: 20,
  variacaoAuditorias: 12,
  posicaoGeral: 3,
  colaboradorDestaque: "Jhon Doe",
  totalColaboradores: 28,
});

// Computed properties para os dados
const auditoriasRealizadas = computed(
  () => dadosExemplo.value.auditoriasRealizadas
);
const variacaoAuditorias = computed(
  () => dadosExemplo.value.variacaoAuditorias
);
const posicaoGeral = computed(() => dadosExemplo.value.posicaoGeral);
const colaboradorDestaque = computed(
  () => dadosExemplo.value.colaboradorDestaque
);
const totalColaboradores = computed(
  () => dadosExemplo.value.totalColaboradores
);

// Se quiser tornar o componente mais flexível, pode adicionar props:
// const props = defineProps({
//   auditorias: Number,
//   posicao: Number,
//   colaborador: String,
//   totalColaboradores: Number,
//   variacao: Number
// })
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
