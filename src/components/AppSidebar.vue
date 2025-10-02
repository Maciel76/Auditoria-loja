<!-- components/AppSidebar.vue -->
<template>
  <div id="sidebar-container">
    <!-- Menu Hamburger para Mobile -->
    <button
      class="menu-toggle"
      @click="toggleMobileSidebar"
      :class="{ active: sidebarOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="app-container">
      <!-- Overlay para Mobile -->
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="closeMobileSidebar"
      ></div>

      <!-- Barra Lateral -->
      <aside
        class="sidebar"
        :class="{ open: sidebarOpen, collapsed: sidebarCollapsed }"
      >
        <div class="sidebar-header">
          <div class="header-pattern"></div>
          <div class="header-content">
            <h1 v-if="!sidebarCollapsed">
              Auditoria {{ lojaStore.codigoLojaAtual }}
            </h1>
            <h1 v-else class="collapsed-title">
              {{ lojaStore.codigoLojaAtual }}
            </h1>

            <!-- Botão para trocar loja - apenas quando expandida -->
            <button
              v-if="!sidebarCollapsed"
              @click="mostrarTrocaLoja = !mostrarTrocaLoja"
              class="btn-trocar-loja"
              title="Trocar loja"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12h18m-9-9l9 9-9 9"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>

          <!-- Botão de Toggle da Sidebar -->
          <button
            class="sidebar-toggle-btn"
            @click="toggleSidebarCollapse"
            :class="{ collapsed: sidebarCollapsed }"
            title="Expandir/Colapsar Menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 5l5 5-5 5"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- Dropdown para trocar loja -->
          <div
            v-if="mostrarTrocaLoja && !sidebarCollapsed"
            class="dropdown-trocar-loja"
          >
            <div class="dropdown-header">
              <span>Trocar Loja</span>
              <button @click="mostrarTrocaLoja = false" class="btn-fechar">
                ×
              </button>
            </div>
            <div class="dropdown-list">
              <div
                v-for="loja in lojaStore.lojas"
                :key="loja.codigo"
                class="dropdown-item-loja"
                :class="{
                  active: loja.codigo === lojaStore.codigoLojaAtual,
                  loading: lojaStore.loading && lojaAtual === loja.codigo,
                }"
                @click="trocarLoja(loja)"
              >
                <span class="item-codigo">{{ loja.codigo }}</span>
                <span class="item-nome">{{
                  extrairNomeSimples(loja.nome)
                }}</span>
                <span
                  v-if="lojaStore.loading && lojaAtual === loja.codigo"
                  class="loading-icon"
                  >⏳</span
                >
              </div>
            </div>
            <div class="dropdown-footer">
              <button @click="sairDoSistema" class="btn-sair">
                Voltar à Seleção
              </button>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <!-- Upload Menu com Dropdown -->
          <div class="nav-item-container">
            <div
              class="nav-item main-nav-item"
              :class="{
                'router-link-active': isUploadActive,
                'dropdown-open': showUploadSubmenu && !sidebarCollapsed,
              }"
              @click="handleMenuClick('upload')"
              :title="sidebarCollapsed ? 'Upload' : ''"
            >
              <img
                src="../assets/svg/upload.svg"
                alt="Upload"
                class="nav-icon"
              />
              <span class="nav-text" v-if="!sidebarCollapsed">Upload</span>
              <span
                class="dropdown-arrow"
                v-if="!sidebarCollapsed"
                :class="{ rotated: showUploadSubmenu }"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style="display: inline; vertical-align: middle"
                >
                  <path
                    d="M7 5l5 5-5 5"
                    stroke="#667eea"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>

            <!-- Dropdown do Upload -->
            <transition name="dropdown">
              <div
                v-if="showUploadSubmenu && !sidebarCollapsed"
                class="dropdown-menu"
              >
                <router-link
                  to="/upload/etiqueta"
                  class="dropdown-item"
                  @click="closeSubmenus"
                >
                  <img
                    src="../assets/svg/upload.svg"
                    alt="Upload"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Upload Etiqueta</span>
                </router-link>
                <router-link
                  to="/upload/presenca"
                  class="dropdown-item"
                  @click="closeSubmenus"
                >
                  <img
                    src="../assets/svg/upload.svg"
                    alt="Upload"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Upload Presença</span>
                </router-link>
                <router-link
                  to="/upload/ruptura"
                  class="dropdown-item"
                  @click="closeSubmenus"
                >
                  <img
                    src="../assets/svg/upload.svg"
                    alt="Upload"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Upload Ruptura</span>
                </router-link>
              </div>
            </transition>

            <!-- Tooltip para modo colapsado -->
            <div
              v-if="sidebarCollapsed && showUploadSubmenu"
              class="tooltip-menu"
            >
              <div class="tooltip-content">
                <div class="tooltip-header">Upload</div>
                <router-link
                  to="/upload/etiqueta"
                  class="tooltip-item"
                  @click="closeSubmenus"
                >
                  Upload Etiqueta
                </router-link>
                <router-link
                  to="/upload/presenca"
                  class="tooltip-item"
                  @click="closeSubmenus"
                >
                  Upload Presença
                </router-link>
                <router-link
                  to="/upload/ruptura"
                  class="tooltip-item"
                  @click="closeSubmenus"
                >
                  Upload Ruptura
                </router-link>
              </div>
            </div>
          </div>

          <router-link
            to="/dashboard/views"
            class="nav-item"
            @click="closeSubmenus"
            :title="sidebarCollapsed ? 'Dashboard' : ''"
          >
            <img
              src="../assets/svg/dash.svg"
              alt="Dashboard"
              class="nav-icon"
            />
            <span class="nav-text" v-if="!sidebarCollapsed">Dashboard</span>
          </router-link>

          <router-link
            to="/usuarios"
            class="nav-item"
            @click="closeSubmenus"
            :title="sidebarCollapsed ? 'Usuários' : ''"
          >
            <img src="../assets/svg/user.svg" alt="Usuários" class="nav-icon" />
            <span class="nav-text" v-if="!sidebarCollapsed">Usuários</span>
          </router-link>

          <!-- Ranking Unificado -->
          <router-link
            to="/ranking"
            class="nav-item"
            @click="closeSubmenus"
            :title="sidebarCollapsed ? 'Ranking Colaboradores' : ''"
          >
            <img
              src="../assets/svg/ranking.svg"
              alt="Ranking"
              class="nav-icon"
            />
            <span class="nav-text" v-if="!sidebarCollapsed"
              >Ranking Colaboradores</span
            >
          </router-link>

          <router-link
            to="/setores"
            class="nav-item"
            @click="closeSubmenus"
            :title="sidebarCollapsed ? 'Setores' : ''"
          >
            <img
              src="../assets/svg/setores.svg"
              alt="Setores"
              class="nav-icon"
            />
            <span class="nav-text" v-if="!sidebarCollapsed">Setores</span>
          </router-link>

          <router-link
            to="/lista"
            class="nav-item"
            @click="closeSubmenus"
            :title="sidebarCollapsed ? 'Perfil usuários' : ''"
          >
            <img
              src="../assets/svg/list.svg"
              alt="Lista de Usuários"
              class="nav-icon"
            />
            <span class="nav-text" v-if="!sidebarCollapsed"
              >Perfil usuários</span
            >
          </router-link>

          <router-link
            to="/relatorios"
            class="nav-item"
            @click="closeSubmenus"
            :title="sidebarCollapsed ? 'Relatórios' : ''"
          >
            <img
              src="../assets/svg/report.svg"
              alt="Relatórios"
              class="nav-icon"
            />
            <span class="nav-text" v-if="!sidebarCollapsed">Relatórios</span>
          </router-link>

          <router-link
            :to="`/perfil-loja/${lojaStore.codigoLojaAtual}`"
            class="nav-item"
            @click="closeSubmenus"
            :title="sidebarCollapsed ? 'Perfil da Loja' : ''"
          >
            <img
              src="../assets/svg/StorePerfil.svg"
              alt="Perfil da Loja"
              class="nav-icon"
            />
            <span class="nav-text" v-if="!sidebarCollapsed"
              >Perfil da Loja</span
            >
            <span class="dropdown-arrow static-arrow" v-if="!sidebarCollapsed">
              <svg
                width="12"
                height="12"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="display: inline; vertical-align: middle"
              >
                <path
                  d="M7 5l5 5-5 5"
                  stroke="#667eea"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </router-link>
        </nav>

        <!-- Perfil da Loja no final da sidebar -->
        <div class="loja-profile">
          <div class="profile-pattern"></div>
          <div class="profile-content">
            <div class="loja-image">
              <img
                :src="lojaStore.imagemLojaAtual"
                :alt="'Imagem da ' + lojaStore.nomeLojaAtual"
                @error="handleImageError"
              />
            </div>
            <div class="loja-info" v-if="!sidebarCollapsed">
              <h3>Loja {{ lojaStore.codigoLojaAtual }}</h3>
              <p>{{ extrairNomeSimples(lojaStore.nomeLojaAtual) }}</p>
            </div>
            <button
              class="logout-btn"
              @click="sairDoSistema"
              :title="sidebarCollapsed ? 'Sair da loja' : 'Sair'"
            >
              <span class="logout-arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 48 48"
                >
                  <rect width="48" height="48" fill="none" />
                  <path
                    fill="#eaeaea"
                    fill-rule="evenodd"
                    d="M8.14 45.956c3.271.266 8.462.544 15.864.544c7.401 0 12.593-.278 15.864-.544c3.288-.267 5.825-2.804 6.092-6.092c.266-3.271.544-8.463.544-15.864s-.278-12.593-.544-15.864c-.267-3.288-2.804-5.825-6.092-6.092c-3.271-.266-8.463-.544-15.864-.544s-12.593.278-15.864.544c-3.288.267-5.825 2.804-6.092 6.092c-.266 3.271-.544 8.463-.544 15.864s.278 12.593.544 15.864c.267 3.288 2.804 5.825 6.092 6.092m17.756-29.238c-1.414-.049-2.64-.922-2.696-2.335a12 12 0 0 1 0-.967c.057-1.414 1.283-2.284 2.697-2.336a131 131 0 0 1 6.108-.074a6.05 6.05 0 0 1 6 6.047l-.009 10.81c-.003 3.312-2.687 6.001-5.998 6.08c-4.872.117-10.272.328-13.704.473a63 63 0 0 1-.11 2.4c-.085 1.249-1.273 1.794-2.272 1.04a55 55 0 0 1-2.915-2.378c-1.713-1.487-2.693-2.602-3.246-3.348a1.844 1.844 0 0 1 0-2.247c.553-.745 1.534-1.861 3.246-3.348a55 55 0 0 1 2.915-2.38c1-.752 2.187-.207 2.271 1.041c.041.609.08 1.36.107 2.282c4.129.074 8.921.251 12.98.406a1 1 0 0 0 1.038-1v-9.133c0-.553-.448-1-1-.999c-.464.001-.882.004-1.27.006c-1.541.007-2.604.013-4.142-.04"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Conteúdo Principal -->
      <main class="main-content" :class="{ collapsed: sidebarCollapsed }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLojaStore } from "../store/lojaStore";

const router = useRouter();
const route = useRoute();
const lojaStore = useLojaStore();

// Estados do componente
const showUploadSubmenu = ref(false);
const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);
const mostrarTrocaLoja = ref(false);
const lojaAtual = ref(null);

// Computed
const isUploadActive = computed(() => route.path.startsWith("/upload/"));

// Verificação de loja obrigatória
const verificarLojaSelecionada = () => {
  if (!lojaStore.isLojaSelected) {
    console.warn("Tentativa de acessar sidebar sem loja selecionada");
    // O App.vue deve detectar isso e redirecionar para seleção
    return false;
  }
  return true;
};

// Métodos
function extrairNomeSimples(nomeCompleto) {
  if (!nomeCompleto) return "Carregando...";
  // "Loja 056 - Goiania Burits" -> "Goiania Burits"
  const partes = nomeCompleto.split(" - ");
  return partes.length > 1 ? partes[1] : nomeCompleto;
}

async function trocarLoja(loja) {
  if (loja.codigo === lojaStore.codigoLojaAtual) {
    mostrarTrocaLoja.value = false;
    return;
  }

  mostrarTrocaLoja.value = false;
  closeSubmenus();
  lojaAtual.value = loja.codigo;

  try {
    const sucesso = await lojaStore.selecionarLoja(loja);
    if (sucesso) {
      console.log(`Loja alterada para: ${loja.nome}`);
      // Recarregar a página atual para buscar dados da nova loja
      router.go(0);
    } else {
      console.error(
        `Erro ao trocar para loja ${loja.codigo}:`,
        lojaStore.error
      );
      alert(`Erro ao selecionar loja: ${lojaStore.error}`);
    }
  } catch (error) {
    console.error("Erro inesperado ao trocar loja:", error);
    alert("Erro inesperado ao trocar loja");
  } finally {
    lojaAtual.value = null;
  }
}

function sairDoSistema() {
  if (confirm("Deseja realmente sair e voltar à seleção de loja?")) {
    lojaStore.limparLoja();
    // O App.vue detectará que não há loja e mostrará a tela de seleção
  }
}

function handleImageError(event) {
  event.target.src = "/images/lojas/default.jpg";
}

function toggleUploadSubmenu() {
  if (sidebarCollapsed.value) return;
  showUploadSubmenu.value = !showUploadSubmenu.value;
}

function handleMenuClick(menuType) {
  if (sidebarCollapsed.value) {
    // No modo colapsado, mostra tooltip
    if (menuType === "upload") {
      showUploadSubmenu.value = !showUploadSubmenu.value;
    }
  } else {
    // No modo expandido, comportamento normal
    if (menuType === "upload") {
      toggleUploadSubmenu();
    }
  }
}

function closeSubmenus() {
  showUploadSubmenu.value = false;
  mostrarTrocaLoja.value = false;
}

function toggleMobileSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function closeMobileSidebar() {
  sidebarOpen.value = false;
  closeSubmenus();
}

function toggleSidebarCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  closeSubmenus();

  // Salvar estado no localStorage
  localStorage.setItem("sidebarCollapsed", sidebarCollapsed.value.toString());
}

// Watchers
watch(route, () => {
  closeSubmenus();
  // Fecha sidebar no mobile ao navegar
  if (window.innerWidth <= 768) {
    closeMobileSidebar();
  }
});

// Lifecycle
onMounted(() => {
  // Verificar se há loja selecionada
  if (!verificarLojaSelecionada()) {
    return;
  }

  // Recuperar estado da sidebar do localStorage
  const savedState = localStorage.getItem("sidebarCollapsed");
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === "true";
  }

  // Event listeners
  const handleResize = () => {
    if (window.innerWidth > 768) {
      sidebarOpen.value = false;
    }
  };

  const handleClickOutside = (event) => {
    if (
      sidebarCollapsed.value &&
      !event.target.closest(".nav-item-container")
    ) {
      closeSubmenus();
    }
  };

  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);

  // Cleanup
  return () => {
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("click", handleClickOutside);
  };
});
</script>

<style>
/* Reset e base */
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

/* Barra Lateral Modernizada */
.sidebar {
  width: 280px;
  background: rgb(255, 255, 255);
  color: #2c3e50;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-radius: 0 20px 20px 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sidebar Colapsada */
.sidebar.collapsed {
  width: 80px;
}

/* Header da Sidebar com padrão elegante */
.sidebar-header {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  border-radius: 0 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 15px;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding-right: 0;
}

.header-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="15" cy="80" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="85" cy="20" r="4" fill="rgba(255,255,255,0.1)"/></svg>');
  border-radius: 0 20px 0 0;
}

.header-content {
  position: relative;
  z-index: 2;
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
}

.sidebar.collapsed .header-content {
  padding: 2rem 0.5rem;
  justify-content: center;
}

.sidebar-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.collapsed-title {
  font-size: 1.1rem !important;
  text-align: center;
}

/* Botão Toggle da Sidebar */
.sidebar-toggle-btn {
  position: relative;
  z-index: 3;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.sidebar-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.sidebar-toggle-btn.collapsed {
  transform: rotate(180deg);
}

.sidebar-toggle-btn.collapsed:hover {
  transform: rotate(180deg) scale(1.1);
}

.sidebar.collapsed .sidebar-toggle-btn {
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%) rotate(180deg);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Navegação */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.5rem 1rem;
  flex: 1;
}

.sidebar.collapsed .sidebar-nav {
  padding: 1.5rem 0.5rem;
  align-items: center;
}

/* Itens de navegação */
.nav-item-container {
  position: relative;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.9rem 1.2rem;
  color: #5a6c7d;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  backdrop-filter: blur(10px);
  min-height: 48px;
}

.sidebar.collapsed .nav-item {
  padding: 0.9rem;
  justify-content: center;
  width: 48px;
  margin: 0 auto;
}

.nav-item:hover {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.08) 0%,
    rgba(118, 75, 162, 0.08) 100%
  );
  color: #667eea;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.sidebar.collapsed .nav-item:hover {
  transform: scale(1.1);
}

.nav-item.router-link-active {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.15) 0%,
    rgba(118, 75, 162, 0.15) 100%
  );
  color: #667eea;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.nav-item.dropdown-open {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.12) 0%,
    rgba(118, 75, 162, 0.12) 100%
  );
  color: #667eea;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-right: 1rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  filter: brightness(0) saturate(100%) invert(42%) sepia(15%) saturate(1179%)
    hue-rotate(169deg) brightness(94%) contrast(89%);
  flex-shrink: 0;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.nav-item:hover .nav-icon,
.nav-item.router-link-active .nav-icon {
  opacity: 1;
  filter: brightness(0) saturate(100%) invert(44%) sepia(58%) saturate(2015%)
    hue-rotate(229deg) brightness(95%) contrast(87%);
}

.nav-text {
  flex: 1;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Dropdown Arrow */
.dropdown-arrow {
  margin-left: auto;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  opacity: 0.7;
}

.static-arrow {
  margin-left: 0.5rem;
  opacity: 0.7;
}

.dropdown-arrow.rotated {
  transform: rotate(90deg);
}

/* Menu Dropdown */
.dropdown-menu {
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
  padding: 0.5rem 0;
  margin-top: -8px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-top: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.7rem 1.5rem;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  margin: 0 0.5rem;
  border-radius: 8px;
}

.dropdown-item:hover {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
  transform: translateX(4px);
}

.dropdown-item.router-link-active {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
  font-weight: 600;
}

.dropdown-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.8rem;
  opacity: 0.7;
  filter: brightness(0) saturate(100%) invert(50%) sepia(8%) saturate(878%)
    hue-rotate(169deg) brightness(94%) contrast(89%);
}

.dropdown-item:hover .dropdown-icon,
.dropdown-item.router-link-active .dropdown-icon {
  filter: brightness(0) saturate(100%) invert(44%) sepia(58%) saturate(2015%)
    hue-rotate(229deg) brightness(95%) contrast(87%);
}

.dropdown-text {
  font-size: 0.9rem;
}

/* Tooltip Menu para modo colapsado */
.tooltip-menu {
  position: absolute;
  left: 80px;
  top: 0;
  z-index: 1001;
  opacity: 0;
  animation: tooltipFadeIn 0.2s ease forwards;
}

.tooltip-content {
  background: white;
  border-radius: 12px;
  padding: 0.8rem 0;
  min-width: 180px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.tooltip-header {
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  margin-bottom: 0.3rem;
}

.tooltip-item {
  display: block;
  padding: 0.6rem 1rem;
  color: #6c757d;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.tooltip-item:hover {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.tooltip-item.router-link-active {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
  font-weight: 600;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animação do Dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0);
}

/* Perfil da Loja Modernizado */
.loja-profile {
  margin-top: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 0 20px 0;
  position: relative;
  overflow: hidden;
}

.sidebar.collapsed .loja-profile {
  border-radius: 0;
}

.profile-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="60" cy="30" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="70" r="2" fill="rgba(255,255,255,0.1)"/></svg>');
}

.profile-content {
  position: relative;
  z-index: 2;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.sidebar.collapsed .profile-content {
  flex-direction: column;
  gap: 0.8rem;
  padding: 1rem 0.5rem;
}

.loja-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.sidebar.collapsed .loja-image {
  width: 40px;
  height: 40px;
}

.loja-image:hover {
  transform: scale(1.05);
}

.loja-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loja-info {
  flex: 1;
  min-width: 0;
}

.loja-info h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.loja-info p {
  font-size: 0.85rem;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.9);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 10px;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.sidebar.collapsed .logout-btn {
  width: 36px;
  height: 36px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Conteúdo Principal */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
  background-color: #f8fafc;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.collapsed {
  margin-left: 80px;
}

/* Scrollbar personalizada */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.3);
}

/* Menu Hamburger para Mobile */
.menu-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1002;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 0.8rem;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 50px;
  height: 50px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.menu-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.menu-toggle span {
  display: block;
  width: 20px;
  height: 2px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.menu-toggle.active span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* Overlay para Mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .sidebar {
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 20px 20px 0;
    z-index: 1001;
  }

  .sidebar.collapsed {
    width: 280px; /* No mobile, sempre expandida quando aberta */
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 5rem;
  }

  .main-content.collapsed {
    margin-left: 0;
  }

  .sidebar-toggle-btn {
    display: none; /* Esconder botão toggle no mobile */
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 260px;
  }

  .header-content {
    padding: 1.5rem 1rem;
  }

  .sidebar-header h1 {
    font-size: 1.2rem;
  }

  .profile-content {
    padding: 1rem;
    gap: 0.8rem;
  }

  .loja-image {
    width: 45px;
    height: 45px;
  }

  .nav-item {
    padding: 0.8rem 1rem;
  }

  .main-content {
    padding: 0.8rem;
    padding-top: 4.5rem;
  }
}

/* Animações suaves */
.nav-item {
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(102, 126, 234, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.nav-item:hover::before {
  left: 100%;
}

.sidebar.collapsed .nav-item::before {
  display: none; /* Desabilitar animação no modo colapsado */
}

/* Efeito de borda ativa */
.nav-item.router-link-active::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 2px 2px 0;
}

.sidebar.collapsed .nav-item.router-link-active::after {
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 60%;
  height: 4px;
  border-radius: 0 0 2px 2px;
}
</style>
