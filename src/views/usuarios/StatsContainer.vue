<template>
  <div class="stats-container">
    <div class="stat-card">
      <div class="stat-icon">
        <i class="fas fa-user-friends"></i>
      </div>
      <div class="stat-info">
        <h3>{{ usuarios.length }}</h3>
        <p>Colaboradores</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">
        <i class="fas fa-clipboard-check"></i>
      </div>
      <div class="stat-info">
        <h3>{{ totalItensLidos }}</h3>
        <p>Itens Lidos</p>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <div class="stat-info">
        <h3>{{ mediaItensPorUsuario }}</h3>
        <p>Média/Colaborador</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  usuarios: Array,
  carregando: Boolean,
});

const totalItensLidos = computed(() =>
  props.usuarios.reduce((total, usuario) => total + usuario.contador, 0)
);

const mediaItensPorUsuario = computed(() =>
  props.usuarios.length
    ? Math.round(totalItensLidos.value / props.usuarios.length)
    : 0
);
</script>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-info h3 {
  font-size: 2rem;
  margin: 0;
  color: #2c3e50;
}

.stat-info p {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
