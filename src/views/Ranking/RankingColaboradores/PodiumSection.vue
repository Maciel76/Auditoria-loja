<template>
  <div class="podium-section">
    <h2 class="section-title">Top Performers</h2>
    <div class="podium-container">
      <!-- Segundo lugar -->
      <div class="podium-item silver-medal">
        <div class="podium-position">2º</div>
        <div class="podium-content">
          <div class="medal-icon">
            <img
              src="../../../assets/svg/icon-ranking/medalsilver.svg"
              alt="Medalha de Prata"
              class="nav-icon floating-animation"
            />
          </div>
          <div class="user-avatar">
            <img
              v-if="usuariosOrdenados[1].foto"
              :src="usuariosOrdenados[1].foto"
              :alt="usuariosOrdenados[1].nome"
            />
            <div v-else class="avatar-placeholder">
              {{ usuariosOrdenados[1].iniciais }}
            </div>
          </div>
          <h3 class="user-name">{{ usuariosOrdenados[1].nome }}</h3>
          <p class="user-id">Matrícula: {{ usuariosOrdenados[1].id }}</p>
          <div class="score-badge silver">
            <span class="icon">📊</span>
            {{ usuariosOrdenados[1].contador }} itens
          </div>
        </div>
      </div>

      <!-- Primeiro lugar -->
      <div class="podium-item gold-medal">
        <div class="podium-position">1º</div>
        <div class="podium-content">
          <div class="crown-icon">
            <img
              src="../../../assets/svg/icon-ranking/coroa.svg"
              alt="Coroa"
              class="nav-icon floating-animation"
            />
          </div>
          <div class="user-avatar">
            <img
              v-if="usuariosOrdenados[0].foto"
              :src="usuariosOrdenados[0].foto"
              :alt="usuariosOrdenados[0].nome"
            />
            <div v-else class="avatar-placeholder">
              {{ usuariosOrdenados[0].iniciais }}
            </div>
          </div>
          <h3 class="user-name">{{ usuariosOrdenados[0].nome }}</h3>
          <p class="user-id">Matrícula: {{ usuariosOrdenados[0].id }}</p>
          <div class="score-badge gold">
            <img
              src="../../../assets/svg/icon-ranking/medalgold.svg"
              alt="Troféu"
              class="nav-icon-small"
            />
            {{ usuariosOrdenados[0].contador }} itens
          </div>
        </div>
      </div>

      <!-- Terceiro lugar -->
      <div class="podium-item bronze-medal">
        <div class="podium-position">3º</div>
        <div class="podium-content">
          <div class="medal-icon">
            <img
              src="../../../assets/svg/icon-ranking/medalbronze.svg"
              alt="Medalha de Bronze"
              class="nav-icon floating-animation"
            />
          </div>
          <div class="user-avatar">
            <img
              v-if="usuariosOrdenados[2].foto"
              :src="usuariosOrdenados[2].foto"
              :alt="usuariosOrdenados[2].nome"
            />
            <div v-else class="avatar-placeholder">
              {{ usuariosOrdenados[2].iniciais }}
            </div>
          </div>
          <h3 class="user-name">{{ usuariosOrdenados[2].nome }}</h3>
          <p class="user-id">Matrícula: {{ usuariosOrdenados[2].id }}</p>
          <div class="score-badge bronze">
            <span class="icon">📊</span>
            {{ usuariosOrdenados[2].contador }} itens
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PodiumSection",
  props: {
    usuariosOrdenados: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.podium-section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 600;
}

.podium-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.podium-item {
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: transform 0.3s ease;
}

.podium-item:hover {
  transform: translateY(-5px);
}

.gold-medal {
  transform: scale(1.05);
  background: linear-gradient(135deg, #fff9db 0%, #ffec99 100%);
  border: 3px solid #ffd43b;
}

.silver-medal {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 3px solid #ced4da;
}

.bronze-medal {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 3px solid #ffb74d;
}

.podium-position {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.medal-icon,
.crown-icon {
  margin-bottom: 10px;
  margin-left: -15px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-icon {
  width: 70px;
  height: auto;
  margin-left: 13px;
}

.nav-icon-small {
  width: 24px;
  height: 24px;
  margin-right: 5px;
  vertical-align: middle;
}

.floating-animation {
  animation: float 3s ease-in-out infinite;
}

.gold-medal .floating-animation {
  animation-delay: 0s;
}

.silver-medal .floating-animation {
  animation-delay: 0.3s;
}

.bronze-medal .floating-animation {
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

.user-avatar {
  margin: 15px auto;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0 auto;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-size: 1.2rem;
  margin: 10px 0 5px;
  color: #2c3e50;
  font-weight: 600;
}

.user-id {
  color: #7f8c8d;
  margin-bottom: 15px;
}

.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.score-badge.gold {
  background: #fff9db;
  color: #e67700;
}
.score-badge.silver {
  background: #f8f9fa;
  color: #495057;
}
.score-badge.bronze {
  background: #fff3e0;
  color: #f76707;
}

@media (max-width: 768px) {
  .podium-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .gold-medal {
    transform: none;
    order: -1;
  }
}
</style>
