<template>
  <div>
    <DashboardHeader />
    <div class="content-page">
      <h2>Auditoria de Etiquetas</h2>
      <!-- Seu conteúdo aqui -->
      <Corredores />
    </div>
  </div>
</template>

<script>
// CORRIJA ESTA LINHA:
import DashboardHeader from "../Dashboard.vue";
import Corredores from "../graficos/Corredores.vue";

export default {
  name: "EtiquetaContent",
  components: {
    DashboardHeader,
    Corredores,
  },
};
</script>
