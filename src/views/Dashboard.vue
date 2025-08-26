<template>
  <div>
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title">
          <div class="navigation-menu">
            <router-link
              to="/dashboard/views"
              :class="['nav-btn', { active: activeTab === 'dashboard' }]"
              @click="setActiveTab('dashboard')"
            >
              <img src="../assets/svg/home.svg" alt="Home" class="icon-home" />
            </router-link>
            <router-link
              to="/dashboard/etiqueta"
              :class="['nav-btn', { active: activeTab === 'etiqueta' }]"
              @click="setActiveTab('etiqueta')"
            >
              Etiqueta
            </router-link>
            <router-link
              to="/dashboard/presenca"
              :class="['nav-btn', { active: activeTab === 'presenca' }]"
              @click="setActiveTab('presenca')"
            >
              Presença
            </router-link>
            <router-link
              to="/dashboard/ruptura"
              :class="['nav-btn', { active: activeTab === 'ruptura' }]"
              @click="setActiveTab('ruptura')"
            >
              Ruptura
            </router-link>
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
  </div>
</template>

<script>
export default {
  name: "DashboardHeader",
  data() {
    return {
      activeTab: "dashboard",
      currentTime: new Date().toLocaleString("pt-BR"),
    };
  },
  computed: {
    activeTitle() {
      const titles = {
        dashboard: "Dashboard Completa",
        etiqueta: "Auditoria de Etiqueta",
        presenca: "Auditoria de Presença",
        ruptura: "Auditoria de Ruptura",
      };
      return titles[this.activeTab] || "Dashboard";
    },
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      console.log("Tab ativa:", tab); // Para debug
    },
    refreshData() {
      this.currentTime = new Date().toLocaleString("pt-BR");
      this.$emit("refresh-data");
    },
    updateActiveTabFromRoute() {
      const path = this.$route.path;
      console.log("Rota atual:", path); // Para debug

      if (path.includes("/etiqueta")) {
        this.activeTab = "etiqueta";
      } else if (path.includes("/presenca")) {
        this.activeTab = "presenca";
      } else if (path.includes("/ruptura")) {
        this.activeTab = "ruptura";
      } else if (path.includes("/dashboard/views") || path === "/dashboard") {
        this.activeTab = "dashboard";
      }

      console.log("Tab definida:", this.activeTab); // Para debug
    },
  },
  watch: {
    // Observa mudanças na rota
    $route() {
      this.updateActiveTabFromRoute();
    },
  },
  mounted() {
    // Define a aba ativa baseado na rota atual ao carregar
    this.updateActiveTabFromRoute();
  },
};
</script>

<style scoped>
/* Seus estilos permanecem os mesmos */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.navigation-menu {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  color: white;
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.icon-home {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  transition: filter 0.3s ease;
}

.nav-btn.active .icon-home {
  filter: brightness(0) invert(0);
}

.header-title h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-icon {
  font-size: 20px;
}

.update-details {
  display: flex;
  flex-direction: column;
}

.update-label {
  font-size: 0.8rem;
  opacity: 0.9;
  font-weight: 500;
}

.update-time {
  font-size: 1rem;
  font-weight: 600;
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

/* Responsividade */
@media (max-width: 900px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-info {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .dashboard-header {
    padding: 20px;
  }

  .header-title h1 {
    font-size: 1.5rem;
  }

  .refresh-btn {
    padding: 8px 16px;
  }

  .refresh-text {
    display: none;
  }
}

@media (max-width: 400px) {
  .navigation-menu {
    flex-direction: column;
  }

  .header-title {
    flex-direction: column;
    gap: 8px;
  }

  .last-update {
    flex-direction: column;
    text-align: center;
    gap: 4px;
  }
}
</style>
