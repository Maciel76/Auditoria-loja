<template>
  <div class="perfil-header">
    <div class="perfil-cover">
      <div class="cover-pattern"></div>
    </div>

    <div class="perfil-info">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img
            v-if="usuario.foto"
            :src="usuario.foto"
            :alt="usuario.nome"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            {{ usuario.iniciais }}
          </div>
          <div class="avatar-badge" v-if="usuario.contador >= 500">
            <span class="icon">⭐</span>
          </div>
        </div>
      </div>

      <div class="perfil-details">
        <h1 class="usuario-nome">{{ usuario.nome }}</h1>
        <p class="usuario-matricula">Matrícula: {{ usuario.id }}</p>
        <p class="usuario-cargo">Auditor de Estoque</p>
      </div>

      <div class="perfil-stats">
        <div class="stat-item">
          <span class="stat-number">{{ usuario.contador }}</span>
          <span class="stat-label">Itens Lidos</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ corredoresUnicos.length }}</span>
          <span class="stat-label">Corredores</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ percentualConcluido }}%</span>
          <span class="stat-label">Concluído</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerfilHeader",
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    corredoresUnicos: {
      type: Array,
      default: () => [],
    },
    percentualConcluido: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
/* Copiar os estilos relacionados ao header do arquivo original */
.perfil-header {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
}

.perfil-cover {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.cover-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="5" fill="rgba(255,255,255,0.1)"/></svg>');
}

.perfil-info {
  padding: 0 30px 30px;
  margin-top: -30px;
  display: flex;
  align-items: flex-end;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.avatar-container {
  position: relative;
}

.avatar-wrapper {
  position: relative;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 3rem;
  border: 4px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.avatar-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #ffd43b;
  color: #000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  font-size: 1.5rem;
}

.perfil-details {
  flex: 1;
  min-width: 300px;
}

.usuario-nome {
  font-weight: 200;
  position: relative;
  z-index: 100;
  margin-top: -10px;

  margin-bottom: 5px;
  color: #2c3e50;
}

.usuario-matricula,
.usuario-cargo {
  color: #7f8c8d;
  margin-bottom: 5px;
}

.perfil-stats {
  display: flex;
  gap: 30px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  min-width: 300px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .perfil-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .perfil-stats {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
