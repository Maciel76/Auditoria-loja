<!-- App.vue - Versão Corrigida -->
<template>
  <div id="app">
    <!-- Tela de seleção de loja -->
    <div v-if="rotaSemLayout" class="tela-sem-layout">
      <router-view />
    </div>

    <!-- Aplicação principal com sidebar -->
    <div
      v-else-if="lojaStore.isLojaSelected && !userSessionStore.isUsuarioComum"
      class="app-principal"
    >
      <AppSidebar />
    </div>

    <!-- Aplicação para usuário comum (sem sidebar) -->
    <div v-else class="app-usuario-comum">
      <router-view />
      <MobileBottomNav />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useLojaStore } from "./store/lojaStore";
import { useUserSessionStore } from "./store/userSessionStore";
import SelecionarLoja from "./views/SelecionarLoja.vue";
import AppSidebar from "./components/AppSidebar.vue";
import MobileBottomNav from "./components/MobileBottomNav.vue";

const route = useRoute();
const lojaStore = useLojaStore();
const userSessionStore = useUserSessionStore();

// Rotas que não devem mostrar sidebar nem layout
const rotaSemLayout = computed(() => {
  const rotasSemLayout = ["/", "/login", "/admin/login"];
  return rotasSemLayout.includes(route.path);
});

onMounted(() => {
  // Carregar sessão do usuário comum se existir
  userSessionStore.carregarSessao();

  // Carregar loja salva ao inicializar
  lojaStore.carregarLoja();
});

function onLojaAlterada(loja) {
  console.log("Loja alterada:", loja);
  // Aqui você pode fazer outras ações quando a loja muda
  // Como recarregar dados, limpar caches, etc.
}
</script>

<style scoped>
/* Reset e base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f8fafc;
}

#app {
  min-height: 100vh;
}

.selecao-loja-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.tela-sem-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-principal {
  min-height: 100vh;
}

.app-usuario-comum {
  min-height: 100vh;
  background: #f8fafc;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

<style>
/* Esconde o menu mobile quando modal de comentário estiver aberto */
body.modal-comment-open .mobile-bottom-nav {
  display: none !important;
  opacity: 0;
  pointer-events: none;
  transform: translateY(100%);
}
</style>
