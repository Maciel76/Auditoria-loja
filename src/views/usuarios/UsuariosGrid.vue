<template>
  <div class="usuarios-grid">
    <UsuarioCard
      v-for="usuario in usuariosFiltrados"
      :key="usuario.id"
      :usuario="usuario"
      :dataFiltro="dataFiltro"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import UsuarioCard from "./UsuarioCard.vue";

const props = defineProps({
  usuarios: Array,
  dataFiltro: String,
  filtro: String,
});

const usuariosFiltrados = computed(() =>
  props.usuarios.filter(
    (u) =>
      (u.nome && u.nome.toLowerCase().includes(props.filtro.toLowerCase())) ||
      (u.id && u.id.toLowerCase().includes(props.filtro.toLowerCase()))
  )
);
</script>

<style scoped>
.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .usuarios-grid {
    grid-template-columns: 1fr;
  }
}
</style>
