<template>
  <div class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        <img
          src="../../../assets/svg/icon-ranking/ranking.svg"
          alt="Upload"
          class="nav-icon icon gold"
        />Ranking de Colaboradores - Etiqueta
      </h1>
      <p class="hero-subtitle">
        Reconhecimento aos melhores desempenhos em auditorias
      </p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">{{ usuarios.length }}</span>
          <span class="stat-label">Colaboradores</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ totalItensLidos }}</span>
          <span class="stat-label">Itens Verificados</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ mediaItensPorUsuario }}</span>
          <span class="stat-label">Média por Colaborador</span>
        </div>
      </div>
    </div>
    <div class="hero-decoration">
      <div class="trophy-animation">
        <span class="icon gold"></span>
        <img
          src="../../../assets/svg/icon-ranking/medalsilver.svg"
          alt="Upload"
          class="nav-icon icon gold"
        />
        <span class="icon silver">
          <img
            src="../../../assets/svg/icon-ranking/medalgold.svg"
            alt="Upload"
            class="nav-icon"
          />
        </span>
        <span class="icon bronze">
          <img
            src="../../../assets/svg/icon-ranking/medalbronze.svg"
            alt="Upload"
            class="nav-icon"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroSection",
  props: {
    usuarios: {
      type: Array,
      default: () => [],
    },
    totalItensLidos: {
      type: Number,
      default: 0,
    },
    mediaItensPorUsuario: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.hero-stats {
  display: flex;
  gap: 30px;
}

.stat {
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

.hero-decoration {
  position: relative;
}

.trophy-animation {
  position: relative;
  display: flex;
  gap: 10px;
}
.nav-icon {
  width: 100px;
  height: auto;
}

.trophy-animation .icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

.trophy-animation .gold {
  animation-delay: 0s;
}
.trophy-animation .silver {
  animation-delay: 0.3s;
}
.trophy-animation .bronze {
  animation-delay: 0.6s;
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
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .hero-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
