<template>
  <div class="usuario-card">
    <div class="card-header">
      <div class="usuario-avatar">
        <img
          v-if="usuario.foto"
          :src="usuario.foto"
          alt="Foto"
          class="avatar-img"
        />
        <div v-else class="avatar-placeholder">
          {{ usuario.iniciais }}
        </div>
      </div>
      <div class="usuario-info">
        <h3 class="usuario-nome">{{ usuario.nome }}</h3>
        <span class="usuario-matricula">Matrícula: {{ usuario.id }}</span>
      </div>
    </div>

    <div class="card-stats">
      <div class="stat">
        <i class="fas fa-clipboard-list"></i>
        <span>{{ usuario.contador }} Itens Lidos</span>
      </div>
      <div class="stat" v-if="dataFiltro">
        <i class="fas fa-calendar-day"></i>
        <span>Nesta data: {{ usuario.contadorDia || 0 }}</span>
      </div>
    </div>

    <div class="card-actions">
      <router-link :to="'/perfil/' + usuario.id" class="action-btn">
        <i class="fas fa-eye"></i> Ver Detalhes
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  usuario: Object,
  dataFiltro: String,
});
</script>

<style scoped>
.usuario-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.usuario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.usuario-avatar {
  flex-shrink: 0;
}

.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.usuario-info {
  flex: 1;
}

.usuario-nome {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
}

.usuario-matricula {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.card-stats {
  padding: 15px 20px;
  border-bottom: 1px solid #e1e5e9;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat:last-child {
  margin-bottom: 0;
}

.card-actions {
  padding: 15px 20px;
}

.action-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background: #5a67d8;
}
</style>
