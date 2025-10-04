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
          <div class="position-medal" v-if="index < 3">
            {{ index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉" }}
          </div>
        </div>

        <!-- Info da Loja -->
        <div class="loja-main-info">
          <div class="loja-header">
            <h3 class="loja-codigo">{{ loja.codigo }}</h3>
            <div
              class="loja-badge"
              :class="getLojaCategory(loja.itensAuditados)"
            >
              {{ getLojaCategory(loja.itensAuditados) }}
            </div>
            <div v-if="loja.liga" class="liga-badge" :class="loja.liga">
              {{ getLigaIcon(loja.liga) }} {{ loja.liga }}
            </div>
          </div>
          <p class="loja-nome">{{ loja.nome || `Loja ${loja.codigo}` }}</p>
          <p v-if="loja.regiao" class="loja-regiao">
            {{ getRegiaoIcon(loja.regiao) }} {{ loja.regiao }}
          </p>
        </div>

        <!-- Estatísticas -->
        <div class="loja-stats">
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
            <div class="stat-icon">⚡</div>
            <div class="stat-data">
              <span class="stat-value">{{ calcularEficiencia(loja) }}%</span>
              <span class="stat-label">Eficiência</span>
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
            title="Ver detalhes da loja"
          >
            <i class="fas fa-chart-line"></i>
            Detalhes
          </button>
          <button
            @click="$emit('compare', loja)"
            class="action-button secondary"
            title="Comparar com outras lojas"
          >
            <i class="fas fa-balance-scale"></i>
            Comparar
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

defineEmits(["retry", "view-details", "compare"]);

// Helper methods
const calcularEficiencia = (loja) => {
  if (!loja.usuariosAtivos || loja.usuariosAtivos === 0) return 0;

  // Se a eficiência já vem calculada da API, usar ela
  if (loja.eficiencia !== undefined) {
    return Math.min(loja.eficiencia, 100);
  }

  // Caso contrário, calcular baseado na média por usuário
  const mediaPorUsuario = loja.itensAuditados / loja.usuariosAtivos;
  // Normalizar para uma escala de 0-100 (considerando 1000 itens como 100%)
  const eficiencia = Math.min((mediaPorUsuario / 1000) * 100, 100);
  return Math.round(eficiencia);
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

const getLojaCategory = (itens) => {
  if (itens >= 8000) return "elite";
  if (itens >= 5000) return "alta";
  if (itens >= 2000) return "media";
  return "iniciante";
};

const getProgressPercentage = (loja) => {
  return props.maxItens > 0
    ? ((loja.itensAuditados || 0) / props.maxItens) * 100
    : 0;
};

const getLigaIcon = (liga) => {
  const icons = {
    diamante: "💎",
    ouro: "🥇",
    prata: "🥈",
    bronze: "🥉",
  };
  return icons[liga] || "🏆";
};

const getRegiaoIcon = (regiao) => {
  const icons = {
    Norte: "🌍",
    Sul: "🏔️",
    Leste: "🌅",
    Oeste: "🌇",
    "Centro-Oeste": "🎯",
    centro: "🎯",
    norte: "🌍",
    sul: "🏔️",
    leste: "🌅",
    oeste: "🌇",
  };
  return icons[regiao] || "📍";
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
  grid-template-columns: auto 1fr auto auto;
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

.position-medal {
  font-size: 1.2rem;
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

.loja-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.loja-badge.elite {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  color: #7c2d12;
}

.loja-badge.alta {
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  color: white;
}

.loja-badge.media {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
}

.loja-badge.iniciante {
  background: #f1f5f9;
  color: #6b7280;
}

.loja-nome {
  color: #6b7280;
  margin: 0;
}

.loja-regiao {
  color: #9ca3af;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.liga-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.liga-badge.diamante {
  background: linear-gradient(45deg, #ede9fe, #ddd6fe);
  color: #5b21b6;
}

.liga-badge.ouro {
  background: linear-gradient(45deg, #fef3c7, #fde68a);
  color: #92400e;
}

.liga-badge.prata {
  background: linear-gradient(45deg, #f1f5f9, #e2e8f0);
  color: #475569;
}

.liga-badge.bronze {
  background: linear-gradient(45deg, #fed7aa, #fdba74);
  color: #c2410c;
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

.action-button.secondary {
  background: #f3f4f6;
  color: #374151;
}

.action-button.secondary:hover {
  background: #e5e7eb;
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

  .loja-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .loja-actions {
    justify-content: center;
  }
}
</style>
