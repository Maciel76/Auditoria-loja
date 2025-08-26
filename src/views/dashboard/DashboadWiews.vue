<template>
  <div>
    <DashboardHeader />
    <div class="content-page">
      <h2>Conteudo Principal</h2>
      <!-- Seu conteúdo aqui -->
    </div>
  </div>
</template>

<script>
// CORRIJA ESTA LINHA:
import DashboardHeader from "../Dashboard.vue";

export default {
  name: "DashboardViews",
  components: {
    DashboardHeader,
  },
};
</script>
