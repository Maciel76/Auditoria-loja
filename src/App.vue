<template>
  <div id="sidbar">
    <div class="app-container">
      <!-- Barra Lateral -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>Auditoria Loja {{ lojaNumero }}</h1>
        </div>
        <nav class="sidebar-nav">
          <!-- Itens do menu (mantidos iguais) -->
          <div class="nav-item-container">
            <div
              class="nav-item main-nav-item"
              :class="{
                'router-link-active': isUploadActive,
                'submenu-open': showUploadSubmenu,
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
                class="submenu-arrow"
                :class="{ rotated: showUploadSubmenu }"
                >›</span
              >
            </div>
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

          <div class="nav-item-container">
            <div
              class="nav-item main-nav-item"
              :class="{
                'router-link-active': isRankingActive,
                'submenu-open': showRankingSubmenu,
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
                class="submenu-arrow"
                :class="{ rotated: showRankingSubmenu }"
                >›</span
              >
            </div>
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
              src="./assets/svg/user.svg"
              alt="Relatórios"
              class="nav-icon"
            />
            <span class="nav-text">Perfil Lojas</span>
          </router-link>
        </nav>

        <!-- Perfil da Loja no final da sidebar - CORRIGIDO -->
        <div class="loja-profile">
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
              <span class="logout-icon">↩</span>
            </button>
          </router-link>
        </div>

        <!-- Submenus (mantidos iguais) -->
        <transition name="submenu-slide">
          <div v-if="showUploadSubmenu" class="submenu-overlay">
            <div class="submenu-content">
              <h3>Opções de Upload</h3>
              <router-link
                to="/upload/etiqueta"
                class="submenu-item"
                @click.native="closeSubmenus"
              >
                <img
                  src="./assets/svg/upload.svg"
                  alt="Upload"
                  class="nav-icon"
                />
                <span class="submenu-text">Upload Etiqueta</span>
              </router-link>
              <router-link
                to="/upload/presenca"
                class="submenu-item"
                @click.native="closeSubmenus"
              >
                <img
                  src="./assets/svg/upload.svg"
                  alt="Upload"
                  class="nav-icon"
                />
                <span class="submenu-text">Upload Presença</span>
              </router-link>
              <router-link
                to="/upload/ruptura"
                class="submenu-item"
                @click.native="closeSubmenus"
              >
                <img
                  src="./assets/svg/upload.svg"
                  alt="Upload"
                  class="nav-icon"
                />
                <span class="submenu-text">Upload Ruptura</span>
              </router-link>
              <button class="close-submenu" @click="closeSubmenus">×</button>
            </div>
          </div>
        </transition>

        <transition name="submenu-slide">
          <div v-if="showRankingSubmenu" class="submenu-overlay">
            <div class="submenu-content">
              <h3>Opções de Ranking</h3>
              <router-link
                to="/ranking/etiqueta"
                class="submenu-item"
                @click.native="closeSubmenus"
              >
                <img
                  src="./assets/svg/ranking.svg"
                  alt="Ranking Etiqueta"
                  class="nav-icon"
                />
                <span class="submenu-text">Ranking Etiqueta</span>
              </router-link>
              <router-link
                to="/ranking/ruptura"
                class="submenu-item"
                @click.native="closeSubmenus"
              >
                <img
                  src="./assets/svg/ranking.svg"
                  alt="Ranking Ruptura"
                  class="nav-icon"
                />
                <span class="submenu-text">Ranking Ruptura</span>
              </router-link>
              <router-link
                to="/ranking/presenca"
                class="submenu-item"
                @click.native="closeSubmenus"
              >
                <img
                  src="./assets/svg/ranking.svg"
                  alt="Ranking Presença"
                  class="nav-icon"
                />
                <span class="submenu-text">Ranking Presença</span>
              </router-link>
              <button class="close-submenu" @click="closeSubmenus">×</button>
            </div>
          </div>
        </transition>
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
  },
  watch: {
    $route() {
      this.closeSubmenus();
    },
  },
};
</script>

<style>
/* Seus estilos existentes permanecem os mesmos */
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
  display: flex;
  flex-direction: column;
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
  position: relative;
  z-index: 2;
  flex: 1;
}

/* Perfil da Loja - NOVO ESTILO */
.loja-profile {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 0.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.loja-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
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
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loja-info p {
  font-size: 0.8rem;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.logout-btn img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

/* Resto dos estilos existentes mantidos... */
.nav-item-container {
  position: relative;
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
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-item.submenu-open {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
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

.submenu-arrow {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  margin-left: 0.5rem;
}

.submenu-arrow.rotated {
  transform: rotate(90deg);
}

/* Submenu Overlay */
.submenu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.submenu-content {
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, #132d47 0%, #2c3e50 100%);
  padding: 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.submenu-content h3 {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.submenu-item {
  display: block;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.submenu-item.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.submenu-text {
  margin-left: 10px;
}

.close-submenu {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.close-submenu:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Animações para o submenu */
.submenu-slide-enter-active,
.submenu-slide-leave-active {
  transition: opacity 0.3s ease;
}

.submenu-slide-enter-from,
.submenu-slide-leave-to {
  opacity: 0;
}

/* Conteúdo Principal */
.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  min-height: 100vh;
}
/* Ajustes para o botão de sair */
.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.logout-icon {
  font-size: 1.2rem;
  color: white;
}

/* Garantir que a imagem padrão exista */
.loja-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: linear-gradient(45deg, #62809e, #132d47);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
}

.loja-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

  .submenu-content {
    width: 200px;
  }

  .loja-profile {
    flex-direction: column;
    text-align: center;
    padding: 0.75rem;
  }

  .loja-info {
    text-align: center;
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
