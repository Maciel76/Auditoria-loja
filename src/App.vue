<!-- App.vue - Versão Corrigida -->
<template>
  <div id="app">
    <!-- Tela de seleção de loja -->
    <div v-if="!lojaStore.isLojaSelected" class="selecao-loja-screen">
      <SelecionarLoja @lojaAlterada="onLojaAlterada" />
    </div>

    <!-- Aplicação principal com sidebar -->
    <div v-else class="app-principal">
      <AppSidebar />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useLojaStore } from "./store/lojaStore";
import SelecionarLoja from "./views/SelecionarLoja.vue";
import AppSidebar from "./components/AppSidebar.vue";

const lojaStore = useLojaStore();

onMounted(() => {
  // Carregar loja salva ao inicializar
  lojaStore.carregarLoja();
});

function onLojaAlterada(loja) {
  console.log("Loja alterada:", loja);
  // Aqui você pode fazer outras ações quando a loja muda
  // Como recarregar dados, limpar caches, etc.
}
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

.selecao-loja-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-principal {
  min-height: 100vh;
}
</style>
