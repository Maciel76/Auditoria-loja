<template>
  <div class="dashboard-container">
    <DashboardHeader @tab-changed="handleTabChange" @refresh-data="refreshAllData" />
    
    <div class="main-content">
      <div class="content-header">
        <h1>{{ currentTitle }}</h1>
        <div class="header-actions">
          <button class="export-btn" @click="exportData">
            <span class="btn-icon">📊</span>
            Exportar Dados
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Primeira linha: Resumo e Status -->
        <div class="grid-row">
          <div class="grid-col span-6">
            <SummaryPanel 
              :total="summaryData.total" 
              :read="summaryData.read" 
              :unread="summaryData.unread"
              @refresh="refreshSummary"
            />
          </div>
          <div class="grid-col span-6">
            <StatusChart 
              :updated="statusData.updated"
              :outdated="statusData.outdated"
              :unread="statusData.unread"
            />
          </div>
        </div>

        <!-- Segunda linha: Leituras por Categoria e Colaborador -->
        <div class="grid-row">
          <div class="grid-col span-6">
            <CategoryChart :categories="categoryData" @refresh="refreshCategories" />
          </div>
          <div class="grid-col span-6">
            <EmployeeChart :employees="employeeData" />
          </div>
        </div>

        <!-- Terceira linha: Detalhes de Leitura e Custo -->
        <div class="grid-row">
          <div class="grid-col span-6">
            <ReadingDetails :last-reading="lastReadingTime" @refresh="refreshReadingDetails" />
          </div>
          <div class="grid-col span-6">
            <CostPanel cost="25,16 Mi" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardHeader from "./contente/DashboadHeader.vue";
import SummaryPanel from "./contente/SummaryPanel.vue";
import StatusChart from "./contente/StatusChart.vue";
import CategoryChart from "./contente/CategoryChart.vue";
import EmployeeChart from "./contente/EmployeeChart.vue";
import ReadingDetails from "./contente/ReadingDetails.vue";
import CostPanel from "./contente/CostPanel.vue";

export default {
  name: "ConsolidatedDashboard",
  components: {
    DashboardHeader,
    SummaryPanel,
    StatusChart,
    CategoryChart,
    EmployeeChart,
    ReadingDetails,
    CostPanel
  },
  data() {
    return {
      activeTab: "etiqueta",
      summaryData: {
        total: 10000,
        read: 9299,
        unread: 701
      },
      statusData: {
        updated: 6500,
        outdated: 2500,
        unread: 1000
      },
      categoryData: [
        { name: "Eletrônicos", value: 2450, color: "#4361ee" },
        { name: "Roupas", value: 1890, color: "#3a0ca3" },
        { name: "Alimentos", value: 1560, color: "#f72585" },
        { name: "Livros", value: 1320, color: "#4cc9f0" },
        { name: "Esportes", value: 980, color: "#fca311" },
        { name: "Casa", value: 760, color: "#e63946" },
        { name: "Beleza", value: 620, color: "#7209b7" },
        { name: "Brinquedos", value: 450, color: "#4895ef" }
      ],
      employeeData: [
        { name: "João Silva", value: 1250 },
        { name: "Maria Santos", value: 1120 },
        { name: "Pedro Costa", value: 980 },
        { name: "Ana Oliveira", value: 875 },
        { name: "Carlos Pereira", value: 760 },
        { name: "Juliana Almeida", value: 680 },
        { name: "Fernando Lima", value: 620 },
        { name: "Patrícia Rodrigues", value: 580 },
        { name: "Ricardo Nunes", value: 520 },
        { name: "Amanda Ferreira", value: 480 }
      ],
      lastReadingTime: "14:30"
    };
  },
  computed: {
    currentTitle() {
      const titles = {
        etiqueta: "Auditoria de Etiqueta",
        presenca: "Auditoria de Presença",
        ruptura: "Auditoria de Ruptura",
      };
      return titles[this.activeTab];
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab;
      // Aqui você pode carregar dados específicos para cada aba
      this.refreshAllData();
    },
    refreshAllData() {
      this.refreshSummary();
      this.refreshCategories();
      this.refreshReadingDetails();
      
      // Simular atualização de dados
      this.lastReadingTime = new Date().toLocaleTimeString("pt-BR");
    },
    refreshSummary() {
      console.log("Atualizando dados do resumo...");
      // Simular uma pequena variação nos dados
      this.summaryData.read += Math.floor(Math.random() * 50);
      this.summaryData.unread = this.summaryData.total - this.summaryData.read;
    },
    refreshCategories() {
      console.log("Atualizando categorias...");
      // Simular atualização de dados de categoria
      this.categoryData.forEach(item => {
        item.value += Math.floor(Math.random() * 20);
      });
    },
    refreshReadingDetails() {
      console.log("Atualizando detalhes de leitura...");
    },
    exportData() {
      console.log("Exportando dados do dashboard...");
      // Lógica para exportar dados
    }
  }
};
</script>

<style>
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f7f9;
}

.main-content {
  padding: 24px;
}

.content-header {
  display: flex;
  
  align-items: center;
  margin-bottom: 24px;
}

.content-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
  font-weight: 600;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #3a0ca3;
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
  flex: 0 0 calc(50% - 12px);
}

/* Responsividade */
@media (max-width: 1200px) {
  .grid-row {
    flex-direction: column;
  }
  
  .grid-col.span-6 {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>