<template>
  <div class="ranking-premium-container">
    <!-- Header Hero -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="icon">🏆</span> Ranking de Colaboradores
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
          <span class="icon gold ajuste-ico">👑</span>
          <span class="icon silver ajuste-ico">🥈</span>
          <span class="icon bronze ajuste-ico">🥉</span>
        </div>
      </div>
    </div>

    <!-- Filtros e Controles -->
    <div class="ranking-controls">
      <div class="search-container">
        <span class="icon">🔍</span>
        <input
          v-model="filtro"
          type="text"
          placeholder="Buscar colaborador..."
          class="search-input"
        />
      </div>
      <div class="view-options">
        <button
          @click="viewMode = 'podium'"
          :class="['view-btn', { active: viewMode === 'podium' }]"
        >
          <span class="icon">🏅</span> Pódio
        </button>
        <button
          @click="viewMode = 'all'"
          :class="['view-btn', { active: viewMode === 'all' }]"
        >
          <span class="icon">📋</span> Todos
        </button>
      </div>
    </div>

    <!-- Pódio - Top 3 -->
    <div
      v-if="viewMode === 'podium' && usuariosOrdenados.length >= 3"
      class="podium-section"
    >
      <h2 class="section-title">Top Performers</h2>
      <div class="podium-container">
        <!-- Segundo lugar -->
        <div class="podium-item silver-medal">
          <div class="podium-position">2º</div>
          <div class="podium-content">
            <div class="medal-icon">
              <span class="icon">🥈</span>
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
              <span class="icon">👑</span>
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
              <span class="icon">🏆</span>
              {{ usuariosOrdenados[0].contador }} itens
            </div>
          </div>
        </div>

        <!-- Terceiro lugar -->
        <div class="podium-item bronze-medal">
          <div class="podium-position">3º</div>
          <div class="podium-content">
            <div class="medal-icon">
              <span class="icon">🥉</span>
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

    <!-- Lista Completa de Ranking -->
    <div class="full-ranking-section">
      <h2 class="section-title">
        {{
          viewMode === "podium" ? "Demais Colaboradores" : "Ranking Completo"
        }}
      </h2>

      <div class="ranking-list">
        <div
          v-for="(usuario, index) in usuariosFiltradosOrdenados"
          :key="usuario.id"
          :class="['ranking-item', getRankingClass(index)]"
        >
          <div class="rank-number">
            <span v-if="index < 3" class="medal-rank">{{ index + 1 }}º</span>
            <span v-else class="normal-rank">{{ index + 1 }}º</span>
          </div>

          <div class="user-info">
            <div class="user-avatar">
              <img
                v-if="usuario.foto"
                :src="usuario.foto"
                :alt="usuario.nome"
              />
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

          <div class="ranking-badge" :class="getBadgeClass(index)">
            <span :class="getBadgeIcon(index)"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estatísticas Avançadas -->
    <div class="advanced-stats">
      <h2 class="section-title">Estatísticas Detalhadas</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="icon">👔</span>
          </div>
          <h3>Top Performer</h3>
          <p class="stat-value">{{ topPerformer.nome }}</p>
          <p class="stat-label">
            {{ topPerformer.contador }} itens verificados
          </p>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="icon">⚡</span>
          </div>
          <h3>Maior Média</h3>
          <p class="stat-value">{{ mediaItensPorUsuario }} itens/colaborador</p>
          <p class="stat-label">Desempenho médio da equipe</p>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="icon">🎯</span>
          </div>
          <h3>Meta Coletiva</h3>
          <p class="stat-value">{{ totalItensLidos }} itens</p>
          <p class="stat-label">Total verificado pelo time</p>
        </div>
      </div>
    </div>

    <!-- Botão de Exportar -->
    <div class="export-section">
      <button @click="exportarRanking" class="export-btn">
        <span class="icon">📤</span> Exportar Ranking
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const usuarios = ref([]);
const filtro = ref("");
const viewMode = ref("podium");

// Carregar usuários do localStorage
onMounted(() => {
  carregarUsuarios();
});

const carregarUsuarios = () => {
  const usuariosSalvos = localStorage.getItem("usuariosAuditoria");
  if (usuariosSalvos) {
    usuarios.value = JSON.parse(usuariosSalvos);
  }
};

// Ordenar usuários por itens lidos (decrescente)
const usuariosOrdenados = computed(() => {
  return [...usuarios.value].sort((a, b) => b.contador - a.contador);
});

// Filtrar e ordenar usuários para a lista
const usuariosFiltradosOrdenados = computed(() => {
  let filtered = usuariosOrdenados.value;

  if (filtro.value) {
    const searchTerm = filtro.value.toLowerCase();
    filtered = filtered.filter(
      (usuario) =>
        usuario.nome.toLowerCase().includes(searchTerm) ||
        usuario.id.toLowerCase().includes(searchTerm)
    );
  }

  if (viewMode.value === "podium") {
    return filtered.slice(3);
  }

  return filtered;
});

// Estatísticas
const totalItensLidos = computed(() => {
  return usuarios.value.reduce((total, usuario) => total + usuario.contador, 0);
});

const mediaItensPorUsuario = computed(() => {
  return usuarios.value.length
    ? Math.round(totalItensLidos.value / usuarios.value.length)
    : 0;
});

const topPerformer = computed(() => {
  return usuariosOrdenados.value[0] || { nome: "N/A", contador: 0 };
});

// Funções auxiliares
const calcularProgresso = (itens) => {
  const maxItens = usuariosOrdenados.value[0]?.contador || 1;
  return (itens / maxItens) * 100;
};

const getRankingClass = (index) => {
  if (index === 0) return "first-place";
  if (index === 1) return "second-place";
  if (index === 2) return "third-place";
  if (index < 10) return "top-ten";
  return "";
};

const getBadgeClass = (index) => {
  if (index === 0) return "gold-badge";
  if (index === 1) return "silver-badge";
  if (index === 2) return "bronze-badge";
  if (index < 10) return "top-ten-badge";
  return "normal-badge";
};

const getBadgeIcon = (index) => {
  if (index === 0) return 'icon">👑';
  if (index === 1) return 'icon">🥈';
  if (index === 2) return 'icon">🥉';
  if (index < 10) return 'icon">⭐';
  return 'icon">👤';
};

const exportarRanking = () => {
  const rankingData = usuariosOrdenados.value.map((user, index) => ({
    Posição: `${index + 1}º`,
    Nome: user.nome,
    Matrícula: user.id,
    "Itens Verificados": user.contador,
  }));

  const csvContent = [
    "Posição,Nome,Matrícula,Itens Verificados",
    ...rankingData.map(
      (item) =>
        `"${item.Posição}","${item.Nome}","${item.Matrícula}",${item["Itens Verificados"]}`
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", "ranking_colaboradores.csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.ranking-premium-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* Hero Section */
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
  animation: float 3s ease-in-out infinite;
}

.trophy-animation .icon {
  font-size: 3rem;
  margin: 0 5px;
  animation: shine 2s ease-in-out infinite;
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

/* Controls */
.ranking-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-container .icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Podium */
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
  font-size: 3rem;
  margin-bottom: 15px;
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
  display: inline-block;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.gold {
  background: #fff9db;
  color: #e67700;
}
.silver {
  background: #f8f9fa;
  color: #495057;
}
.bronze {
  background: #fff3e0;
  color: #f76707;
}

/* Ranking List */
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

.medal-rank {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 40px;
  text-align: center;
}

.first-place .medal-rank {
  background: #ffd700;
  color: white;
}
.second-place .medal-rank {
  background: #c0c0c0;
  color: white;
}
.third-place .medal-rank {
  background: #cd7f32;
  color: white;
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

.ajuste-ico {
  background-color: transparent;
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

/* Advanced Stats */
.advanced-stats {
  margin: 40px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 15px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 10px 0;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Export Section */
.export-section {
  text-align: center;
  margin: 40px 0;
}

.export-btn {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.export-btn:hover {
  transform: translateY(-2px);
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shine {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive */
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

  .podium-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .gold-medal {
    transform: none;
    order: -1;
  }

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

  .ranking-controls {
    flex-direction: column;
  }

  .search-container {
    min-width: 100%;
  }
}

.icon {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
