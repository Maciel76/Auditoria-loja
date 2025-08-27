<template>
  <div class="lista-usuarios-container">
    <!-- Header -->
    <div class="header-section">
      <h1 class="header-title"><span class="icon">👥</span> Colaboradores</h1>
      <p class="header-subtitle">
        Selecione um colaborador para visualizar o perfil completo
      </p>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="search-container">
        <span class="icon">🔍</span>
        <input
          v-model="filtro"
          type="text"
          placeholder="Buscar colaborador..."
          class="search-input"
        />
      </div>

      <div class="filter-badges">
        <span class="filter-label">Filtrar por:</span>
        <button
          v-for="filtro in filtrosDisponiveis"
          :key="filtro.id"
          @click="toggleFiltro(filtro.id)"
          :class="[
            'filter-badge',
            { active: filtrosAtivos.includes(filtro.id) },
          ]"
        >
          {{ filtro.icone }} {{ filtro.label }}
        </button>
      </div>
    </div>

    <!-- Lista de Usuários -->
    <div class="usuarios-grid">
      <div
        v-for="usuario in usuariosFiltrados"
        :key="usuario.id"
        class="usuario-card"
        @click="irParaPerfil(usuario)"
      >
        <div class="card-header">
          <div class="usuario-avatar">
            <img v-if="usuario.foto" :src="usuario.foto" :alt="usuario.nome" />
            <div v-else class="avatar-placeholder">
              {{ usuario.iniciais }}
            </div>

            <!-- Badges -->
            <div class="badges-container">
              <span v-if="usuario.contador >= 500" class="badge premium"
                >⭐</span
              >
              <span v-if="usuario.contador > mediaItens" class="badge destaque"
                >🚀</span
              >
            </div>
          </div>

          <div class="usuario-info">
            <h3 class="usuario-nome">{{ usuario.nome }}</h3>
            <p class="usuario-matricula">Matrícula: {{ usuario.id }}</p>
          </div>
        </div>

        <div class="card-stats">
          <div class="stat">
            <span class="stat-number">{{ usuario.contador }}</span>
            <span class="stat-label">Itens lidos</span>
          </div>

          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width: Math.min(100, (usuario.contador / 500) * 100) + '%',
                }"
                :class="{ complete: usuario.contador >= 500 }"
              ></div>
            </div>
            <span class="progress-text"
              >{{
                Math.min(100, Math.round((usuario.contador / 500) * 100))
              }}%</span
            >
          </div>
        </div>

        <div class="card-actions">
          <button class="action-btn" @click.stop="irParaPerfil(usuario)">
            <span class="icon">👀</span> Ver Perfil
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="usuariosFiltrados.length === 0" class="empty-state">
      <span class="icon">🔍</span>
      <h3>Nenhum colaborador encontrado</h3>
      <p>Tente ajustar os filtros de busca</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "ListaUsuarios",
  setup() {
    const router = useRouter();

    const irParaPerfil = (usuario) => {
      router.push({
        name: "PerfilUsuario",
        params: { id: usuario.id },
      });
    };

    return {
      irParaPerfil,
    };
  },
  data() {
    return {
      usuarios: [],
      filtro: "",
      filtrosAtivos: [],
      filtrosDisponiveis: [
        { id: "meta", label: "Meta Batida", icone: "⭐" },
        { id: "destaque", label: "Destaque", icone: "🚀" },
        { id: "ativos", label: "Mais Ativos", icone: "🔥" },
      ],
      mediaItens: 0,
    };
  },
  computed: {
    usuariosFiltrados() {
      let filtrados = this.usuarios;

      // Filtro de texto
      if (this.filtro) {
        const termo = this.filtro.toLowerCase();
        filtrados = filtrados.filter(
          (usuario) =>
            usuario.nome.toLowerCase().includes(termo) ||
            usuario.id.toLowerCase().includes(termo)
        );
      }

      // Filtros ativos
      if (this.filtrosAtivos.includes("meta")) {
        filtrados = filtrados.filter((usuario) => usuario.contador >= 500);
      }

      if (this.filtrosAtivos.includes("destaque")) {
        filtrados = filtrados.filter(
          (usuario) => usuario.contador > this.mediaItens
        );
      }

      if (this.filtrosAtivos.includes("ativos")) {
        filtrados = filtrados
          .sort((a, b) => b.contador - a.contador)
          .slice(0, 10);
      }

      return filtrados;
    },
  },
  mounted() {
    this.carregarUsuarios();
  },
  methods: {
    async carregarUsuarios() {
      try {
        const response = await fetch("http://localhost:3000/usuarios");
        if (response.ok) {
          this.usuarios = await response.json();

          // Calcular média
          const total = this.usuarios.reduce(
            (sum, usuario) => sum + usuario.contador,
            0
          );
          this.mediaItens =
            this.usuarios.length > 0
              ? Math.round(total / this.usuarios.length)
              : 0;

          // Adicionar iniciais
          this.usuarios.forEach((usuario) => {
            usuario.iniciais = this.obterIniciais(usuario.nome);
          });
        } else {
          console.error("Erro ao carregar usuários:", response.status);
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    },

    obterIniciais(nome) {
      if (!nome) return "??";
      return nome
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },

    toggleFiltro(filtroId) {
      const index = this.filtrosAtivos.indexOf(filtroId);
      if (index > -1) {
        this.filtrosAtivos.splice(index, 1);
      } else {
        this.filtrosAtivos.push(filtroId);
      }
    },
  },
};
</script>

<style scoped>
.lista-usuarios-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
  font-family: "Poppins", sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.header-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* Filtros */
.filters-section {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.search-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto 20px;
}

.search-container .icon {
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

.filter-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.filter-label {
  font-weight: 600;
  color: #2c3e50;
}

.filter-badge {
  padding: 8px 15px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-badge.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Grid de Usuários */
.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.usuario-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.usuario-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.usuario-avatar {
  position: relative;
}

.usuario-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
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
}

.badges-container {
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.badge {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.badge.premium {
  background: #ffd43b;
  color: #000;
}

.badge.destaque {
  background: #ff6b6b;
  color: white;
}

.usuario-info {
  flex: 1;
}

.usuario-nome {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.usuario-matricula {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.card-stats {
  margin-bottom: 15px;
}

.stat {
  text-align: center;
  margin-bottom: 10px;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #51cf66;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-fill.complete {
  background: #ffd43b;
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  min-width: 40px;
}

.card-actions {
  text-align: center;
}

.action-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.empty-state .icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

/* Responsivo */
@media (max-width: 768px) {
  .usuarios-grid {
    grid-template-columns: 1fr;
  }

  .filter-badges {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-label {
    margin-bottom: 10px;
  }
}

.icon {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
