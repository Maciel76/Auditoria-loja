<template>
  <div class="full-ranking-section">
    <h2 class="section-title">
      {{ viewMode === "podium" ? "Demais Colaboradores" : "Ranking Completo" }}
    </h2>

    <div class="ranking-list">
      <div
        v-for="(usuario, index) in usuariosFiltradosOrdenados"
        :key="usuario.id"
        :class="[
          'ranking-item',
          getRankingClass(viewMode === 'podium' ? index + 3 : index),
        ]"
      >
        <div class="rank-number">
          <span class="normal-rank"
            >{{ viewMode === "podium" ? index + 4 : index + 1 }}º</span
          >
        </div>

        <div class="user-info">
          <div class="user-avatar">
            <img v-if="usuario.foto" :src="usuario.foto" :alt="usuario.nome" />
            <div v-else class="avatar-placeholder">
              {{ usuario.iniciais }}
            </div>
          </div>
          <div class="user-details">
            <h3 class="user-name">{{ usuario.nome }}</h3>
            <p class="user-id">Matrícula: {{ usuario.id }}</p>
          </div>
        </div>

        <div class="score-container">
          <div class="score-bar">
            <div
              class="score-progress"
              :style="{ width: calcularProgresso(usuario.contador) + '%' }"
            ></div>
          </div>
          <div class="score-value">{{ usuario.contador }} itens</div>
        </div>

        <div
          class="ranking-badge"
          :class="getBadgeClass(viewMode === 'podium' ? index + 3 : index)"
        >
          <span
            :class="getBadgeIcon(viewMode === 'podium' ? index + 3 : index)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RankingList",
  props: {
    usuariosFiltradosOrdenados: {
      type: Array,
      default: () => [],
    },
    viewMode: {
      type: String,
      default: "podium",
    },
    usuariosOrdenados: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    calcularProgresso(itens) {
      const maxItens = this.usuariosOrdenados[0]?.contador || 1;
      return (itens / maxItens) * 100;
    },
    getRankingClass(index) {
      if (index === 0) return "first-place";
      if (index === 1) return "second-place";
      if (index === 2) return "third-place";
      if (index < 10) return "top-ten";
      return "";
    },
    getBadgeClass(index) {
      if (index === 0) return "gold-badge";
      if (index === 1) return "silver-badge";
      if (index === 2) return "bronze-badge";
      if (index < 10) return "top-ten-badge";
      return "normal-badge";
    },
    getBadgeIcon(index) {
      if (index === 0) return 'icon">👑';
      if (index === 1) return 'icon">🥈';
      if (index === 2) return 'icon">🥉';
      if (index < 10) return 'icon">⭐';
      return 'icon">👤';
    },
  },
};
</script>

<style scoped>
.full-ranking-section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 600;
}

.ranking-list {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.3s ease;
}

.ranking-item:hover {
  background-color: #f8f9fa;
}

.ranking-item.first-place {
  background: linear-gradient(135deg, #fff9db 0%, #ffec99 100%);
}

.ranking-item.second-place {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.ranking-item.third-place {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.ranking-item.top-ten {
  background-color: #f8f9fa;
}

.rank-number {
  width: 60px;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.normal-rank {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 15px;
}

.user-details {
  flex: 1;
}

.user-info .user-avatar {
  margin: 0;
}

.user-info .user-avatar img {
  width: 50px;
  height: 50px;
  border: 2px solid white;
}

.user-info .avatar-placeholder {
  width: 50px;
  height: 50px;
  font-size: 1rem;
  border: 2px solid white;
}

.score-container {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  max-width: 300px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.score-progress {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 1s ease;
}

.score-value {
  font-weight: 600;
  color: #2c3e50;
  min-width: 80px;
  text-align: right;
}

.ranking-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.gold-badge {
  background: #fff9db;
}
.silver-badge {
  background: #f8f9fa;
}
.bronze-badge {
  background: #fff3e0;
}
.top-ten-badge {
  background: #e7f5ff;
}
.normal-badge {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .ranking-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .score-container {
    max-width: none;
  }
}
</style>
