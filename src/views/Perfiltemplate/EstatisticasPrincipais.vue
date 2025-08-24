<template>
  <div class="estatisticas-section">
    <h2 class="section-title">📈 Estatísticas de Desempenho</h2>

    <div class="stats-grid">
      <!-- Progresso Geral -->
      <div class="stat-card main">
        <div class="card-header">
          <h3>📊 Progresso de Auditoria</h3>
          <div class="info-tooltip">
            <span class="icon">ℹ️</span>
            <div class="tooltip-text">
              Acompanhe seu progresso em relação à meta de 500 itens
            </div>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-circle">
            <div class="circle-bg"></div>
            <div class="circle-progress" :style="progressStyle"></div>
            <div class="circle-text">
              <span class="percent">{{ percentualConcluido }}%</span>
              <span class="label">Concluído</span>
            </div>
          </div>
        </div>
        <div class="progress-details">
          <div class="detail-item">
            <div class="detail-icon">📦</div>
            <div class="detail-content">
              <span class="value">{{ usuario.contador }}/500</span>
              <span class="label">Meta de Itens</span>
            </div>
          </div>
          <div class="detail-item">
            <div
              class="detail-icon"
              :class="
                diferencaMedia > 0
                  ? 'positive'
                  : diferencaMedia < 0
                  ? 'negative'
                  : 'neutral'
              "
            >
              {{ diferencaMedia > 0 ? "📈" : diferencaMedia < 0 ? "📉" : "📊" }}
            </div>
            <div class="detail-content">
              <span
                class="value"
                :class="{
                  positive: diferencaMedia > 0,
                  negative: diferencaMedia < 0,
                }"
              >
                {{ diferencaMedia > 0 ? "+" : "" }}{{ diferencaMedia }}
              </span>
              <span class="label">vs Média Geral</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparação com Média -->
      <div class="stat-card">
        <div class="card-header">
          <h3>⚡ Desempenho</h3>
          <div class="info-tooltip">
            <span class="icon">ℹ️</span>
            <div class="tooltip-text">
              Compare seu desempenho com a média da equipe
            </div>
          </div>
        </div>
        <div class="comparacao-chart">
          <div class="bar-container">
            <div class="bar-label">
              <span class="user-dot"></span>
              Sua média
            </div>
            <div class="bar">
              <div
                class="bar-fill usuario"
                :style="{ width: calcularLarguraBarra(usuario.contador) }"
              ></div>
              <span class="bar-value">{{ usuario.contador }} itens</span>
            </div>
          </div>
          <div class="bar-container">
            <div class="bar-label">
              <span class="avg-dot"></span>
              Média geral
            </div>
            <div class="bar">
              <div
                class="bar-fill media"
                :style="{ width: calcularLarguraBarra(mediaGeral) }"
              ></div>
              <span class="bar-value">{{ mediaGeral }} itens</span>
            </div>
          </div>
        </div>
        <div
          class="comparacao-texto"
          :class="{
            positive: diferencaMedia > 0,
            negative: diferencaMedia < 0,
            neutral: diferencaMedia === 0,
          }"
        >
          <p v-if="diferencaMedia > 0">
            🎉 Excelente! Você está
            <strong>{{ diferencaMedia }} itens</strong> acima da média!
          </p>
          <p v-else-if="diferencaMedia < 0">
            📉 Você está
            <strong>{{ Math.abs(diferencaMedia) }} itens</strong> abaixo da
            média.
            <span class="motivation">Continue assim!</span>
          </p>
          <p v-else>
            📊 Você está exatamente na média geral.
            <span class="motivation"
              >Um pouco mais de esforço para se destacar!</span
            >
          </p>
        </div>
      </div>

      <!-- Distribuição por Corredor -->
      <div class="stat-card">
        <div class="card-header">
          <h3>🗺️ Distribuição por Corredor</h3>
          <div class="info-tooltip">
            <span class="icon">ℹ️</span>
            <div class="tooltip-text">
              Visualize a distribuição dos itens auditados por corredor
            </div>
          </div>
        </div>
        <div class="corredores-list">
          <div
            v-for="corredor in corredoresComContagem"
            :key="corredor.nome"
            class="corredor-item"
          >
            <span class="corredor-nome">{{ corredor.nome }}</span>
            <span class="corredor-contagem">{{ corredor.contagem }} itens</span>
            <div class="corredor-bar">
              <div
                class="corredor-progress"
                :style="{ width: corredor.percentual + '%' }"
              ></div>
            </div>
            <span class="corredor-percent">{{ corredor.percentual }}%</span>
          </div>
        </div>
        <div class="corredores-total">
          <span
            >Total: {{ usuario.contador }} itens em
            {{ corredoresComContagem.length }} corredores</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EstatisticasPrincipais",
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    mediaGeral: {
      type: Number,
      default: 0,
    },
    diferencaMedia: {
      type: Number,
      default: 0,
    },
    percentualConcluido: {
      type: Number,
      default: 0,
    },
    corredoresComContagem: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    progressStyle() {
      return {
        "--progress": `${this.percentualConcluido}%`,
      };
    },
  },
  methods: {
    calcularLarguraBarra(valor) {
      const maxValor = Math.max(this.usuario.contador, this.mediaGeral, 1);
      return `${(valor / maxValor) * 100}%`;
    },
  },
};
</script>

<style scoped>
.estatisticas-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f3f5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.stat-card.main {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
}

.info-tooltip {
  position: relative;
  cursor: pointer;
}

.info-tooltip .icon {
  font-size: 1.1rem;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.info-tooltip:hover .icon {
  opacity: 1;
}

.tooltip-text {
  position: absolute;
  top: 100%;
  right: 0;
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 100;
}

.info-tooltip:hover .tooltip-text {
  opacity: 1;
  visibility: visible;
  transform: translateY(5px);
}

.progress-container {
  display: flex;
  justify-content: center;
}

.progress-circle {
  position: relative;
  width: 160px;
  height: 160px;
}

.circle-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f8f9fa;
  box-shadow: inset 0 0 0 1px #e9ecef;
}

.circle-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#51cf66 var(--progress), #e9ecef 0);
  mask: radial-gradient(white 55%, transparent 60%);
  -webkit-mask: radial-gradient(white 55%, transparent 60%);
  transition: background 1s ease;
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.circle-text .percent {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2c3e50;
  display: block;
  background: linear-gradient(135deg, #2c3e50 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.circle-text .label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.detail-item:hover {
  background: #e9ecef;
}

.detail-icon {
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.detail-icon.positive {
  background: linear-gradient(135deg, #40c057 0%, #82c91e 100%);
  color: white;
}

.detail-icon.negative {
  background: linear-gradient(135deg, #fa5252 0%, #ff6b6b 100%);
  color: white;
}

.detail-icon.neutral {
  background: linear-gradient(135deg, #868e96 0%, #adb5bd 100%);
  color: white;
}

.detail-content {
  flex: 1;
}

.detail-content .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: block;
}

.detail-content .value.positive {
  color: #40c057;
}

.detail-content .value.negative {
  color: #fa5252;
}

.detail-content .label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.comparacao-chart {
  margin-bottom: 20px;
}

.bar-container {
  margin-bottom: 20px;
}

.bar-label {
  font-size: 0.9rem;
  color: #5a6c7d;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.user-dot,
.avg-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.user-dot {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avg-dot {
  background: #adb5bd;
}

.bar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-fill {
  height: 24px;
  border-radius: 12px;
  transition: width 1s ease;
  position: relative;
  overflow: hidden;
}

.bar-fill.usuario {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.bar-fill.media {
  background: linear-gradient(135deg, #868e96 0%, #adb5bd 100%);
  box-shadow: 0 4px 12px rgba(134, 142, 150, 0.3);
}

.bar-value {
  font-weight: 600;
  color: #2c3e50;
  min-width: 80px;
  text-align: right;
}

.comparacao-texto {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid #adb5bd;
}

.comparacao-texto.positive {
  background: linear-gradient(135deg, #f8f9fa 0%, #f8fff9 100%);
  border-left-color: #51cf66;
}

.comparacao-texto.negative {
  background: linear-gradient(135deg, #f8f9fa 0%, #fff9f9 100%);
  border-left-color: #ff6b6b;
}

.comparacao-texto.neutral {
  background: linear-gradient(135deg, #f8f9fa 0%, #f8f9ff 100%);
  border-left-color: #667eea;
}

.comparacao-texto p {
  margin: 0;
  font-size: 1rem;
  color: #5a6c7d;
}

.comparacao-texto strong {
  color: #2c3e50;
}

.motivation {
  display: block;
  margin-top: 5px;
  font-size: 0.9rem;
  color: #868e96;
  font-style: italic;
}

.corredores-list {
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 15px;
  padding-right: 5px;
}

.corredores-list::-webkit-scrollbar {
  width: 6px;
}

.corredores-list::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 3px;
}

.corredores-list::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 3px;
}

.corredores-list::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

.corredor-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 15px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
}

.corredor-item:last-child {
  border-bottom: none;
}

.corredor-nome {
  font-weight: 500;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.corredor-contagem {
  font-size: 0.9rem;
  color: #5a6c7d;
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}

.corredor-bar {
  width: 80px;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.corredor-progress {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 1s ease;
  position: relative;
}

.corredor-percent {
  font-size: 0.8rem;
  color: #868e96;
  min-width: 40px;
  text-align: right;
}

.corredores-total {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #5a6c7d;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stat-card.main {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .corredor-item {
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  .corredor-percent {
    display: none;
  }

  .progress-circle {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .progress-details {
    gap: 15px;
  }

  .detail-item {
    padding: 12px;
  }

  .detail-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .detail-content .value {
    font-size: 1.3rem;
  }
}
</style>
