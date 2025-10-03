<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          <i class="fas fa-store gradient-icon"></i>
          Ranking das Lojas
        </h1>
        <p class="hero-subtitle">
          Compare a performance entre todas as lojas da rede
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat-card" @click="focusMetric('lojas')">
          <div class="stat-icon">🏪</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalLojas }}</div>
            <div class="stat-label">Lojas Ativas</div>
          </div>
          <div class="stat-trend">
            <i class="fas fa-arrow-up"></i>
            <span>+2 este mês</span>
          </div>
        </div>
        <div class="stat-card" @click="focusMetric('itens')">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-number">{{ totalItensAuditados.toLocaleString() }}</div>
            <div class="stat-label">Itens Auditados</div>
          </div>
          <div class="stat-trend">
            <i class="fas fa-arrow-up"></i>
            <span>+15.2%</span>
          </div>
        </div>
        <div class="stat-card" @click="focusMetric('media')">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-number">{{ mediaItensPorLoja }}</div>
            <div class="stat-label">Média por Loja</div>
          </div>
          <div class="stat-trend">
            <i class="fas fa-arrow-up"></i>
            <span>+8.4%</span>
          </div>
        </div>
        <div class="stat-card" @click="focusMetric('eficiencia')">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <div class="stat-number">{{ eficienciaMedia }}%</div>
            <div class="stat-label">Eficiência Média</div>
          </div>
          <div class="stat-trend">
            <i class="fas fa-arrow-up"></i>
            <span>+3.1%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalLojas: {
    type: Number,
    default: 0
  },
  totalItensAuditados: {
    type: Number,
    default: 0
  },
  mediaItensPorLoja: {
    type: Number,
    default: 0
  },
  eficienciaMedia: {
    type: Number,
    default: 0
  }
})

defineEmits(['focus-metric'])

const focusMetric = (metric) => {
  // Emitir evento para o componente pai
}
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="4"/></g></svg>');
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.gradient-icon {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.hero-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 120px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.stat-trend {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.stat-trend i {
  font-size: 0.7rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1.5rem;
  }

  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 1.5rem;
  }
}
</style>