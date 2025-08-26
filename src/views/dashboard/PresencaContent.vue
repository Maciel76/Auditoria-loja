<template>
  <div>
    <DashboardHeader />
    <div class="content-page">
      <h2>Auditoria de Presença</h2>
      <!-- Seu conteúdo aqui -->
    </div>
  </div>
</template>

<script>
// CORRIJA ESTA LINHA:
import DashboardHeader from "../Dashboard.vue";

export default {
  name: "PresencaContent",
  components: {
    DashboardHeader,
  },
};
</script>
