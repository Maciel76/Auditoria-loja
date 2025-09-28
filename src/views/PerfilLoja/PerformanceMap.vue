<template>
  <div class="performance-map-container">
    <!-- Header -->
    <div class="map-header">
      <div class="header-left">
        <div class="icon-title">
          <div class="icon-area">🗺️</div>
          <div class="text-content">
            <div class="titulo">Mapa de Performance</div>
            <div class="descricao">
              Visualize o desempenho das áreas da loja de forma geográfica
            </div>
          </div>
        </div>
      </div>
      <div class="header-controls">
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'setorial' }"
            @click="visualizacaoAtiva = 'setorial'"
          >
            📊 Setorial
          </button>
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'geografica' }"
            @click="visualizacaoAtiva = 'geografica'"
          >
            🗺️ Geográfica
          </button>
        </div>
        <select v-model="metricaSelecionada" class="filtro-select">
          <option value="conformidade">Conformidade</option>
          <option value="vendas">Vendas</option>
          <option value="atendimento">Atendimento</option>
          <option value="estoque">Estoque</option>
        </select>
      </div>
    </div>

    <!-- Mapa Setorial -->
    <div v-if="visualizacaoAtiva === 'setorial'" class="mapa-setorial">
      <div class="setores-grid">
        <div
          v-for="setor in setores"
          :key="setor.id"
          class="setor-card"
          :class="[
            setor.status,
            { selecionado: setorSelecionado?.id === setor.id },
          ]"
          @click="selecionarSetor(setor)"
        >
          <div class="setor-header">
            <span class="setor-icon">{{ setor.icone }}</span>
            <span class="setor-nome">{{ setor.nome }}</span>
            <span class="setor-score">{{ setor.pontuacao }}%</span>
          </div>
          <div class="setor-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: setor.pontuacao + '%' }"
              ></div>
            </div>
          </div>
          <div class="setor-stats">
            <div class="stat">
              <span class="stat-value">{{ setor.auditorias }}</span>
              <span class="stat-label">Auditorias</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ setor.nc }}</span>
              <span class="stat-label">NCs</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapa Geográfico -->
    <div v-else class="mapa-geografico">
      <div class="layout-loja">
        <!-- Layout simulado da loja -->
        <div class="area entrada" :class="getAreaClass('entrada')">
          <div class="area-content">
            <span class="area-icon">🚪</span>
            <span class="area-name">Entrada</span>
            <span class="area-score">98%</span>
          </div>
        </div>

        <div class="area caixas" :class="getAreaClass('caixas')">
          <div class="area-content">
            <span class="area-icon">💸</span>
            <span class="area-name">Caixas</span>
            <span class="area-score">92%</span>
          </div>
        </div>

        <div class="area atendimento" :class="getAreaClass('atendimento')">
          <div class="area-content">
            <span class="area-icon">👥</span>
            <span class="area-name">Atendimento</span>
            <span class="area-score">95%</span>
          </div>
        </div>

        <div class="area eletronicos" :class="getAreaClass('eletronicos')">
          <div class="area-content">
            <span class="area-icon">📱</span>
            <span class="area-name">Eletrônicos</span>
            <span class="area-score">88%</span>
          </div>
        </div>

        <div class="area vestuario" :class="getAreaClass('vestuario')">
          <div class="area-content">
            <span class="area-icon">👕</span>
            <span class="area-name">Vestuário</span>
            <span class="area-score">85%</span>
          </div>
        </div>

        <div class="area alimentos" :class="getAreaClass('alimentos')">
          <div class="area-content">
            <span class="area-icon">🍎</span>
            <span class="area-name">Alimentos</span>
            <span class="area-score">78%</span>
          </div>
        </div>

        <div class="area estoque" :class="getAreaClass('estoque')">
          <div class="area-content">
            <span class="area-icon">📦</span>
            <span class="area-name">Estoque</span>
            <span class="area-score">82%</span>
          </div>
        </div>

        <div class="area limpeza" :class="getAreaClass('limpeza')">
          <div class="area-content">
            <span class="area-icon">🧹</span>
            <span class="area-name">Limpeza</span>
            <span class="area-score">100%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Legenda -->
    <div class="legenda">
      <div class="legenda-title">Legenda de Performance</div>
      <div class="legenda-items">
        <div class="legenda-item">
          <div class="legenda-color excelente"></div>
          <span>Excelente (90-100%)</span>
        </div>
        <div class="legenda-item">
          <div class="legenda-color bom"></div>
          <span>Bom (80-89%)</span>
        </div>
        <div class="legenda-item">
          <div class="legenda-color medio"></div>
          <span>Médio (70-79%)</span>
        </div>
        <div class="legenda-item">
          <div class="legenda-color baixo"></div>
          <span>Baixo (&lt;70%)</span>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Setor -->
    <div v-if="setorSelecionado" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ setorSelecionado.nome }}</h3>
          <button class="fechar-btn" @click="fecharModal">×</button>
        </div>
        <div class="modal-body">
          <div class="metricas-detalhadas">
            <div class="metrica-principal">
              <span class="metrica-valor"
                >{{ setorSelecionado.pontuacao }}%</span
              >
              <span class="metrica-label">Pontuação Geral</span>
            </div>
            <div class="metricas-secundarias">
              <div class="metrica-sec">
                <span class="sec-valor">{{ setorSelecionado.auditorias }}</span>
                <span class="sec-label">Auditorias</span>
              </div>
              <div class="metrica-sec">
                <span class="sec-valor">{{ setorSelecionado.nc }}</span>
                <span class="sec-label">Não Conformidades</span>
              </div>
              <div class="metrica-sec">
                <span class="sec-valor">{{
                  setorSelecionado.tendencia === "positiva" ? "↑" : "↓"
                }}</span>
                <span class="sec-label">Tendência</span>
              </div>
            </div>
          </div>
          <div class="acoes-rapidas">
            <button class="acao-btn">📋 Nova Auditoria</button>
            <button class="acao-btn">📊 Ver Relatório</button>
            <button class="acao-btn">🔍 Detalhes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando mapa de performance...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const visualizacaoAtiva = ref("setorial");
const metricaSelecionada = ref("conformidade");
const setorSelecionado = ref(null);
const carregando = ref(true);

const setores = ref([
  {
    id: 1,
    nome: "Entrada",
    icone: "🚪",
    pontuacao: 98,
    auditorias: 5,
    nc: 1,
    status: "excelente",
    tendencia: "positiva",
  },
  {
    id: 2,
    nome: "Caixas",
    icone: "💸",
    pontuacao: 92,
    auditorias: 8,
    nc: 3,
    status: "excelente",
    tendencia: "positiva",
  },
  {
    id: 3,
    nome: "Atendimento",
    icone: "👥",
    pontuacao: 95,
    auditorias: 6,
    nc: 2,
    status: "excelente",
    tendencia: "positiva",
  },
  {
    id: 4,
    nome: "Eletrônicos",
    icone: "📱",
    pontuacao: 88,
    auditorias: 4,
    nc: 4,
    status: "bom",
    tendencia: "positiva",
  },
  {
    id: 5,
    nome: "Vestuário",
    icone: "👕",
    pontuacao: 85,
    auditorias: 7,
    nc: 6,
    status: "bom",
    tendencia: "neutra",
  },
  {
    id: 6,
    nome: "Alimentos",
    icone: "🍎",
    pontuacao: 78,
    auditorias: 5,
    nc: 8,
    status: "medio",
    tendencia: "negativa",
  },
  {
    id: 7,
    nome: "Estoque",
    icone: "📦",
    pontuacao: 82,
    auditorias: 3,
    nc: 5,
    status: "bom",
    tendencia: "positiva",
  },
  {
    id: 8,
    nome: "Limpeza",
    icone: "🧹",
    pontuacao: 100,
    auditorias: 4,
    nc: 0,
    status: "excelente",
    tendencia: "positiva",
  },
]);

const selecionarSetor = (setor) => {
  setorSelecionado.value = setor;
};

const fecharModal = () => {
  setorSelecionado.value = null;
};

const getAreaClass = (area) => {
  const areaData = setores.value.find((s) => s.nome.toLowerCase() === area);
  return areaData ? areaData.status : "medio";
};

onMounted(() => {
  // Simular carregamento de dados
  setTimeout(() => {
    carregando.value = false;
  }, 1500);
});
</script>

<style scoped>
.performance-map-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(67, 97, 238, 0.12);
  padding: 2rem;
  margin: 1.5rem auto;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.map-header {
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

.view-toggle {
  display: flex;
  background: #f7fafc;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid #e2e8f0;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #667eea;
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

/* Mapa Setorial */
.mapa-setorial {
  margin-bottom: 2rem;
}

.setores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.setor-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.setor-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.setor-card.excelente::before {
  background: linear-gradient(90deg, #48bb78, #68d391);
}
.setor-card.bom::before {
  background: linear-gradient(90deg, #4299e1, #63b3ed);
}
.setor-card.medio::before {
  background: linear-gradient(90deg, #ed8936, #f6ad55);
}
.setor-card.baixo::before {
  background: linear-gradient(90deg, #f56565, #fc8181);
}

.setor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
}

.setor-card.selecionado {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.2);
}

.setor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.setor-icon {
  font-size: 2rem;
}

.setor-nome {
  font-weight: 600;
  color: #2d3748;
  flex: 1;
  margin-left: 0.75rem;
}

.setor-score {
  font-size: 1.5rem;
  font-weight: 700;
}

.setor-card.excelente .setor-score {
  color: #48bb78;
}
.setor-card.bom .setor-score {
  color: #4299e1;
}
.setor-card.medio .setor-score {
  color: #ed8936;
}
.setor-card.baixo .setor-score {
  color: #f56565;
}

.setor-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

.setor-card.excelente .progress-fill {
  background: linear-gradient(90deg, #48bb78, #68d391);
}
.setor-card.bom .progress-fill {
  background: linear-gradient(90deg, #4299e1, #63b3ed);
}
.setor-card.medio .progress-fill {
  background: linear-gradient(90deg, #ed8936, #f6ad55);
}
.setor-card.baixo .progress-fill {
  background: linear-gradient(90deg, #f56565, #fc8181);
}

.setor-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
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

/* Mapa Geográfico */
.mapa-geografico {
  margin-bottom: 2rem;
}

.layout-loja {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 150px 150px 150px;
  gap: 1rem;
  height: 500px;
}

.area {
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.area:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.area-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.area-icon {
  font-size: 2rem;
}

.area-name {
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.area-score {
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Posicionamento e cores das áreas */
.entrada {
  grid-column: 1;
  grid-row: 1;
  background: linear-gradient(135deg, #48bb78, #38a169);
}
.caixas {
  grid-column: 2 / 4;
  grid-row: 1;
  background: linear-gradient(135deg, #4299e1, #3182ce);
}
.atendimento {
  grid-column: 1;
  grid-row: 2;
  background: linear-gradient(135deg, #48bb78, #38a169);
}
.eletronicos {
  grid-column: 2;
  grid-row: 2;
  background: linear-gradient(135deg, #4299e1, #3182ce);
}
.vestuario {
  grid-column: 3;
  grid-row: 2;
  background: linear-gradient(135deg, #4299e1, #3182ce);
}
.alimentos {
  grid-column: 1 / 3;
  grid-row: 3;
  background: linear-gradient(135deg, #ed8936, #dd6b20);
}
.estoque {
  grid-column: 3;
  grid-row: 3;
  background: linear-gradient(135deg, #4299e1, #3182ce);
}
.limpeza {
  grid-column: 1;
  grid-row: 3;
  background: linear-gradient(135deg, #48bb78, #38a169);
}

/* Override colors based on performance */
.area.excelente {
  background: linear-gradient(135deg, #48bb78, #38a169);
}
.area.bom {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}
.area.medio {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
}
.area.baixo {
  background: linear-gradient(135deg, #f56565, #e53e3e);
}

/* Legenda */
.legenda {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.legenda-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
}

.legenda-items {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legenda-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legenda-color.excelente {
  background: #48bb78;
}
.legenda-color.bom {
  background: #4299e1;
}
.legenda-color.medio {
  background: #ed8936;
}
.legenda-color.baixo {
  background: #f56565;
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
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metrica-principal {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
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

.acoes-rapidas {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.acao-btn {
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.acao-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
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
  .performance-map-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .map-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-controls {
    width: 100%;
    flex-direction: column;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    text-align: center;
  }

  .setores-grid {
    grid-template-columns: 1fr;
  }

  .layout-loja {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 100px);
    height: auto;
  }

  .area {
    grid-column: 1 !important;
    grid-row: auto !important;
  }

  .legenda-items {
    flex-direction: column;
    gap: 1rem;
  }

  .metricas-secundarias {
    grid-template-columns: 1fr;
  }

  .acoes-rapidas {
    flex-direction: column;
  }
}
</style>
