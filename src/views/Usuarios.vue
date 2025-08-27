<template>
  <div class="usuarios-modern-container">
    <!-- Header -->
    <div class="header">
      <h1><i class="fas fa-users"></i> Sistema de Auditoria</h1>
      <p>Gestão de colaboradores e auditorias</p>
    </div>

    <!-- Filtros -->
    <div class="filtros-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="filtro"
          placeholder="Buscar por nome ou matrícula..."
          class="search-input"
        />
      </div>

      <div class="filtro-data">
        <label>Filtrar por data:</label>
        <select v-model="dataFiltro" @change="carregarUsuarios">
          <option value="">Todas as datas</option>
          <option v-for="data in datasAuditoria" :key="data" :value="data">
            {{ formatarData(data) }}
          </option>
        </select>
      </div>

      <div class="actions">
        <button @click="carregarUsuarios" class="btn btn-refresh">
          <i class="fas fa-sync-alt"></i> Atualizar
        </button>
      </div>
    </div>

    <!-- Estatísticas -->
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

    <!-- Loading -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando colaboradores...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="erro" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>Ocorreu um erro</h3>
      <p>{{ erro }}</p>
      <button @click="carregarUsuarios" class="btn btn-primary">
        <i class="fas fa-redo"></i> Tentar Novamente
      </button>
    </div>

    <!-- Sem dados -->
    <div v-else-if="usuarios.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-user-slash"></i>
      </div>
      <h3>Nenhum colaborador encontrado</h3>
      <p>Faça o upload de uma planilha para começar</p>
      <router-link to="/upload" class="btn btn-primary">
        <i class="fas fa-upload"></i> Fazer Upload
      </router-link>
    </div>

    <!-- Grid de usuários -->
    <div v-else class="usuarios-grid">
      <div
        v-for="usuario in usuariosFiltrados"
        :key="usuario.id"
        class="usuario-card"
      >
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const usuarios = ref([]);
const filtro = ref("");
const carregando = ref(true);
const erro = ref("");
const dataFiltro = ref("");
const datasAuditoria = ref([]);

// Carregar usuários do backend MongoDB ao inicializar
onMounted(() => {
  carregarDatasAuditoria();
  carregarUsuarios();
});

// Carregar datas de auditoria disponíveis
const carregarDatasAuditoria = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/datas-auditoria");
    datasAuditoria.value = data;
  } catch (error) {
    console.error("Erro ao carregar datas:", error);
  }
};

// Carregar usuários do backend MongoDB
const carregarUsuarios = async () => {
  try {
    carregando.value = true;
    erro.value = "";

    const params = {};
    if (dataFiltro.value) {
      params.data = dataFiltro.value;
    }

    const { data } = await axios.get("http://localhost:3000/usuarios", {
      params,
    });

    usuarios.value = data.map((user) => ({
      id: user.id || user.nome,
      nome: user.nome,
      contador: user.contador || 0,
      contadorDia: user.contadorDia || 0,
      contadorTotal: user.contadorTotal || 0,
      iniciais: obterIniciais(user.nome),
      foto: null,
    }));
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    erro.value = "Erro ao carregar dados do servidor";
  } finally {
    carregando.value = false;
  }
};

// Obter iniciais do nome
const obterIniciais = (nome) => {
  if (!nome) return "??";
  const nomeLimpo = nome.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
  return (
    nomeLimpo
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "??"
  );
};

// Formatar data para exibição
const formatarData = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
};

// Computed properties
const usuariosFiltrados = computed(() =>
  usuarios.value.filter(
    (u) =>
      u.nome.toLowerCase().includes(filtro.value.toLowerCase()) ||
      (u.id && u.id.toLowerCase().includes(filtro.value.toLowerCase()))
  )
);

const totalItensLidos = computed(() =>
  usuarios.value.reduce((total, usuario) => total + usuario.contador, 0)
);

const mediaItensPorUsuario = computed(() =>
  usuarios.value.length
    ? Math.round(totalItensLidos.value / usuarios.value.length)
    : 0
);
</script>

<style scoped>
/* Filtros de data */
.filtros-data {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.filtro-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filtro-group label {
  font-weight: bold;
}
.usuarios-modern-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
  font-family: "Poppins", sans-serif;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin: 0 -20px 30px -20px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Controles */
.controles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.actions {
  display: flex;
  gap: 10px;
}

/* Botões */
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-refresh {
  background: #17a2b8;
  color: white;
}

.btn-clear {
  background: #ffc107;
  color: #212529;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Estatísticas */
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

/* Loading */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e1e5e9;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error */
.error-container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 20px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 20px;
}

/* Grid de usuários */
.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.usuario-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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

.btn-remove {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.btn-remove:hover {
  background: rgba(220, 53, 69, 0.1);
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
}

.card-actions {
  padding: 15px 20px;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
  font-weight: 500;
}

.upload-btn:hover {
  background: #e9ecef;
  border-color: #667eea;
  color: #667eea;
}

.upload-btn input {
  display: none;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e1e5e9;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
filtros-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.filtro-data {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filtro-data label {
  font-weight: bold;
}

.filtro-data select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.usuario-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.usuario-card:hover {
  transform: translateY(-2px);
}

.card-actions {
  padding: 15px;
  border-top: 1px solid #eee;
}

.action-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
}

.action-btn:hover {
  background: #5a67d8;
}

/* Responsivo */
@media (max-width: 768px) {
  .controles {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .usuarios-grid {
    grid-template-columns: 1fr;
  }

  .header {
    padding: 20px;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
