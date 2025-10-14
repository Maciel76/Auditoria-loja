<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-text">
        <h1>
          Transforme auditorias em
          <span class="highlight">colaboração inteligente</span>
        </h1>
        <p class="hero-subtitle">
          Sistema de auditoria colaborativa onde sua voz faz a diferença
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">+230</span>
            <span class="stat-label">auditorias concluídas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">+45</span>
            <span class="stat-label">usuários ativos esta semana</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">+89</span>
            <span class="stat-label">melhorias implementadas</span>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn-primary" @click="$emit('start-audit')">
            <i class="fas fa-search"></i>
            🔍 Começar Auditoria
          </button>
          <button class="btn-secondary" @click="$emit('open-suggestion')">
            <i class="fas fa-lightbulb"></i>
            💡 Enviar Sugestão
          </button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="floating-card card-1">
          <i class="fas fa-chart-line"></i>
          <span>Performance +34%</span>
        </div>
        <div class="floating-card card-2">
          <i class="fas fa-users"></i>
          <span>Equipe Conectada</span>
        </div>
        <div class="floating-card card-3">
          <i class="fas fa-trophy"></i>
          <span>Top Colaborador</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(["start-audit", "open-suggestion"]);
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.highlight {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #fbbf24;
  color: #1a202c;
}

.btn-primary:hover {
  background: #f59e0b;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hero-visual {
  position: relative;
  height: 300px;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  animation: float 3s ease-in-out infinite;
}

.card-1 {
  top: 20px;
  left: 0;
  animation-delay: 0s;
}

.card-2 {
  top: 100px;
  right: 0;
  animation-delay: 1s;
}

.card-3 {
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }
}
</style>
