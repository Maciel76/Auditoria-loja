<template>
  <div id="app">
    <div class="app-container">
      <!-- Barra Lateral -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>Auditoria Loja</h1>
        </div>
        <nav class="sidebar-nav">
          <router-link to="/" class="nav-item">
            <img src="./assets/svg/upload.svg" alt="Upload" class="nav-icon" />
            <span class="nav-text">Upload</span>
          </router-link>
          <router-link to="/dashboard" class="nav-item">
            <img src="./assets/svg/dash.svg" alt="Dashboard" class="nav-icon" />
            <span class="nav-text">Dashboard</span>
          </router-link>
          <router-link to="/usuarios" class="nav-item">
            <img src="./assets/svg/user.svg" alt="Usuários" class="nav-icon" />
            <span class="nav-text">Usuários</span>
          </router-link>
          <router-link to="/ranking" class="nav-item">
            <img
              src="./assets/svg/ranking.svg"
              alt="Ranking"
              class="nav-icon"
            />
            <span class="nav-text">Ranking</span>
          </router-link>
          <router-link to="/setores" class="nav-item">
            <img
              src="./assets/svg/setores.svg"
              alt="Setores"
              class="nav-icon"
            />
            <span class="nav-text">Setores</span>
          </router-link>
          <router-link to="/lista" class="nav-item">
            <img
              src="./assets/svg/list.svg"
              alt="Lista de Usuários"
              class="nav-icon"
            />
            <span class="nav-text">Lista de Usuários</span>
          </router-link>
          <router-link to="/relatorios" class="nav-item">
            <img
              src="./assets/svg/report.svg"
              alt="Relatórios"
              class="nav-icon"
            />
            <span class="nav-text">Relatórios</span>
          </router-link>
        </nav>
      </aside>

      <!-- Conteúdo Principal -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f8fafc;
}

#app {
  min-height: 100vh;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

/* Barra Lateral */
.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #62809e 0%, #132d47 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
}

.sidebar-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
}

.sidebar-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 0 0.5rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-icon {
  font-size: 1.2rem;
  margin-right: 0.75rem;
  width: 30px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

/* Conteúdo Principal */
.main-content {
  flex: 1;
  margin-left: 250px; /* Largura da sidebar */
  padding: 2rem;
  min-height: 100vh;
}

/* Responsividade */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .menu-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: #2c3e50;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
  }
}

/* Melhorias visuais */
.nav-item {
  position: relative;
}

.nav-item.router-link-active::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: #3498db;
  border-radius: 0 2px 2px 0;
}

/* Animações suaves */
.nav-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar personalizada para sidebar */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
