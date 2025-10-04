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
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  font-family: "Inter", sans-serif;
}

.usuario-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.usuario-avatar {
  flex-shrink: 0;
  position: relative;
}

.avatar-img {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.avatar-placeholder {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}

.avatar-placeholder:hover {
  transform: scale(1.05);
}

.usuario-info {
  flex: 1;
}

.usuario-nome {
  margin: 0 0 5px 0;
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.usuario-matricula {
  font-size: 0.95rem;
  color: #7f8c8d;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.card-stats {
  padding: 20px 25px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
}

.stat {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 12px;
  padding: 5px 0;
}

.stat:last-child {
  margin-bottom: 0;
}

.stat i {
  width: 18px;
  font-size: 1rem;
  color: #667eea;
}

.stat span {
  font-size: 0.95rem;
}

.card-actions {
  padding: 20px 25px;
  background: #fbfcfd;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  letter-spacing: 0.3px;
}

.action-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b5b95 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.action-btn i {
  font-size: 0.9rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .card-header {
    padding: 20px;
    gap: 15px;
  }

  .avatar-img,
  .avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 15px;
  }

  .avatar-placeholder {
    font-size: 1.3rem;
  }

  .usuario-nome {
    font-size: 1.1rem;
  }

  .usuario-matricula {
    font-size: 0.9rem;
  }

  .card-stats {
    padding: 15px 20px;
  }

  .card-actions {
    padding: 15px 20px;
  }

  .action-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .usuario-info {
    text-align: center;
  }

  .stat {
    justify-content: center;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
