<template>
  <div class="hero-section">
    <div class="hero-cover">
      <div class="cover-pattern"></div>
      <div class="hero-medals">
        <div class="medal silver floating">
          <img
            src="../../assets/svg/icon-ranking/medalsilver.svg"
            alt="Prata"
            class="medal-icon"
          />
        </div>
        <div class="medal gold floating">
          <img
            src="../../assets/svg/icon-ranking/medalgold.svg"
            alt="Ouro"
            class="medal-icon"
          />
        </div>
        <div class="medal bronze floating">
          <img
            src="../../assets/svg/icon-ranking/medalbronze.svg"
            alt="Bronze"
            class="medal-icon"
          />
        </div>
      </div>
    </div>

    <div class="hero-info">
      <div class="hero-avatar-container">
        <div class="hero-avatar">
          <div class="avatar-icon">
            <img
              src="../../assets/svg/icon-ranking/rankingstore.png"
              alt="Ranking Store"
              class="ranking-icon"
            />
          </div>
        </div>
      </div>

      <div class="hero-details">
        <div class="hero-header">
          <h1 class="hero-title">Ranking das Lojas</h1>
        </div>
        <p class="hero-subtitle">
          <i class="fas fa-trophy"></i>
          Compare a performance entre todas as lojas da rede em tempo real
        </p>
      </div>

      <div class="hero-stats">
        <div class="stat-item lojas" @click="focusMetric('lojas')">
          <span class="stat-number">{{ totalLojas }}</span>
          <span class="stat-label">Lojas Ativas</span>
        </div>
        <div class="stat-item itens" @click="focusMetric('itens')">
          <span class="stat-number">{{
            totalItensAuditados.toLocaleString()
          }}</span>
          <span class="stat-label">Itens Auditados</span>
        </div>
        <div class="stat-item media" @click="focusMetric('media')">
          <span class="stat-number">{{ mediaItensPorLoja }}</span>
          <span class="stat-label">Média por Loja</span>
        </div>
        <div class="stat-item eficiencia" @click="focusMetric('eficiencia')">
          <span class="stat-number">{{ eficienciaMedia }}%</span>
          <span class="stat-label">Eficiência Média</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalLojas: {
    type: Number,
    default: 0,
  },
  totalItensAuditados: {
    type: Number,
    default: 0,
  },
  mediaItensPorLoja: {
    type: Number,
    default: 0,
  },
  eficienciaMedia: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["focus-metric"]);

const focusMetric = (metric) => {
  emit("focus-metric", metric);
};
</script>

<style scoped>
/* Estilo baseado no padrão dos ranking de colaboradores */
.hero-section {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
  font-family: "Inter", sans-serif;
}

.hero-cover {
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 2rem;
}

.cover-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="5" fill="rgba(255,255,255,0.1)"/></svg>');
}

.hero-medals {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  gap: 15px;
  align-items: center;
  z-index: 10;
}

.medal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.medal-icon {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.floating {
  animation: float 3s ease-in-out infinite;
}

.silver.floating {
  animation-delay: 0s;
}

.gold.floating {
  animation-delay: 0.3s;
}

.bronze.floating {
  animation-delay: 0.6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.hero-info {
  padding: 0 30px 30px;
  margin-top: -40px;
  display: flex;
  align-items: flex-end;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.hero-avatar-container {
  position: relative;
}

.hero-avatar {
  position: relative;
}

.avatar-icon {
  width: 160px;
  height: 160px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.avatar-icon:hover {
  transform: scale(1.05);
}

.ranking-icon {
  width: 120px;
  height: 100px;
  object-fit: contain;
}

.hero-details {
  flex: 1;
  min-width: 300px;
}

.hero-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.hero-title {
  font-size: 2.5rem;
  margin: 0;
  margin-top: -20px;
  font-weight: 800;
  position: relative;
  z-index: 10;
  background: linear-gradient(90deg, #667eea 10%, #764ba2 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  border-radius: 8px;
  padding: 2px 12px 2px 6px;
  box-shadow: 0 2px 12px 0 rgba(102, 126, 234, 0.1), 0 1.5px 0 #fff;
  transition: color 0.2s;
}

.hero-subtitle {
  color: #7f8c8d;
  margin-bottom: 8px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-stats {
  display: flex;
  gap: 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 15px;
  min-width: 500px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.stat-item {
  text-align: center;
  align-items: center;
  flex: 1;
  padding: 4px 0;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

/* Cores específicas para cada estatística */
.stat-item.lojas .stat-number {
  color: #10b981;
}

.stat-item.itens .stat-number {
  color: #f59e0b;
}

.stat-item.media .stat-number {
  color: #3b82f6;
}

.stat-item.eficiencia .stat-number {
  color: #8b5cf6;
}

/* Responsividade */
@media (max-width: 968px) {
  .hero-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 25px;
  }

  .hero-header {
    justify-content: center;
  }

  .hero-details {
    text-align: center;
  }

  .hero-subtitle {
    justify-content: center;
  }

  .hero-stats {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-cover {
    height: 140px;
  }

  .hero-info {
    padding: 0 20px 25px;
    margin-top: -30px;
  }

  .avatar-icon {
    width: 120px;
    height: 120px;
  }

  .ranking-icon {
    width: 80px;
    height: 70px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .hero-medals {
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    gap: 10px;
  }

  .medal-icon {
    width: 65px;
    height: 65px;
  }
}

@media (max-width: 480px) {
  .hero-header {
    flex-direction: column;
    gap: 10px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 14px;
    padding: 15px;
    min-width: auto;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .stat-number {
    font-size: 1.5rem;
    margin-bottom: 0;
  }

  .avatar-icon {
    width: 1100px;
    height: 110px;
  }

  .ranking-icon {
    width: 65px;
    height: 55px;
  }

  .hero-medals {
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    gap: 8px;
  }

  .medal-icon {
    width: 50px;
    height: 50px;
  }
}
</style>
