<template>
  <div class="lista-usuarios-container">
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

    <!-- Conteúdo Principal -->
    <div v-else>
      <!-- Header com Loja Selecionada -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-left">
            <h1 class="header-title">
              <i class="fas fa-users"></i>
              Colaboradores - {{ lojaStore.nomeLojaAtual }}
            </h1>
            <p class="header-subtitle">
              Loja {{ lojaStore.codigoLojaAtual }} • {{ usuarios.length }} colaboradores ativos
            </p>
          </div>
          <div class="header-actions">
            <button @click="carregarUsuarios" class="btn-refresh" :disabled="carregando">
              <i class="fas fa-sync-alt" :class="{ spinning: carregando }"></i>
              Atualizar
            </button>
            <button @click="trocarLoja" class="btn-change-store">
              <i class="fas fa-exchange-alt"></i>
              Trocar Loja
            </button>
          </div>
        </div>
      </div>

      <!-- Métricas Rápidas -->
      <div class="metrics-grid">
        <div class="metric-card primary">
          <div class="metric-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ usuarios.length }}</span>
            <span class="metric-label">Colaboradores</span>
          </div>
        </div>
        <div class="metric-card success">
          <div class="metric-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ usuariosComMeta }}</span>
            <span class="metric-label">Meta Batida</span>
          </div>
        </div>
        <div class="metric-card info">
          <div class="metric-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ mediaItens }}</span>
            <span class="metric-label">Média Itens</span>
          </div>
        </div>
        <div class="metric-card warning">
          <div class="metric-icon">
            <i class="fas fa-crown"></i>
          </div>
          <div class="metric-data">
            <span class="metric-value">{{ maiorNivel }}</span>
            <span class="metric-label">Maior Nível</span>
          </div>
        </div>
      </div>

      <!-- Filtros Avançados -->
      <div class="filters-section">
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="filtro"
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            class="search-input"
          />
          <button v-if="filtro" @click="filtro = ''" class="clear-search">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="filter-tabs">
          <button
            v-for="tab in filtroTabs"
            :key="tab.id"
            @click="filtroAtivo = tab.id"
            :class="['filter-tab', { active: filtroAtivo === tab.id }]"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
            <span class="tab-count">{{ getTabCount(tab.id) }}</span>
          </button>
        </div>

        <div class="filter-options">
          <div class="sort-container">
            <label>Ordenar por:</label>
            <select v-model="ordenacao" class="sort-select">
              <option value="nivel">Nível (maior)</option>
              <option value="contador">Itens lidos</option>
              <option value="nome">Nome</option>
              <option value="recente">Mais recente</option>
            </select>
          </div>

          <div class="view-toggle">
            <button
              @click="visualizacao = 'grid'"
              :class="['view-btn', { active: visualizacao === 'grid' }]"
            >
              <i class="fas fa-th-large"></i>
            </button>
            <button
              @click="visualizacao = 'lista'"
              :class="['view-btn', { active: visualizacao === 'lista' }]"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="carregando" class="loading-state">
        <div class="loader"></div>
        <p>Carregando colaboradores...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="erro" class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h3>Erro ao carregar dados</h3>
        <p>{{ erro }}</p>
        <button @click="carregarUsuarios" class="btn-retry">
          <i class="fas fa-redo-alt"></i> Tentar Novamente
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="usuariosFiltrados.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-users-slash"></i>
        </div>
        <h3>Nenhum colaborador encontrado</h3>
        <p v-if="filtro">Tente ajustar os filtros de busca</p>
        <p v-else>Nenhum colaborador cadastrado para esta loja</p>
        <button v-if="filtro" @click="limparFiltros" class="btn-clear">
          <i class="fas fa-times"></i> Limpar Filtros
        </button>
      </div>

      <!-- Lista/Grid de Usuários -->
      <div v-else :class="['usuarios-container', visualizacao]">
        <div
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id"
          :class="['usuario-card', visualizacao]"
          @click="irParaPerfil(usuario)"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="usuario-avatar">
              <img v-if="usuario.foto" :src="usuario.foto" :alt="usuario.nome" />
              <div v-else class="avatar-placeholder">
                {{ usuario.iniciais }}
              </div>

              <!-- Nível Badge -->
              <div class="nivel-badge">
                <span class="nivel-numero">{{ usuario.nivel }}</span>
              </div>
            </div>

            <div class="usuario-info">
              <h3 class="usuario-nome">{{ usuario.nome }}</h3>
              <p class="usuario-matricula">{{ usuario.id }}</p>
              <p class="usuario-titulo">{{ usuario.titulo }}</p>
            </div>

            <div class="usuario-stats">
              <div class="ranking-position">
                #{{ usuario.posicaoRanking }}
              </div>
            </div>
          </div>

          <!-- Card Stats -->
          <div class="card-stats">
            <div class="stat-item nivel">
              <i class="fas fa-level-up-alt"></i>
              <div class="stat-content">
                <span class="stat-number">{{ usuario.nivel }}</span>
                <span class="stat-label">Nível</span>
              </div>
            </div>

            <div class="stat-item itens">
              <i class="fas fa-clipboard-list"></i>
              <div class="stat-content">
                <span class="stat-number">{{ usuario.contador }}</span>
                <span class="stat-label">Itens</span>
              </div>
            </div>

            <div class="stat-item xp">
              <i class="fas fa-star"></i>
              <div class="stat-content">
                <span class="stat-number">{{ usuario.xpTotal }}</span>
                <span class="stat-label">XP</span>
              </div>
            </div>

            <div class="stat-item auditorias">
              <i class="fas fa-check-circle"></i>
              <div class="stat-content">
                <span class="stat-number">{{ usuario.totalAuditorias }}</span>
                <span class="stat-label">Auditorias</span>
              </div>
            </div>
          </div>

          <!-- XP Progress Bar -->
          <div class="xp-progress">
            <div class="xp-bar">
              <div
                class="xp-fill"
                :style="{ width: `${usuario.progressoXp}%` }"
              ></div>
            </div>
            <span class="xp-text">
              {{ usuario.xpAtual % 100 }}/100 XP para nível {{ usuario.nivel + 1 }}
            </span>
          </div>

          <!-- Card Actions -->
          <div class="card-actions">
            <button class="action-btn primary" @click.stop="irParaPerfil(usuario)">
              <i class="fas fa-eye"></i>
              Ver Perfil Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from "vue-router";
import { useLojaStore } from "@/store/lojaStore";
import { useNivelStore } from "@/store/nivelStore";
import axios from "axios";

export default {
  name: "ListaUsuarios",
  setup() {
    const router = useRouter();
    const lojaStore = useLojaStore();
    const nivelStore = useNivelStore();

    // Reactive data
    const usuarios = ref([]);
    const filtro = ref("");
    const carregando = ref(false);
    const erro = ref("");
    const filtroAtivo = ref("todos");
    const ordenacao = ref("nivel");
    const visualizacao = ref("grid");

    // Filter tabs
    const filtroTabs = ref([
      { id: "todos", label: "Todos", icon: "fas fa-users" },
      { id: "meta", label: "Meta Batida", icon: "fas fa-trophy" },
      { id: "elite", label: "Elite", icon: "fas fa-crown" },
      { id: "novatos", label: "Novatos", icon: "fas fa-seedling" },
    ]);

    const irParaPerfil = (usuario) => {
      router.push({
        name: "PerfilUsuario",
        params: { id: usuario.id },
      });
    };

    const selecionarLoja = async (loja) => {
      const sucesso = await lojaStore.selecionarLoja(loja);
      if (sucesso) {
        await carregarUsuarios();
      }
    };

    const trocarLoja = () => {
      lojaStore.limparLoja();
      usuarios.value = [];
    };

    const limparFiltros = () => {
      filtro.value = "";
      filtroAtivo.value = "todos";
    };

    return {
      router,
      lojaStore,
      nivelStore,
      usuarios,
      filtro,
      carregando,
      erro,
      filtroAtivo,
      ordenacao,
      visualizacao,
      filtroTabs,
      irParaPerfil,
      selecionarLoja,
      trocarLoja,
      limparFiltros,
    };
  },
  computed: {
    usuariosFiltrados() {
      let filtrados = [...this.usuarios];

      // Filtro de texto
      if (this.filtro) {
        const termo = this.filtro.toLowerCase();
        filtrados = filtrados.filter(
          (usuario) =>
            usuario.nome.toLowerCase().includes(termo) ||
            usuario.id.toLowerCase().includes(termo)
        );
      }

      // Filtros por categoria
      switch (this.filtroAtivo) {
        case "meta":
          filtrados = filtrados.filter((usuario) => usuario.contador >= 500);
          break;
        case "elite":
          filtrados = filtrados.filter((usuario) => usuario.nivel >= 10);
          break;
        case "novatos":
          filtrados = filtrados.filter((usuario) => usuario.nivel <= 3);
          break;
      }

      // Ordenação
      switch (this.ordenacao) {
        case "nivel":
          filtrados.sort((a, b) => b.nivel - a.nivel);
          break;
        case "contador":
          filtrados.sort((a, b) => b.contador - a.contador);
          break;
        case "nome":
          filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
          break;
        case "recente":
          filtrados.sort((a, b) => (b.ultimaAtividade || 0) - (a.ultimaAtividade || 0));
          break;
      }

      return filtrados;
    },

    usuariosComMeta() {
      return this.usuarios.filter(u => u.contador >= 500).length;
    },

    mediaItens() {
      if (this.usuarios.length === 0) return 0;
      const total = this.usuarios.reduce((sum, u) => sum + u.contador, 0);
      return Math.round(total / this.usuarios.length);
    },

    maiorNivel() {
      if (this.usuarios.length === 0) return 0;
      return Math.max(...this.usuarios.map(u => u.nivel));
    },

    getTabCount() {
      return (tabId) => {
        switch (tabId) {
          case "todos":
            return this.usuarios.length;
          case "meta":
            return this.usuariosComMeta;
          case "elite":
            return this.usuarios.filter(u => u.nivel >= 10).length;
          case "novatos":
            return this.usuarios.filter(u => u.nivel <= 3).length;
          default:
            return 0;
        }
      };
    },
  },
  async mounted() {
    // Carregar loja do localStorage se existir
    this.lojaStore.carregarLoja();

    // Inicializar nivel store
    await this.nivelStore.carregarUsuarios();

    // Se tem loja selecionada, carregar dados
    if (this.lojaStore.isLojaSelected) {
      await this.carregarUsuarios();
    }
  },

  watch: {
    // Watch para recarregar dados quando loja mudar
    'lojaStore.lojaSelecionada': async function(novaLoja) {
      if (novaLoja) {
        await this.carregarUsuarios();
      } else {
        this.usuarios = [];
      }
    }
  },

  methods: {
    async carregarUsuarios() {
      if (!this.lojaStore.isLojaSelected) return;

      try {
        this.carregando = true;
        this.erro = "";

        const response = await axios.get("http://localhost:3000/usuarios", {
          headers: {
            'x-loja': this.lojaStore.codigoLojaAtual
          }
        });

        const usuariosData = response.data.map((user) => {
          const xpConquistas = this.nivelStore.calcularXpConquistas(user);
          const xpTotal = (user.contador || 0) + xpConquistas;
          const nivel = this.nivelStore.calcularNivel(xpTotal);
          const titulo = this.nivelStore.obterTitulo(nivel);
          const progressoXp = xpTotal % 100;

          return {
            ...user,
            iniciais: this.obterIniciais(user.nome),
            xpConquistas,
            xpTotal,
            nivel,
            titulo,
            progressoXp,
            xpAtual: xpTotal,
            posicaoRanking: 1, // Será calculado depois
            totalAuditorias: user.totalAuditorias || Math.floor(Math.random() * 20) + 1,
          };
        });

        // Calcular posições no ranking
        const usuariosOrdenados = [...usuariosData].sort((a, b) => b.xpTotal - a.xpTotal);
        usuariosOrdenados.forEach((usuario, index) => {
          const usuarioOriginal = usuariosData.find(u => u.id === usuario.id);
          if (usuarioOriginal) {
            usuarioOriginal.posicaoRanking = index + 1;
          }
        });

        this.usuarios = usuariosData;

        console.log(`✅ ${this.usuarios.length} usuários carregados da loja ${this.lojaStore.codigoLojaAtual}`);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        this.erro = error.response?.data?.erro || "Erro ao carregar dados do servidor";
      } finally {
        this.carregando = false;
      }
    },

    obterIniciais(nome) {
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
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.lista-usuarios-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  font-family: 'Inter', sans-serif;
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
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-left {
  flex: 1;
}

.header-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 300;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-refresh,
.btn-change-store {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.btn-refresh:hover,
.btn-change-store:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-refresh:disabled {
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

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.metric-card.primary {
  border-left: 4px solid #667eea;
}
.metric-card.primary .metric-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.metric-card.success {
  border-left: 4px solid #10b981;
}
.metric-card.success .metric-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.metric-card.info {
  border-left: 4px solid #3b82f6;
}
.metric-card.info .metric-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.metric-card.warning {
  border-left: 4px solid #f59e0b;
}
.metric-card.warning .metric-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

/* ===== FILTROS ===== */
.filters-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.search-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto 2rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-search:hover {
  color: #ef4444;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-tab {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #64748b;
}

.filter-tab:hover {
  border-color: #667eea;
  background: #f1f5f9;
}

.filter-tab.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

.filter-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-container label {
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.sort-select:focus {
  outline: none;
  border-color: #667eea;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: #f8fafc;
  padding: 0.25rem;
  border-radius: 8px;
}

.view-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.view-btn:hover {
  background: #e2e8f0;
}

.view-btn.active {
  background: #667eea;
  color: white;
}

/* ===== ESTADOS DE LOADING/ERROR ===== */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin: 2rem 0;
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

.error-icon, .empty-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.empty-icon {
  color: #cbd5e1;
}

.error-state h3, .empty-state h3 {
  color: #1e293b;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.error-state p, .empty-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-retry, .btn-clear {
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

.btn-retry:hover, .btn-clear:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* ===== CONTAINER DE USUÁRIOS ===== */
.usuarios-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.usuarios-container.lista {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== CARDS DE USUÁRIO ===== */
.usuario-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.usuario-card::before {
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

.usuario-card:hover::before {
  transform: scaleX(1);
}

.usuario-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.usuario-card.lista {
  padding: 1.5rem;
  border-radius: 15px;
}

.usuario-card.lista .card-header {
  flex-direction: row;
  align-items: center;
}

.usuario-card.lista .card-stats {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.usuario-card.lista .stat-item {
  flex-direction: row;
  gap: 0.5rem;
}

/* ===== HEADER DO CARD ===== */
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
}

.usuario-avatar {
  position: relative;
  margin-bottom: 1rem;
}

.usuario-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2rem;
  border: 4px solid white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.nivel-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ffd43b 0%, #ffb800 100%);
  color: #000;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  font-weight: 900;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(255, 212, 59, 0.4);
}

.usuario-info {
  flex: 1;
}

.usuario-nome {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.usuario-matricula {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.usuario-titulo {
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.usuario-stats {
  margin-left: auto;
}

.ranking-position {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

/* ===== ESTATÍSTICAS DO CARD ===== */
.card-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.stat-item i {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.stat-item.nivel i { color: #8b5cf6; }
.stat-item.itens i { color: #10b981; }
.stat-item.xp i { color: #ffd43b; }
.stat-item.auditorias i { color: #3b82f6; }

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

/* ===== BARRA DE XP ===== */
.xp-progress {
  margin-bottom: 1.5rem;
}

.xp-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd43b 0%, #ffb800 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.xp-text {
  font-size: 0.8rem;
  color: #64748b;
  text-align: center;
  font-weight: 500;
}

/* ===== AÇÕES DO CARD ===== */
.card-actions {
  text-align: center;
}

.action-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

/* ===== RESPONSIVO ===== */
@media (max-width: 1024px) {
  .usuarios-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-options {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .lista-usuarios-container {
    padding: 1rem;
  }

  .header-title {
    font-size: 1.75rem;
  }

  .usuarios-container.grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .filter-options {
    flex-direction: column;
    align-items: stretch;
  }

  .card-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .usuario-avatar img,
  .avatar-placeholder {
    width: 80px;
    height: 80px;
  }

  .nivel-badge {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }

  .card-stats {
    grid-template-columns: 1fr;
  }
}

</style>
