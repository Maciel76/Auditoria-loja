<template>
  <div class="usuarios-container">
    <!-- Seletor de Loja Obrigatório -->
    <div v-if="!lojaStore.isLojaSelected" class="loja-selection">
      <div class="loja-selection-content">
        <div class="loja-icon">
          <i class="fas fa-store"></i>
        </div>
        <h2>Selecione uma Loja</h2>
        <p>Para visualizar os colaboradores, você precisa selecionar uma loja primeiro.</p>

        <div class="lojas-grid">
          <div
            v-for="loja in lojaStore.lojas"
            :key="loja.codigo"
            class="loja-card"
            @click="selecionarLoja(loja)"
            :class="{ loading: lojaStore.loading }"
          >
            <div class="loja-image">
              <img :src="loja.imagem" :alt="loja.nome" />
            </div>
            <div class="loja-info">
              <h3>{{ loja.nome }}</h3>
              <p><i class="fas fa-map-marker-alt"></i> {{ loja.cidade }}</p>
              <span class="loja-codigo">{{ loja.codigo }}</span>
            </div>
          </div>
        </div>

        <div v-if="lojaStore.error" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          {{ lojaStore.error }}
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal (apenas quando loja selecionada) -->
    <div v-else>
      <!-- Header com Loja Selecionada -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1>
              <i class="fas fa-users-cog"></i>
              Colaboradores - {{ lojaStore.nomeLojaAtual }}
            </h1>
            <p>Gestão de colaboradores da loja {{ lojaStore.codigoLojaAtual }}</p>
          </div>
          <div class="header-actions">
            <button
              @click="carregarUsuarios"
              class="btn-icon-refresh"
              title="Atualizar dados"
              :disabled="carregando"
            >
              <i class="fas fa-sync-alt" :class="{ spinning: carregando }"></i>
            </button>
            <button
              @click="trocarLoja"
              class="btn-trocar-loja"
              title="Trocar loja"
            >
              <i class="fas fa-exchange-alt"></i>
              Trocar Loja
            </button>
          </div>
        </div>
      </div>

      <!-- Barra de Filtros e Busca -->
      <div class="filters-bar">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="filtro"
            placeholder="Buscar por nome ou matrícula..."
            class="search-field"
          />
          <span v-if="filtro" @click="filtro = ''" class="clear-search">
            <i class="fas fa-times"></i>
          </span>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-filter"></i>
            Filtro:
          </label>
          <select
            v-model="filtroLoja"
            @change="carregarUsuarios"
            class="filter-select"
          >
            <option value="loja">Apenas desta loja</option>
            <option value="todos">Todos os usuários</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-calendar-alt"></i>
            Data:
          </label>
          <select
            v-model="dataFiltro"
            @change="carregarUsuarios"
            class="filter-select"
          >
            <option value="">Todas as datas</option>
            <option v-for="data in datasAuditoria" :key="data.timestamp" :value="data.data">
              {{ data.dataFormatada }}
            </option>
          </select>
        </div>
      </div>

      <!-- Cards de Estatísticas -->
      <div class="metrics-grid">
        <div class="metric-card primary">
          <div class="metric-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ usuarios.length }}</span>
            <span class="metric-label">Colaboradores Ativos</span>
          </div>
        </div>

        <div class="metric-card success">
          <div class="metric-icon">
            <i class="fas fa-store-alt"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ lojaStore.codigoLojaAtual }}</span>
            <span class="metric-label">Loja Selecionada</span>
          </div>
        </div>

        <div class="metric-card info">
          <div class="metric-icon">
            <i class="fas fa-clipboard-check"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ totalItensLidos }}</span>
            <span class="metric-label">Itens Lidos Total</span>
          </div>
        </div>

        <div class="metric-card warning">
          <div class="metric-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ mediaItensPorUsuario }}</span>
            <span class="metric-label">Média por Colaborador</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="carregando" class="loading-state">
        <div class="loader"></div>
        <p>Carregando colaboradores da loja {{ lojaStore.codigoLojaAtual }}...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="erro" class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h3>Ops! Algo deu errado</h3>
        <p>{{ erro }}</p>
        <button @click="carregarUsuarios" class="btn-retry">
          <i class="fas fa-redo-alt"></i> Tentar Novamente
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="usuariosFiltrados.length === 0" class="empty-state">
        <div class="empty-illustration">
          <i class="fas fa-user-slash"></i>
        </div>
        <h3>Nenhum colaborador encontrado</h3>
        <p v-if="filtro">Tente ajustar os filtros de busca</p>
        <p v-else>Faça o upload de uma planilha para esta loja para começar</p>
        <button
          v-if="filtro"
          @click="limparFiltros"
          class="btn-clear-filter"
        >
          <i class="fas fa-times"></i> Limpar Filtros
        </button>
        <router-link v-else to="/upload" class="btn-upload">
          <i class="fas fa-cloud-upload-alt"></i> Fazer Upload
        </router-link>
      </div>

      <!-- Grid de Usuários -->
      <div v-else class="users-grid">
        <div
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id"
          class="user-card"
          @click="verDetalhes(usuario.id)"
        >
          <div class="user-avatar-section">
            <div class="avatar-circle">
              <img
                v-if="usuario.foto"
                :src="usuario.foto"
                alt="Avatar"
                class="avatar-image"
              />
              <span v-else class="avatar-initials">{{ usuario.iniciais }}</span>
            </div>
            <div class="user-status online"></div>
          </div>

          <div class="user-details">
            <h3 class="user-name">{{ usuario.nome }}</h3>
            <p class="user-matricula">
              <i class="fas fa-id-badge"></i> {{ usuario.id }}
            </p>
            <p class="user-loja">
              <i class="fas fa-store"></i>
              <span v-if="filtroLoja === 'todos'">{{ usuario.lojaCompleta }} ({{ usuario.loja }})</span>
              <span v-else>{{ usuario.loja }}</span>
            </p>
          </div>

          <div class="user-metrics">
            <div class="metric-item">
              <i class="fas fa-clipboard-list"></i>
              <div class="metric-content">
                <span class="metric-number">{{ usuario.contador }}</span>
                <span class="metric-text">Itens Lidos</span>
              </div>
            </div>
            <div class="metric-item">
              <i class="fas fa-calendar-check"></i>
              <div class="metric-content">
                <span class="metric-number">{{ usuario.totalAuditorias }}</span>
                <span class="metric-text">Auditorias</span>
              </div>
            </div>
          </div>

          <div class="user-last-activity" v-if="usuario.ultimaAuditoria">
            <p class="activity-label">
              <i class="fas fa-clock"></i>
              Última atividade:
            </p>
            <p class="activity-date">{{ formatarData(usuario.ultimaAuditoria) }}</p>
          </div>

          <div class="card-footer">
            <router-link
              :to="'/perfil/' + usuario.id"
              class="btn-details"
              @click.stop
            >
              <i class="fas fa-eye"></i>
              Ver Perfil Completo
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLojaStore } from "@/store/lojaStore";
import axios from "axios";

const router = useRouter();
const lojaStore = useLojaStore();

const usuarios = ref([]);
const filtro = ref("");
const carregando = ref(false);
const erro = ref("");
const dataFiltro = ref("");
const filtroLoja = ref("loja");
const datasAuditoria = ref([]);

onMounted(async () => {
  // Carregar loja do localStorage se existir
  lojaStore.carregarLoja();

  // Se tem loja selecionada, carregar dados
  if (lojaStore.isLojaSelected) {
    await carregarDatasAuditoria();
    await carregarUsuarios();
  }
});

// Watch para recarregar dados quando loja mudar
watch(() => lojaStore.lojaSelecionada, async (novaLoja) => {
  if (novaLoja) {
    await carregarDatasAuditoria();
    await carregarUsuarios();
  } else {
    usuarios.value = [];
    datasAuditoria.value = [];
  }
});

// Selecionar loja
const selecionarLoja = async (loja) => {
  const sucesso = await lojaStore.selecionarLoja(loja);
  if (sucesso) {
    await carregarDatasAuditoria();
    await carregarUsuarios();
  }
};

// Trocar loja
const trocarLoja = () => {
  lojaStore.limparLoja();
  usuarios.value = [];
  datasAuditoria.value = [];
};

// Carregar datas de auditoria disponíveis
const carregarDatasAuditoria = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/datas-auditoria", {
      headers: {
        'x-loja': lojaStore.codigoLojaAtual
      }
    });
    datasAuditoria.value = data;
  } catch (error) {
    console.error("Erro ao carregar datas:", error);
  }
};

// Carregar usuários da loja selecionada
const carregarUsuarios = async () => {
  if (!lojaStore.isLojaSelected) return;

  try {
    carregando.value = true;
    erro.value = "";

    const params = {};
    if (dataFiltro.value) {
      params.dataAuditoria = dataFiltro.value;
    }
    if (filtroLoja.value === 'todos') {
      params.todos = 'true';
    }

    const { data } = await axios.get("http://localhost:3000/usuarios", {
      params,
      headers: {
        'x-loja': lojaStore.codigoLojaAtual
      }
    });

    usuarios.value = data.map((user) => ({
      id: user.id,
      nome: user.nome,
      contador: user.contador || 0,
      iniciais: user.iniciais || obterIniciais(user.nome),
      loja: user.loja || lojaStore.codigoLojaAtual,
      lojaCompleta: user.lojaCompleta || lojaStore.nomeLojaAtual,
      foto: user.foto,
      ultimaAuditoria: user.ultimaAuditoria,
      totalAuditorias: user.totalAuditorias || 0,
    }));

    console.log(`✅ ${usuarios.value.length} usuários carregados da loja ${lojaStore.codigoLojaAtual}`);
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    erro.value = error.response?.data?.erro || "Erro ao carregar dados do servidor";
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
  if (!dataString) return "-";
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
};

// Navegar para detalhes do usuário
const verDetalhes = (id) => {
  router.push(`/perfil/${id}?loja=${lojaStore.codigoLojaAtual}`);
};

// Limpar filtros
const limparFiltros = () => {
  filtro.value = "";
};

// Computed: Usuários filtrados
const usuariosFiltrados = computed(() => {
  let resultado = usuarios.value;

  // Filtro por nome ou matrícula
  if (filtro.value) {
    const filtroLower = filtro.value.toLowerCase();
    resultado = resultado.filter(
      (u) =>
        u.nome.toLowerCase().includes(filtroLower) ||
        u.id.toLowerCase().includes(filtroLower)
    );
  }

  return resultado;
});

// Computed: Total de itens lidos
const totalItensLidos = computed(() =>
  usuarios.value.reduce((total, usuario) => total + usuario.contador, 0)
);

// Computed: Média de itens por usuário
const mediaItensPorUsuario = computed(() =>
  usuarios.value.length
    ? Math.round(totalItensLidos.value / usuarios.value.length)
    : 0
);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.usuarios-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  font-family: "Inter", sans-serif;
}

/* ===== SELEÇÃO DE LOJA ===== */
.loja-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.loja-selection-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 100%;
}

.loja-icon {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 2rem;
}

.loja-selection-content h2 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.loja-selection-content p {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 3rem;
}

.lojas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.loja-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.loja-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.loja-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.loja-image {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e2e8f0;
}

.loja-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loja-info h3 {
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.loja-info p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.loja-codigo {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* ===== HEADER ===== */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-text h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 300;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-icon-refresh, .btn-trocar-loja {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  font-weight: 500;
}

.btn-icon-refresh {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.2rem;
}

.btn-trocar-loja {
  padding: 0.75rem 1.5rem;
  gap: 0.5rem;
}

.btn-icon-refresh:hover, .btn-trocar-loja:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-icon-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== FILTROS ===== */
.filters-bar {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
}

.search-field {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
}

.search-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-search:hover {
  color: #ef4444;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label {
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* ===== MÉTRICAS ===== */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 15px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.1;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.metric-card:hover::before {
  transform: scale(1.5);
}

.metric-card.primary {
  border-left: 4px solid #667eea;
}
.metric-card.primary .metric-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.metric-card.primary::before {
  background: #667eea;
}

.metric-card.success {
  border-left: 4px solid #10b981;
}
.metric-card.success .metric-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
.metric-card.success::before {
  background: #10b981;
}

.metric-card.info {
  border-left: 4px solid #3b82f6;
}
.metric-card.info .metric-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}
.metric-card.info::before {
  background: #3b82f6;
}

.metric-card.warning {
  border-left: 4px solid #f59e0b;
}
.metric-card.warning .metric-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}
.metric-card.warning::before {
  background: #f59e0b;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.metric-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.metric-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

/* ===== LOADING ===== */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.loading-state p {
  color: #64748b;
  font-size: 1.1rem;
}

/* ===== ERROR STATE ===== */
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.error-state h3 {
  color: #1e293b;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.error-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-retry {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.empty-illustration {
  font-size: 5rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: #1e293b;
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-clear-filter,
.btn-upload {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1rem;
}

.btn-clear-filter:hover,
.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* ===== GRID DE USUÁRIOS ===== */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.user-card:hover::before {
  transform: scaleX(1);
}

.user-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.user-avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: white;
  font-size: 2rem;
  font-weight: 700;
}

.user-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid white;
}

.user-status.online {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.user-details {
  text-align: center;
  margin-bottom: 1.5rem;
}

.user-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.user-matricula, .user-loja {
  color: #64748b;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.user-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metric-item i {
  color: #667eea;
  font-size: 1.25rem;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.metric-text {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.user-last-activity {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.activity-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.activity-date {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.btn-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-size: 0.95rem;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* ===== RESPONSIVO ===== */
@media (max-width: 768px) {
  .usuarios-container {
    padding: 1rem;
  }

  .loja-selection-content {
    padding: 2rem;
  }

  .lojas-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .header-text h1 {
    font-size: 1.75rem;
  }

  .header-text p {
    font-size: 0.95rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    min-width: 100%;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select {
    min-width: 100%;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  .user-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-icon-refresh {
    width: 45px;
    height: 45px;
  }

  .avatar-circle {
    width: 80px;
    height: 80px;
  }

  .avatar-initials {
    font-size: 1.5rem;
  }

  .user-name {
    font-size: 1.2rem;
  }
}
</style>