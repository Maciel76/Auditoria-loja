<template>
  <div class="ranking-colaboradores-container">
    <!-- Header -->
    <div class="ranking-header">
      <div class="header-left">
        <div class="icon-title">
          <div class="icon-area">🏆</div>
          <div class="text-content">
            <div class="titulo">Ranking de Colaboradores</div>
            <div class="descricao">
              Veja quem mais se destacou nas auditorias e métricas de
              performance
            </div>
          </div>
        </div>
      </div>
      <div class="header-controls">
        <select v-model="periodoSelecionado" class="filtro-select">
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="trimestre">Este Trimestre</option>
        </select>
        <select v-model="setorSelecionado" class="filtro-select">
          <option value="todos">Todos os Setores</option>
          <option value="atendimento">Atendimento</option>
          <option value="estoque">Estoque</option>
          <option value="caixa">Caixa</option>
          <option value="limpeza">Limpeza</option>
        </select>
      </div>
    </div>

    <!-- Top 3 Pódio -->
    <div class="podium-section">
      <div class="podium-container">
        <!-- Segundo Lugar -->
        <div class="podium-item segundo">
          <div class="medal-place">🥈</div>
          <div class="colaborador-avatar">
            <div class="avatar-img">👩‍💼</div>
            <div class="ranking-badge">2º</div>
          </div>
          <div class="colaborador-info">
            <span class="colaborador-nome">Carlos Silva</span>
            <span class="colaborador-setor">Atendimento</span>
          </div>
          <div class="colaborador-stats">
            <div class="stat">
              <span class="stat-value">96%</span>
              <span class="stat-label">Conformidade</span>
            </div>
            <div class="stat">
              <span class="stat-value">18</span>
              <span class="stat-label">Auditorias</span>
            </div>
          </div>
          <div class="performance-badge excelente">
            <span>+12%</span>
          </div>
        </div>

        <!-- Primeiro Lugar -->
        <div class="podium-item primeiro">
          <div class="medal-place">🥇</div>
          <div class="colaborador-avatar">
            <div class="avatar-img">👨‍💼</div>
            <div class="ranking-badge">1º</div>
          </div>
          <div class="colaborador-info">
            <span class="colaborador-nome">Maria Santos</span>
            <span class="colaborador-setor">Qualidade</span>
          </div>
          <div class="colaborador-stats">
            <div class="stat">
              <span class="stat-value">98%</span>
              <span class="stat-label">Conformidade</span>
            </div>
            <div class="stat">
              <span class="stat-value">24</span>
              <span class="stat-label">Auditorias</span>
            </div>
          </div>
          <div class="performance-badge destaque">
            <span>+15%</span>
          </div>
          <div class="crown">👑</div>
        </div>

        <!-- Terceiro Lugar -->
        <div class="podium-item terceiro">
          <div class="medal-place">🥉</div>
          <div class="colaborador-avatar">
            <div class="avatar-img">👩‍🔧</div>
            <div class="ranking-badge">3º</div>
          </div>
          <div class="colaborador-info">
            <span class="colaborador-nome">Ana Oliveira</span>
            <span class="colaborador-setor">Estoque</span>
          </div>
          <div class="colaborador-stats">
            <div class="stat">
              <span class="stat-value">94%</span>
              <span class="stat-label">Conformidade</span>
            </div>
            <div class="stat">
              <span class="stat-value">15</span>
              <span class="stat-label">Auditorias</span>
            </div>
          </div>
          <div class="performance-badge excelente">
            <span>+8%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Ranking -->
    <div class="ranking-list-section">
      <div class="ranking-list-header">
        <h3>Classificação Completa</h3>
        <span class="total-colaboradores"
          >{{ colaboradores.length }} colaboradores</span
        >
      </div>

      <div class="ranking-list">
        <div
          v-for="(colaborador, index) in colaboradores"
          :key="colaborador.id"
          class="ranking-item"
          :class="{
            top3: index < 3,
            destacado: colaborador.destaque,
            'melhoria-rapida': colaborador.tendencia === 'alta',
          }"
          @click="abrirDetalhes(colaborador)"
        >
          <div class="ranking-posicao">
            <span class="posicao-numero">{{ index + 1 }}º</span>
            <div class="posicao-trend" :class="colaborador.tendencia">
              {{
                colaborador.tendencia === "alta"
                  ? "↑"
                  : colaborador.tendencia === "baixa"
                  ? "↓"
                  : "→"
              }}
            </div>
          </div>

          <div class="colaborador-main">
            <div class="colaborador-avatar-list">
              <div class="avatar-img">{{ colaborador.avatar }}</div>
              <div
                class="online-indicator"
                :class="{ online: colaborador.online }"
              ></div>
            </div>

            <div class="colaborador-details">
              <div class="colaborador-header">
                <span class="colaborador-nome">{{ colaborador.nome }}</span>
                <span class="colaborador-badges">
                  <span v-if="colaborador.destaque" class="badge destaque"
                    >🌟 Destaque</span
                  >
                  <span v-if="colaborador.metaAtingida" class="badge meta"
                    >🎯 Meta</span
                  >
                  <span v-if="colaborador.novato" class="badge novato"
                    >🆕 Novato</span
                  >
                </span>
              </div>
              <span class="colaborador-setor">{{ colaborador.setor }}</span>
            </div>
          </div>

          <div class="colaborador-metrics">
            <div class="metric">
              <span class="metric-value">{{ colaborador.conformidade }}%</span>
              <span class="metric-label">Conf.</span>
            </div>
            <div class="metric">
              <span class="metric-value">{{ colaborador.auditorias }}</span>
              <span class="metric-label">Audit.</span>
            </div>
            <div class="metric">
              <span class="metric-value">{{ colaborador.pontuacao }}</span>
              <span class="metric-label">Pontos</span>
            </div>
          </div>

          <div class="colaborador-progress">
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :class="colaborador.status"
                  :style="{ width: colaborador.conformidade + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ colaborador.conformidade }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estatísticas do Ranking -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <span class="stat-value">+8.5%</span>
            <span class="stat-label">Crescimento Médio</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Metas Atingidas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚀</div>
          <div class="stat-content">
            <span class="stat-value">5</span>
            <span class="stat-label">Melhoria Rápida</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <span class="stat-value">94.2%</span>
            <span class="stat-label">Média Geral</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div
      v-if="colaboradorSelecionado"
      class="modal-overlay"
      @click="fecharModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-colaborador">
            <div class="modal-avatar">{{ colaboradorSelecionado.avatar }}</div>
            <div class="modal-info">
              <h3>{{ colaboradorSelecionado.nome }}</h3>
              <span class="modal-setor">{{
                colaboradorSelecionado.setor
              }}</span>
            </div>
          </div>
          <button class="fechar-btn" @click="fecharModal">×</button>
        </div>

        <div class="modal-body">
          <div class="metricas-detalhadas">
            <div class="metrica-principal">
              <span class="metrica-valor"
                >{{ colaboradorSelecionado.conformidade }}%</span
              >
              <span class="metrica-label">Taxa de Conformidade</span>
              <div class="metrica-variacao positiva">
                +{{ colaboradorSelecionado.variacao }}%
              </div>
            </div>

            <div class="metricas-secundarias">
              <div class="metrica-sec">
                <span class="sec-valor">{{
                  colaboradorSelecionado.auditorias
                }}</span>
                <span class="sec-label">Auditorias</span>
              </div>
              <div class="metrica-sec">
                <span class="sec-valor">{{
                  colaboradorSelecionado.pontuacao
                }}</span>
                <span class="sec-label">Pontuação</span>
              </div>
              <div class="metrica-sec">
                <span class="sec-valor"
                  >{{ colaboradorSelecionado.ranking }}º</span
                >
                <span class="sec-label">Posição</span>
              </div>
            </div>
          </div>

          <div class="destaques-section">
            <h4>Destaques</h4>
            <div class="destaques-list">
              <div class="destaque-item">
                <span class="destaque-icon">✅</span>
                <span class="destaque-text"
                  >15 auditorias consecutivas sem NCs</span
                >
              </div>
              <div class="destaque-item">
                <span class="destaque-icon">🚀</span>
                <span class="destaque-text"
                  >Maior crescimento do trimestre</span
                >
              </div>
              <div class="destaque-item">
                <span class="destaque-icon">⭐</span>
                <span class="destaque-text">Meta superada em 25%</span>
              </div>
            </div>
          </div>

          <div class="acoes-section">
            <button class="acao-btn primario">🎖️ Reconhecer</button>
            <button class="acao-btn secundario">📊 Ver Detalhes</button>
            <button class="acao-btn neutro">💬 Feedback</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando ranking...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const periodoSelecionado = ref("mes");
const setorSelecionado = ref("todos");
const colaboradorSelecionado = ref(null);
const carregando = ref(true);

const colaboradores = ref([
  {
    id: 1,
    nome: "Maria Santos",
    setor: "Qualidade",
    avatar: "👨‍💼",
    conformidade: 98,
    auditorias: 24,
    pontuacao: 2450,
    ranking: 1,
    tendencia: "alta",
    status: "excelente",
    destaque: true,
    metaAtingida: true,
    online: true,
    variacao: 15,
  },
  {
    id: 2,
    nome: "Carlos Silva",
    setor: "Atendimento",
    avatar: "👩‍💼",
    conformidade: 96,
    auditorias: 18,
    pontuacao: 2320,
    ranking: 2,
    tendencia: "alta",
    status: "excelente",
    destaque: true,
    metaAtingida: true,
    online: false,
    variacao: 12,
  },
  {
    id: 3,
    nome: "Ana Oliveira",
    setor: "Estoque",
    avatar: "👩‍🔧",
    conformidade: 94,
    auditorias: 15,
    pontuacao: 2280,
    ranking: 3,
    tendencia: "alta",
    status: "excelente",
    destaque: false,
    metaAtingida: true,
    online: true,
    variacao: 8,
  },
  {
    id: 4,
    nome: "Pedro Costa",
    setor: "Caixa",
    avatar: "👨‍💻",
    conformidade: 92,
    auditorias: 20,
    pontuacao: 2210,
    ranking: 4,
    tendencia: "neutra",
    status: "bom",
    destaque: false,
    metaAtingida: true,
    online: true,
    variacao: 5,
  },
  {
    id: 5,
    nome: "Juliana Lima",
    setor: "Limpeza",
    avatar: "👩‍🍳",
    conformidade: 90,
    auditorias: 12,
    pontuacao: 2150,
    ranking: 5,
    tendencia: "alta",
    status: "bom",
    destaque: true,
    metaAtingida: false,
    online: false,
    variacao: 10,
  },
  {
    id: 6,
    nome: "Ricardo Alves",
    setor: "Segurança",
    avatar: "👨‍🚒",
    conformidade: 88,
    auditorias: 8,
    pontuacao: 1980,
    ranking: 6,
    tendencia: "baixa",
    status: "bom",
    destaque: false,
    metaAtingida: false,
    online: true,
    variacao: -2,
  },
  {
    id: 7,
    nome: "Fernanda Rocha",
    setor: "Atendimento",
    avatar: "👩‍🎓",
    conformidade: 85,
    auditorias: 14,
    pontuacao: 1850,
    ranking: 7,
    tendencia: "neutra",
    status: "medio",
    destaque: false,
    metaAtingida: false,
    online: true,
    variacao: 3,
  },
  {
    id: 8,
    nome: "Bruno Mendes",
    setor: "Estoque",
    avatar: "👨‍🔬",
    conformidade: 82,
    auditorias: 10,
    pontuacao: 1720,
    ranking: 8,
    tendencia: "alta",
    status: "medio",
    destaque: false,
    metaAtingida: false,
    online: false,
    variacao: 7,
    novato: true,
  },
]);

const abrirDetalhes = (colaborador) => {
  colaboradorSelecionado.value = colaborador;
};

const fecharModal = () => {
  colaboradorSelecionado.value = null;
};

onMounted(() => {
  setTimeout(() => {
    carregando.value = false;
  }, 1500);
});
</script>

<style scoped>
.ranking-colaboradores-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(67, 97, 238, 0.12);
  padding: 2rem;
  margin: 1.5rem auto;
  max-width: 1000px;
  position: relative;
  overflow: hidden;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left {
  flex: 1;
}

.icon-title {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.icon-area {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 0.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.25rem 0;
}

.descricao {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filtro-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filtro-select:hover {
  border-color: #667eea;
}

/* Pódio Section */
.podium-section {
  margin-bottom: 2rem;
}

.podium-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 1.5rem;
  align-items: end;
}

.podium-item {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 3px solid transparent;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.podium-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
}

.podium-item.primeiro {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff9e6, #fff);
  order: 2;
}

.podium-item.segundo {
  border-color: #c0c0c0;
  background: linear-gradient(135deg, #f8f8f8, #fff);
  order: 1;
}

.podium-item.terceiro {
  border-color: #cd7f32;
  background: linear-gradient(135deg, #fdf6e6, #fff);
  order: 3;
}

.medal-place {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.colaborador-avatar {
  position: relative;
  margin: 0 auto 1rem;
  width: 80px;
}

.avatar-img {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.ranking-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.podium-item.primeiro .ranking-badge {
  background: #ffd700;
  color: #000;
}
.podium-item.segundo .ranking-badge {
  background: #c0c0c0;
  color: #000;
}
.podium-item.terceiro .ranking-badge {
  background: #cd7f32;
  color: #fff;
}

.colaborador-info {
  margin-bottom: 1rem;
}

.colaborador-nome {
  display: block;
  font-weight: 700;
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.colaborador-setor {
  font-size: 0.9rem;
  color: #718096;
}

.colaborador-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: 700;
  color: #2d3748;
  font-size: 1.2rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
}

.performance-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.performance-badge.excelente {
  background: #c6f6d5;
  color: #22543d;
}

.performance-badge.destaque {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
}

.crown {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Ranking List */
.ranking-list-section {
  margin-bottom: 2rem;
}

.ranking-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.ranking-list-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.3rem;
  font-weight: 600;
}

.total-colaboradores {
  color: #718096;
  font-weight: 500;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ranking-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #667eea;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ranking-item:hover::before {
  opacity: 1;
}

.ranking-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);
}

.ranking-item.top3 {
  background: linear-gradient(135deg, #f0fff4, #fff);
  border-color: #c6f6d5;
}

.ranking-item.destacado {
  background: linear-gradient(135deg, #fffaf0, #fff);
  border-color: #fef5e7;
}

.ranking-item.melhoria-rapida {
  background: linear-gradient(135deg, #ebf8ff, #fff);
  border-color: #bee3f8;
}

.ranking-posicao {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 50px;
}

.posicao-numero {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
}

.posicao-trend {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.posicao-trend.alta {
  background: #c6f6d5;
  color: #22543d;
}

.posicao-trend.baixa {
  background: #fed7d7;
  color: #c53030;
}

.posicao-trend.neutra {
  background: #e2e8f0;
  color: #4a5568;
}

.colaborador-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.colaborador-avatar-list {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e53e3e;
  border: 2px solid white;
}

.online-indicator.online {
  background: #48bb78;
}

.colaborador-details {
  flex: 1;
}

.colaborador-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.colaborador-nome {
  font-weight: 600;
  color: #2d3748;
}

.colaborador-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.badge.destaque {
  background: #fef5e7;
  color: #dd6b20;
}

.badge.meta {
  background: #c6f6d5;
  color: #22543d;
}

.badge.novato {
  background: #bee3f8;
  color: #1a365d;
}

.colaborador-setor {
  font-size: 0.9rem;
  color: #718096;
}

.colaborador-metrics {
  display: flex;
  gap: 1.5rem;
}

.metric {
  text-align: center;
  min-width: 50px;
}

.metric-value {
  display: block;
  font-weight: 700;
  color: #2d3748;
  font-size: 1.1rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #718096;
}

.colaborador-progress {
  min-width: 120px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.excelente {
  background: #48bb78;
}
.progress-fill.bom {
  background: #4299e1;
}
.progress-fill.medio {
  background: #ed8936;
}
.progress-fill.baixo {
  background: #f56565;
}

.progress-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 35px;
}

/* Stats Section */
.stats-section {
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.modal-colaborador {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-avatar {
  font-size: 3rem;
}

.modal-info h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.modal-setor {
  color: #718096;
  font-size: 1rem;
}

.fechar-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fechar-btn:hover {
  background: #f7fafc;
  color: #4a5568;
}

.metricas-detalhadas {
  margin-bottom: 2rem;
}

.metrica-principal {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.metrica-valor {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.metrica-label {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  display: block;
}

.metrica-variacao {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  display: inline-block;
}

.metrica-variacao.positiva {
  background: rgba(255, 255, 255, 0.2);
}

.metricas-secundarias {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metrica-sec {
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.sec-valor {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.sec-label {
  font-size: 0.8rem;
  color: #718096;
}

.destaques-section {
  margin-bottom: 2rem;
}

.destaques-section h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.destaques-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.destaque-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
}

.destaque-icon {
  font-size: 1.2rem;
}

.destaque-text {
  font-size: 0.9rem;
  color: #4a5568;
}

.acoes-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.acao-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.acao-btn.primario {
  background: #667eea;
  color: white;
}

.acao-btn.primario:hover {
  background: #5a67d8;
}

.acao-btn.secundario {
  background: #e2e8f0;
  color: #4a5568;
}

.acao-btn.secundario:hover {
  background: #cbd5e0;
}

.acao-btn.neutro {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.acao-btn.neutro:hover {
  background: #edf2f7;
}

/* Loading State */
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .ranking-colaboradores-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .ranking-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-controls {
    width: 100%;
    flex-direction: column;
  }

  .podium-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .podium-item {
    order: 0 !important;
  }

  .ranking-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }

  .colaborador-main {
    width: 100%;
  }

  .colaborador-metrics {
    width: 100%;
    justify-content: space-around;
  }

  .colaborador-progress {
    width: 100%;
  }

  .progress-container {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .metricas-secundarias {
    grid-template-columns: 1fr;
  }

  .acoes-section {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>
