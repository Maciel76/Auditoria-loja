<template>
  <div class="perfil-header">
    <div class="header-content">
      <div class="loja-image-container">
        <img
          :src="loja.imagem"
          :alt="loja.nome"
          class="loja-image"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <span class="loja-codigo-badge">#{{ loja.codigo }}</span>
        </div>
      </div>

      <div class="loja-info">
        <h1 class="loja-nome">{{ loja.nome }}</h1>
        <p class="loja-localizacao">
          <i class="fas fa-map-marker-alt"></i>
          {{ loja.cidade }} • {{ loja.endereco }}
        </p>

        <div class="loja-detalhes">
          <div class="detalhe-item">
            <i class="fas fa-phone"></i>
            <span>{{ loja.telefone }}</span>
          </div>
          <div class="detalhe-item">
            <i class="fas fa-clock"></i>
            <span>{{ loja.horarioFuncionamento }}</span>
          </div>
          <div class="detalhe-item">
            <i class="fas fa-calendar-alt"></i>
            <span>Desde {{ formatarData(loja.dataInauguracao) }}</span>
          </div>
        </div>
      </div>

      <div class="performance-indicator">
        <div class="performance-circle">
          <div class="circle-progress" :style="progressStyle">
            <span class="performance-value">{{ percentualDesempenho }}%</span>
          </div>
          <div class="performance-label">Desempenho</div>
        </div>
      </div>
    </div>

    <div class="header-actions">
      <button class="action-btn primary">
        <i class="fas fa-sync-alt"></i>
        Atualizar Dados
      </button>
      <button class="action-btn secondary">
        <i class="fas fa-cog"></i>
        Configurações
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loja: Object,
    metricas: Object,
    percentualDesempenho: Number,
  },
  computed: {
    progressStyle() {
      return {
        "--progress": `${this.percentualDesempenho}%`,
        "--progress-color": this.getProgressColor(this.percentualDesempenho),
      };
    },
  },
  methods: {
    handleImageError(event) {
      event.target.src = "/images/lojas/default.jpg";
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString("pt-BR");
    },
    getProgressColor(percentual) {
      if (percentual >= 90) return "#4CAF50";
      if (percentual >= 70) return "#FF9800";
      return "#F44336";
    },
  },
};
</script>

<style scoped>
.perfil-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 30px;
  align-items: center;
  margin-bottom: 20px;
}

.loja-image-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.loja-image {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.image-overlay {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff6b6b;
  border-radius: 15px;
  padding: 5px 10px;
  font-weight: bold;
  font-size: 0.8rem;
}

.loja-info {
  text-align: left;
}

.loja-nome {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.loja-localizacao {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 15px;
}

.loja-detalhes {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.detalhe-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.8;
}

.performance-indicator {
  display: flex;
  justify-content: center;
}

.performance-circle {
  text-align: center;
}

.circle-progress {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(
    var(--progress-color) var(--progress),
    rgba(255, 255, 255, 0.2) 0
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
}

.circle-progress::before {
  content: "";
  position: absolute;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.performance-value {
  position: relative;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 1;
}

.performance-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.action-btn.primary {
  background: rgba(255, 255, 255, 0.2);
}

.action-btn.primary:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .header-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 20px;
  }

  .loja-image-container {
    margin: 0 auto;
  }

  .loja-detalhes {
    justify-content: center;
  }

  .header-actions {
    flex-direction: column;
  }
}
</style>
