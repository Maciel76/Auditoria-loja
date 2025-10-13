<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Dashboard - Auditoria de Etiquetas</h1>
          <p>Visão geral das auditorias e estatísticas</p>
        </div>
        <div class="header-actions">
          <button class="refresh-btn" @click="refreshAllData">
            <span class="refresh-icon">🔄</span>
            <span class="refresh-text">Atualizar</span>
          </button>
        </div>
      </div>
    </div>

    <div class="conteudor-principal">
      <div class="dashboard-grid">
        <!-- Primeira linha: Resumo e Status -->
        <div class="grid-row">
          <div class="grid-col span-6">
            <ConteudoTeste
              :total="summaryData.total"
              :read="summaryData.read"
              :unread="summaryData.unread"
              @refresh="refreshSummary"
            />
          </div>
          <div class="grid-col span-6">
            <ConteudoTeste1
              :updated="statusData.updated"
              :outdated="statusData.outdated"
              :unread="statusData.unread"
            />
          </div>
        </div>

        <!-- Segunda linha: Colaboradores -->
        <div class="grid-row">
          <div class="grid-col span-12">
            <ConteudoTeste2 />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConteudoTeste1 from "../Conteudo/ConteudoTeste1.vue";
import ConteudoTeste from "../Conteudo/ConteudoTeste.vue";
import ConteudoTeste2 from "../Conteudo/ConteudoTeste2.vue";

export default {
  name: "DashboardViews",
  components: {
    ConteudoTeste,
    ConteudoTeste1,
    ConteudoTeste2,
  },
  data() {
    return {
      summaryData: {
        total: 10000,
        read: 9299,
        unread: 701,
      },
      statusData: {
        updated: 6500,
        outdated: 2500,
        unread: 1000,
      },
      lastReadingTime: new Date().toLocaleTimeString("pt-BR"),
    };
  },
  methods: {
    refreshAllData() {
      this.refreshSummary();
      this.lastReadingTime = new Date().toLocaleTimeString("pt-BR");
    },
    refreshSummary() {
      console.log("Atualizando dados do resumo...");
      // Simular uma pequena variação nos dados sem crescimento infinito
      const baseRead = 9299;
      const variation = Math.floor(Math.random() * 100) - 50; // -50 a +50
      this.summaryData.read = Math.max(0, baseRead + variation);
      this.summaryData.unread = this.summaryData.total - this.summaryData.read;
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  margin: auto;
  min-height: 100vh;
  background-color: #efeff0;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 100%;
}

.header-title h1 {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-title p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.refresh-icon {
  transition: transform 0.3s ease;
}

.refresh-btn:hover .refresh-icon {
  transform: rotate(180deg);
}

.conteudor-principal {
  padding: 0 24px 24px;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.grid-row {
  display: flex;
  gap: 24px;
}

.grid-col {
  flex: 1;
}

.grid-col.span-6 {
  flex: 1;
}

.grid-col.span-12 {
  flex: 1;
}

/* Responsividade */
@media (max-width: 1200px) {
  .grid-row {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .conteudor-principal {
    padding: 0 16px 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .dashboard-header {
    padding: 20px;
  }
}
</style>
