<template>
  <div class="app-container">
    <!-- Botão para abrir/fechar menu em dispositivos móveis -->
    <button class="menu-toggle" @click="toggleMenu">
      <i class="fas" :class="menuOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>

    <!-- Menu lateral -->
    <nav class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <div class="sidebar-header">
        <h2>Menu Principal</h2>
      </div>

      <ul class="sidebar-menu">
        <li class="menu-item">
          <router-link to="/">
            <i class="fas fa-upload"></i>
            <span>Upload</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/usuarios">
            <i class="fas fa-users"></i>
            <span>Usuários</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/hanking">
            <i class="fas fa-trophy"></i>
            <span>Hanking</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/setores">
            <i class="fas fa-building"></i>
            <span>Setores</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/lista">
            <i class="fas fa-list"></i>
            <span>Lista de Usuários</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/relatorios">
            <i class="fas fa-file-alt"></i>
            <span>Relatórios</span>
          </router-link>
        </li>
      </ul>

      <div class="sidebar-footer">
        <p>Versão 1.0</p>
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <main class="main-content" :class="{ 'content-shifted': menuOpen }">
      <div class="content-header">
        <h1>{{ selectedItem ? selectedItem.title : "Bem-vindo" }}</h1>
      </div>

      <div class="content-body">
        <p v-if="selectedItem">{{ selectedItem.content }}</p>
        <p v-else>Selecione uma opção do menu para ver o conteúdo.</p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "MenuLateral",
  data() {
    return {
      menuOpen: false,
      selectedItem: null,
      menuItems: [
        {
          title: "Dashboard",
          icon: "fa-tachometer-alt",
          content:
            "Conteúdo do Dashboard: estatísticas e métricas importantes do sistema.",
        },
        {
          title: "Clientes",
          icon: "fa-users",
          content:
            "Conteúdo de Clientes: lista de clientes e informações de contato.",
        },
        {
          title: "Produtos",
          icon: "fa-box",
          content:
            "Conteúdo de Produtos: catálogo de produtos e informações de estoque.",
        },
        {
          title: "Pedidos",
          icon: "fa-shopping-cart",
          content:
            "Conteúdo de Pedidos: histórico e status de pedidos realizados.",
        },
        {
          title: "Relatórios",
          icon: "fa-chart-bar",
          content:
            "Conteúdo de Relatórios: relatórios analíticos e financeiros.",
        },
        {
          title: "Configurações",
          icon: "fa-cog",
          content:
            "Conteúdo de Configurações: opções de personalização do sistema.",
        },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    selectItem(item) {
      this.selectedItem = item;
      // Em dispositivos móveis, fecha o menu após selecionar um item
      if (window.innerWidth < 768) {
        this.menuOpen = false;
      }
    },
  },
};
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* Menu lateral */
.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #2c3e50, #1a2530);
  color: white;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 500;
}

.sidebar-menu {
  list-style: none;
  padding: 10px 0;
}

.menu-item a {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #e0e0e0;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.menu-item a:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border-left: 4px solid #3498db;
}

.menu-item a.active {
  background-color: rgba(52, 152, 219, 0.2);
  color: white;
  border-left: 4px solid #3498db;
}

.menu-item i {
  margin-right: 15px;
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  color: #aaa;
}

/* Conteúdo principal */
.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.content-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.content-header h1 {
  color: #2c3e50;
  font-weight: 500;
}

.content-body {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.content-body p {
  line-height: 1.6;
  color: #555;
}

/* Botão de toggle para mobile */
.menu-toggle {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .content-shifted {
    margin-left: 0;
  }

  .menu-toggle {
    display: block;
  }
}
</style>
