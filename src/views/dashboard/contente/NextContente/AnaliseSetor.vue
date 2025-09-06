<template>
  <div class="analise-setor">
    <div class="analise-header">
      <h2>Análise por Setor</h2>
      <div class="header-controls">
        <div class="date-filter">
          <label for="date-range">Período:</label>
          <select id="date-range" v-model="selectedPeriod" @change="updateData">
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
          </select>
        </div>
        <button class="export-btn" @click="exportData">
          <span class="btn-icon">📊</span>
          Exportar
        </button>
      </div>
    </div>

    <div class="analise-content">
      <CategoryChart :categories="sectorData" @refresh="refreshData" />
    </div>

    <div class="analise-footer">
      <div class="data-info">
        <span class="info-icon">ℹ️</span>
        <span>Dados atualizados em tempo real do sistema de auditoria</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnaliseSetor",
  components: {},
  data() {
    return {
      selectedPeriod: "today",
      sectorData: [
        { name: "Liquida", value: 2450, color: "#4361ee" },
        { name: "Alto Giro", value: 1890, color: "#3a0ca3" },
        { name: "Bazar", value: 1560, color: "#f72585" },
        { name: "Seca Doce", value: 1320, color: "#4cc9f0" },
        { name: "Perecível", value: 980, color: "#fca311" },
        { name: "Seca Salgado", value: 760, color: "#e63946" },
        { name: "Dhp", value: 620, color: "#7209b7" },
        { name: "FLV", value: 450, color: "#4895ef" },
        { name: "Laticínios", value: 350, color: "#f0a500" },
        { name: "Diversos", value: 280, color: "#218f13" },
      ],
    };
  },
  methods: {
    refreshData() {
      console.log("Atualizando dados do setor...");
      // Simular atualização de dados
      this.sectorData.forEach((item) => {
        const variation = Math.floor(Math.random() * 40) - 20; // Variação entre -20 e +20
        item.value = Math.max(100, item.value + variation); // Garantir valor mínimo de 100
      });
    },
    updateData() {
      console.log(`Período selecionado: ${this.selectedPeriod}`);
      // Aqui você implementaria a lógica para buscar dados do período selecionado
      this.refreshData();
    },
    exportData() {
      console.log("Exportando dados da análise por setor...");
      const csvContent = this.sectorData
        .map((item) => `${item.name},${item.value}`)
        .join("\n");

      const blob = new Blob([`Setor,Leituras\n${csvContent}`], {
        type: "text/csv",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "analise-setor.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    },
  },
  mounted() {
    console.log("Componente AnaliseSetor montado");
  },
};
</script>

<style>
.analise-setor {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.analise-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #4c6ef5, #3b5bdb);
  color: white;
}

.analise-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-filter label {
  font-weight: 500;
  font-size: 0.9rem;
}

.date-filter select {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
}

.date-filter select option {
  color: #333;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.analise-content {
  flex: 1;
  padding: 0;
}

.analise-footer {
  padding: 16px 24px;
  border-top: 1px solid #eaeaea;
  background: #f8f9fa;
}

.data-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6c757d;
}

/* Responsividade */
@media (max-width: 768px) {
  .analise-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-controls {
    flex-direction: column;
    width: 100%;
  }

  .date-filter {
    width: 100%;
    justify-content: center;
  }

  .export-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
