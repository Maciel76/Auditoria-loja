<template>
  <div class="ranking-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-list-ol"></i>
        Ranking Completo
      </h2>
      <div class="results-info">{{ lojas.length }} lojas encontradas</div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados das lojas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="retry-button">
        <i class="fas fa-redo"></i>
        Tentar Novamente
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="lojas.length === 0" class="empty-container">
      <i class="fas fa-search"></i>
      <p>Nenhuma loja encontrada com os filtros aplicados</p>
    </div>

    <!-- Ranking List -->
    <div v-else class="ranking-list">
      <div
        v-for="(loja, index) in lojas"
        :key="loja.codigo"
        class="ranking-card"
        :class="{
          gold: index === 0,
          silver: index === 1,
          bronze: index === 2,
        }"
      >
        <!-- Posição -->
        <div class="position">
          <span class="position-number">{{ index + 1 }}</span>
        </div>

        <!-- Avatar/Imagem da Loja -->
        <div class="loja-avatar">
          <div class="avatar-container" :class="getAvatarClass(index)">
            <img
              v-if="getLojaImagePath(loja.codigo)"
              :src="getLojaImagePath(loja.codigo)"
              :alt="`Loja ${loja.codigo}`"
              class="loja-image"
              @error="handleImageError"
            />
            <div v-else class="loja-initials">
              {{ getLojaInitials(loja) }}
            </div>
          </div>
        </div>

        <!-- Info da Loja -->
        <div class="loja-main-info">
          <div class="loja-header">
            <h3 class="loja-codigo">{{ loja.codigo }}</h3>
          </div>
          <p class="loja-nome">{{ loja.nome || `Loja ${loja.codigo}` }}</p>
        </div>

        <!-- Estatísticas -->
        <div class="loja-stats">
          <div class="stat-item">
            <div class="stat-icon">⚡</div>
            <div class="stat-data">
              <span class="stat-value">{{ calcularEficiencia(loja) }}%</span>
              <span class="stat-label">Eficiência</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-data">
              <span class="stat-value">{{
                loja.itensAuditados?.toLocaleString() || 0
              }}</span>
              <span class="stat-label">Itens Auditados</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">👥</div>
            <div class="stat-data">
              <span class="stat-value">{{ loja.usuariosAtivos || 0 }}</span>
              <span class="stat-label">Usuários Ativos</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">📈</div>
            <div class="stat-data">
              <span class="stat-value">{{
                calcularMediaPorUsuario(loja)
              }}</span>
              <span class="stat-label">Média/Usuário</span>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="loja-actions">
          <button
            @click="$emit('view-details', loja)"
            class="action-button primary"
            title="Ver dados da loja"
          >
            <i class="fas fa-eye"></i>
            Ver Loja
          </button>
        </div>

        <!-- Barra de Progresso -->
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${getProgressPercentage(loja)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLojaStore } from "@/store/lojaStore.js";

const props = defineProps({
  lojas: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  maxItens: {
    type: Number,
    default: 0,
  },
});

defineEmits(["retry", "view-details"]);

const lojaStore = useLojaStore();

// Helper methods
const calcularEficiencia = (loja) => {
  if (!loja.usuariosAtivos || loja.usuariosAtivos === 0) return 0;

  // Se a eficiência já vem calculada da API, usar ela
  if (loja.eficiencia !== undefined) {
    return parseFloat(Math.min(loja.eficiencia, 100).toFixed(2));
  }

  // Caso contrário, calcular baseado na média por usuário
  const mediaPorUsuario = loja.itensAuditados / loja.usuariosAtivos;
  // Normalizar para uma escala de 0-100 (considerando 1000 itens como 100%)
  const eficiencia = Math.min((mediaPorUsuario / 1000) * 100, 100);
  return parseFloat(eficiencia.toFixed(2));
};

const calcularMediaPorUsuario = (loja) => {
  // Se a média já vem calculada da API, usar ela
  if (loja.mediaPorUsuario !== undefined) {
    return loja.mediaPorUsuario;
  }

  // Caso contrário, calcular
  if (!loja.usuariosAtivos || loja.usuariosAtivos === 0) return 0;
  return Math.round(loja.itensAuditados / loja.usuariosAtivos);
};

const getProgressPercentage = (loja) => {
  return props.maxItens > 0
    ? ((loja.itensAuditados || 0) / props.maxItens) * 100
    : 0;
};

// Métodos para avatar das lojas
const getLojaImagePath = (codigo) => {
  // Buscar a loja no store
  const lojaDoStore = lojaStore.lojas.find((l) => l.codigo === codigo);

  if (lojaDoStore && lojaDoStore.imagem) {
    return lojaDoStore.imagem;
  }

  // Fallback: tentar o padrão do store
  const codigoPadronizado = codigo.toString().padStart(3, "0");
  return `/images/lojas/${codigoPadronizado}.jpg`;
};

const getLojaInitials = (loja) => {
  // Primeiro tentar pegar o nome do store
  const lojaDoStore = lojaStore.lojas.find((l) => l.codigo === loja.codigo);
  const nomeCompleto = lojaDoStore?.nome || loja.nome;

  if (nomeCompleto && nomeCompleto.trim()) {
    // Pegar iniciais do nome da loja
    const palavras = nomeCompleto.trim().split(" ");

    // Se tem "Loja" no início, pular ela
    const palavrasLimpas = palavras.filter(
      (palavra) => palavra.toLowerCase() !== "loja" && !palavra.match(/^\d+$/) // Também pular números puros
    );

    if (palavrasLimpas.length > 0) {
      return palavrasLimpas
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    }
  }

  // Fallback para código da loja
  return loja.codigo.slice(0, 2).toUpperCase();
};

const getAvatarClass = (index) => {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
};

const handleImageError = (event) => {
  // Se a imagem falhar ao carregar, esconder ela para mostrar as iniciais
  event.target.style.display = "none";
  const nextElement = event.target.nextElementSibling;
  if (nextElement) {
    nextElement.style.display = "flex";
  }
};
</script>

<style scoped>
/* Ranking Section */
.ranking-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  font-family: "Inter", sans-serif;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-info {
  color: #6b7280;
  font-size: 0.9rem;
}

/* States */
.loading-container,
.error-container,
.empty-container {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  margin-right: auto;
}

.retry-button:hover {
  background: #5b21b6;
}

/* Ranking List */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ranking-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: auto auto 1fr auto auto;
  gap: 1.5rem;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.ranking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #e0e7ff;
}

.ranking-card.gold {
  border-left: 4px solid #fbbf24;
  background: linear-gradient(135deg, #fef3c7 0%, rgba(251, 191, 36, 0.1) 100%);
}

.ranking-card.silver {
  border-left: 4px solid #9ca3af;
  background: linear-gradient(
    135deg,
    #f3f4f6 0%,
    rgba(156, 163, 175, 0.1) 100%
  );
}

.ranking-card.bronze {
  border-left: 4px solid #d97706;
  background: linear-gradient(135deg, #fed7aa 0%, rgba(217, 119, 6, 0.1) 100%);
}

.position {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
}

.position-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

/* Avatar da Loja */
.loja-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border: 3px solid #e5e7eb;
  position: relative;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
  border-color: #6366f1;
}

.avatar-container.gold {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.avatar-container.silver {
  border-color: #9ca3af;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.3);
}

.avatar-container.bronze {
  border-color: #d97706;
  background: linear-gradient(135deg, #fed7aa, #fdba74);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.loja-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.loja-initials {
  font-size: 1.2rem;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.avatar-container.gold .loja-initials {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #92400e;
}

.avatar-container.silver .loja-initials {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  color: white;
}

.avatar-container.bronze .loja-initials {
  background: linear-gradient(135deg, #d97706, #c2410c);
  color: white;
}

.loja-main-info {
  flex: 1;
}

.loja-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.loja-codigo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.loja-nome {
  color: #6b7280;
  margin: 0;
}

.loja-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-data {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1;
}

.loja-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button.primary {
  background: #6366f1;
  color: white;
}

.action-button.primary:hover {
  background: #5b21b6;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #f1f5f9;
  border-radius: 0 0 16px 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.8s ease;
  border-radius: 0 0 16px 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .ranking-card {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }

  .position {
    order: 1;
  }

  .loja-avatar {
    order: 2;
  }

  .loja-main-info {
    order: 3;
  }

  .loja-stats {
    order: 4;
    grid-template-columns: repeat(2, 1fr);
  }

  .loja-actions {
    order: 5;
    justify-content: center;
  }

  .avatar-container {
    width: 50px;
    height: 50px;
  }

  .loja-initials {
    font-size: 1rem;
  }
}
</style>
