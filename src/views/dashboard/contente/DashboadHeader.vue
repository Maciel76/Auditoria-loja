<template>
  <div class="dashboard-header">
    <div class="header-content">
      <div class="header-title">
        <div class="navigation-menu">
          <button
            :class="['nav-btn', { active: activeTab === 'etiqueta' }]"
            @click="setActiveTab('etiqueta')"
          >
            Etiqueta
          </button>
          <button
            :class="['nav-btn', { active: activeTab === 'presenca' }]"
            @click="setActiveTab('presenca')"
          >
            Presença
          </button>
          <button
            :class="['nav-btn', { active: activeTab === 'ruptura' }]"
            @click="setActiveTab('ruptura')"
          >
            Ruptura
          </button>
        </div>
        <h1>{{ activeTitle }}</h1>
      </div>
      <div class="header-info">
        <div class="last-update">
          <span class="update-icon">⏰</span>
          <div class="update-details">
            <span class="update-label">Última atualização</span>
            <span class="update-time">{{ currentTime }}</span>
          </div>
        </div>
        <button class="refresh-btn" @click="refreshData">
          <span class="refresh-icon">🔄</span>
          <span class="refresh-text">Atualizar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuditoriaHeader",
  data() {
    return {
      activeTab: "etiqueta",
      currentTime: new Date().toLocaleString("pt-BR"),
    };
  },
  computed: {
    activeTitle() {
      const titles = {
        etiqueta: "Auditoria de Etiqueta",
        presenca: "Auditoria de Presença",
        ruptura: "Auditoria de Ruptura",
      };
      return titles[this.activeTab];
    },
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      // Emitir evento para que o componente pai saiba que a aba mudou
      this.$emit("tab-changed", tab);
    },
    refreshData() {
      this.currentTime = new Date().toLocaleString("pt-BR");
      this.$emit("refresh-data");
    },
  },
};
</script>

<style scoped>
.dashboard-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 16px; /* Reduzir padding */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.navigation-menu {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background-color: #e9ecef;
}

.nav-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 8px;
}

.update-details {
  display: flex;
  flex-direction: column;
}

.update-label {
  font-size: 0.75rem;
  color: #666;
}

.update-time {
  font-size: 0.875rem;
  font-weight: 500;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.refresh-btn:hover {
  background-color: #e9ecef;
}
</style>
