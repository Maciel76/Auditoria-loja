<template>
  <div id="sidbar">
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
      <aside class="sidebar" :class="{ open: sidebarOpen }">
        <div class="sidebar-header">
          <div class="header-pattern"></div>
          <div class="header-content">
            <h1>Auditoria Loja {{ lojaNumero }}</h1>
          </div>
        </div>
        <nav class="sidebar-nav">
          <!-- Upload Menu com Dropdown -->
          <div class="nav-item-container">
            <div
              class="nav-item main-nav-item"
              :class="{
                'router-link-active': isUploadActive,
                'dropdown-open': showUploadSubmenu,
              }"
              @click="toggleUploadSubmenu"
            >
              <img
                src="./assets/svg/upload.svg"
                alt="Upload"
                class="nav-icon"
              />
              <span class="nav-text">Upload</span>
              <span
                class="dropdown-arrow"
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
              <div v-if="showUploadSubmenu" class="dropdown-menu">
                <router-link
                  to="/upload/etiqueta"
                  class="dropdown-item"
                  @click.native="closeSubmenus"
                >
                  <img
                    src="./assets/svg/upload.svg"
                    alt="Upload"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Upload Etiqueta</span>
                </router-link>
                <router-link
                  to="/upload/presenca"
                  class="dropdown-item"
                  @click.native="closeSubmenus"
                >
                  <img
                    src="./assets/svg/upload.svg"
                    alt="Upload"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Upload Presença</span>
                </router-link>
                <router-link
                  to="/upload/ruptura"
                  class="dropdown-item"
                  @click.native="closeSubmenus"
                >
                  <img
                    src="./assets/svg/upload.svg"
                    alt="Upload"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Upload Ruptura</span>
                </router-link>
              </div>
            </transition>
          </div>

          <router-link
            to="dashboard/views"
            class="nav-item"
            @click.native="closeSubmenus"
          >
            <img src="./assets/svg/dash.svg" alt="Dashboard" class="nav-icon" />
            <span class="nav-text">Dashboard</span>
          </router-link>

          <router-link
            to="/usuarios"
            class="nav-item"
            @click.native="closeSubmenus"
          >
            <img src="./assets/svg/user.svg" alt="Usuários" class="nav-icon" />
            <span class="nav-text">Usuários</span>
          </router-link>

          <!-- Ranking Menu com Dropdown -->
          <div class="nav-item-container">
            <div
              class="nav-item main-nav-item"
              :class="{
                'router-link-active': isRankingActive,
                'dropdown-open': showRankingSubmenu,
              }"
              @click="toggleRankingSubmenu"
            >
              <img
                src="./assets/svg/ranking.svg"
                alt="Ranking"
                class="nav-icon"
              />
              <span class="nav-text">Ranking</span>
              <span
                class="dropdown-arrow"
                :class="{ rotated: showRankingSubmenu }"
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

            <!-- Dropdown do Ranking -->
            <transition name="dropdown">
              <div v-if="showRankingSubmenu" class="dropdown-menu">
                <router-link
                  to="/ranking/etiqueta"
                  class="dropdown-item"
                  @click.native="closeSubmenus"
                >
                  <img
                    src="./assets/svg/ranking.svg"
                    alt="Ranking Etiqueta"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Ranking Etiqueta</span>
                </router-link>
                <router-link
                  to="/ranking/ruptura"
                  class="dropdown-item"
                  @click.native="closeSubmenus"
                >
                  <img
                    src="./assets/svg/ranking.svg"
                    alt="Ranking Ruptura"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Ranking Ruptura</span>
                </router-link>
                <router-link
                  to="/ranking/presenca"
                  class="dropdown-item"
                  @click.native="closeSubmenus"
                >
                  <img
                    src="./assets/svg/ranking.svg"
                    alt="Ranking Presença"
                    class="dropdown-icon"
                  />
                  <span class="dropdown-text">Ranking Presença</span>
                </router-link>
              </div>
            </transition>
          </div>

          <router-link
            to="/setores"
            class="nav-item"
            @click.native="closeSubmenus"
          >
            <img
              src="./assets/svg/setores.svg"
              alt="Setores"
              class="nav-icon"
            />
            <span class="nav-text">Setores</span>
          </router-link>

          <router-link
            to="/lista"
            class="nav-item"
            @click.native="closeSubmenus"
          >
            <img
              src="./assets/svg/list.svg"
              alt="Lista de Usuários"
              class="nav-icon"
            />
            <span class="nav-text">Perfil usuários</span>
          </router-link>

          <router-link
            to="/relatorios"
            class="nav-item"
            @click.native="closeSubmenus"
          >
            <img
              src="./assets/svg/report.svg"
              alt="Relatórios"
              class="nav-icon"
            />
            <span class="nav-text">Relatórios</span>
          </router-link>

          <router-link
            :to="`/perfil-loja/${lojaNumero}`"
            class="nav-item"
            @click.native="closeSubmenus"
          >
            <img
              src="./assets/svg/StorePerfil.svg"
              alt="Perfil da Loja"
              class="nav-icon"
            />
            <span class="nav-text">Perfil da Loja</span>
            <span class="dropdown-arrow static-arrow">
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
                :src="lojaImagem"
                :alt="'Imagem da ' + lojaNome"
                @error="handleImageError"
              />
            </div>
            <div class="loja-info">
              <h3>Loja {{ lojaNumero }}</h3>
              <p>{{ lojaNome }}</p>
            </div>
            <router-link to="/" custom v-slot="{ navigate }">
              <button
                class="logout-btn"
                @click="
                  () => {
                    sair();
                    navigate();
                  }
                "
                title="Sair da loja"
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
            </router-link>
          </div>
        </div>
      </aside>

      <!-- Conteúdo Principal -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { useLojaStore } from "./store/lojaStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "sidbar",
  setup() {
    const lojaStore = useLojaStore();
    const router = useRouter();
    const defaultImage = ref("/images/lojas/default.jpg");

    // Carrega a loja ao inicializar
    onMounted(() => {
      lojaStore.carregarLoja();
    });

    // Computed properties para a loja
    const lojaSelecionada = computed(() => lojaStore.lojaSelecionada);
    const lojaNumero = computed(() => lojaSelecionada.value?.codigo || "000");
    const lojaNome = computed(
      () => lojaSelecionada.value?.nome || "Nenhuma loja selecionada"
    );

    // Imagem da loja - método mais robusto
    const lojaImagem = computed(() => {
      if (lojaSelecionada.value?.imagem) {
        return lojaSelecionada.value.imagem;
      }

      // Tenta encontrar imagem baseada no código da loja, padronizando para 3 dígitos
      const codigo = lojaSelecionada.value?.codigo;
      if (codigo) {
        const codigoPadronizado = codigo.toString().padStart(3, "0");
        return `/images/lojas/${codigoPadronizado}.jpg`;
      }

      return defaultImage.value;
    });

    const handleImageError = (event) => {
      // Se a imagem específica falhar, usa a imagem padrão
      event.target.src = defaultImage.value;
    };

    const sair = () => {
      lojaStore.limparLoja();
      router.push("/"); // Volta para seleção de loja
    };

    return {
      lojaNumero,
      lojaNome,
      lojaImagem,
      sair,
      handleImageError,
    };
  },
  data() {
    return {
      showUploadSubmenu: false,
      showRankingSubmenu: false,
      sidebarOpen: false,
    };
  },
  computed: {
    isUploadActive() {
      return this.$route.path.startsWith("/upload/");
    },
    isRankingActive() {
      return this.$route.path.startsWith("/ranking/");
    },
  },
  methods: {
    toggleUploadSubmenu() {
      this.showUploadSubmenu = !this.showUploadSubmenu;
      if (this.showRankingSubmenu) {
        this.showRankingSubmenu = false;
      }
    },
    toggleRankingSubmenu() {
      this.showRankingSubmenu = !this.showRankingSubmenu;
      if (this.showUploadSubmenu) {
        this.showUploadSubmenu = false;
      }
    },
    closeSubmenus() {
      this.showUploadSubmenu = false;
      this.showRankingSubmenu = false;
    },
    toggleMobileSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeMobileSidebar() {
      this.sidebarOpen = false;
      this.closeSubmenus();
    },
  },
  watch: {
    $route() {
      this.closeSubmenus();
      // Fecha sidebar no mobile ao navegar
      if (window.innerWidth <= 768) {
        this.closeMobileSidebar();
      }
    },
  },
  mounted() {
    // Fecha sidebar se redimensionar para desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.sidebarOpen = false;
      }
    });
  },
};
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
}

/* Header da Sidebar com padrão elegante */
.sidebar-header {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  border-radius: 0 20px 0 0;
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
}

.sidebar-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

/* Navegação */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.5rem 1rem;
  flex: 1;
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

.dropdown-arrow i {
  font-size: 0.8rem;
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
}

.loja-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
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
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-btn i {
  color: white;
  font-size: 1.1rem;
}

/* Conteúdo Principal */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
  background-color: #f8fafc;
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

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 5rem; /* Espaço para o menu hamburger */
  }

  .sidebar-header {
    border-radius: 0 20px 0 0;
  }

  .header-pattern {
    border-radius: 0 20px 0 0;
  }

  .loja-profile {
    border-radius: 0 0 20px 0;
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
</style>

/* Seta de logout (voltar) SVG customizada */ .logout-arrow { display: flex;
align-items: center; justify-content: center; }
