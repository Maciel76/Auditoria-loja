<template>
  <div class="lu-page">
    <!-- Seletor de Loja -->
    <div v-if="!lojaStore.isLojaSelected" class="lu-store-select">
      <div class="lu-store-select__card">
        <div class="lu-store-select__icon">
          <i class="fas fa-store"></i>
        </div>
        <h2 class="lu-store-select__title">Selecione uma Loja</h2>
        <p class="lu-store-select__desc">
          Escolha a loja para visualizar os colaboradores.
        </p>

        <div class="lu-store-grid">
          <div
            v-for="loja in lojaStore.lojas"
            :key="loja.codigo"
            class="lu-store-item"
            @click="selecionarLoja(loja)"
          >
            <div class="lu-store-item__img">
              <img :src="loja.imagem" :alt="loja.nome" />
            </div>
            <h3 class="lu-store-item__name">{{ loja.nome }}</h3>
            <p class="lu-store-item__city">
              <i class="fas fa-map-marker-alt"></i> {{ loja.cidade }}
            </p>
            <span class="lu-store-item__code">{{ loja.codigo }}</span>
          </div>
        </div>

        <div v-if="lojaStore.error" class="lu-alert lu-alert--error">
          <i class="fas fa-exclamation-triangle"></i> {{ lojaStore.error }}
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else class="lu-main">
      <!-- Header -->
      <header class="lu-header">
        <!-- Círculos decorativos -->
        <div class="lu-header__circle lu-header__circle--1"></div>
        <div class="lu-header__circle lu-header__circle--2"></div>
        <div class="lu-header__circle lu-header__circle--3"></div>
        <div class="lu-header__circle lu-header__circle--4"></div>
        <div class="lu-header__circle lu-header__circle--5"></div>
        <div class="lu-header__circle lu-header__circle--6"></div>

        <div class="lu-header__content">
          <div class="lu-header__left">
            <div class="lu-header__img">
              <img
                :src="lojaStore.imagemLojaAtual"
                :alt="lojaStore.nomeLojaAtual"
                @error="$event.target.src = '/images/lojas/default.jpg'"
              />
            </div>
            <div class="lu-header__text">
              <h1>
                <i class="fas fa-users-cog"></i>
                Colaboradores -
                {{ extrairNomeSimples(lojaStore.nomeLojaAtual) }}
              </h1>
              <p>
                Gestão de colaboradores da loja
                {{ lojaStore.codigoLojaAtual }} &middot;
                {{ usuarios.length }} ativos
              </p>
            </div>
          </div>
          <div class="lu-header__actions">
            <button
              @click="carregarUsuarios"
              class="lu-header__btn lu-header__btn--icon"
              title="Atualizar dados"
              :disabled="carregando"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': carregando }"></i>
            </button>
            <button @click="trocarLoja" class="lu-header__btn">
              <i class="fas fa-exchange-alt"></i>
              <span>Trocar Loja</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Métricas -->
      <section class="lu-metrics">
        <div class="lu-metric">
          <span class="lu-metric__value">{{ usuarios.length }}</span>
          <span class="lu-metric__label">Colaboradores</span>
        </div>
        <div class="lu-metric">
          <span class="lu-metric__value">{{ mediaItens }}</span>
          <span class="lu-metric__label">Média Itens</span>
        </div>
        <div class="lu-metric">
          <span class="lu-metric__value">{{ maiorNivel }}</span>
          <span class="lu-metric__label">Maior Nível</span>
        </div>
        <div class="lu-metric">
          <span class="lu-metric__value">{{ totalConquistas }}</span>
          <span class="lu-metric__label">Conquistas</span>
        </div>
      </section>

      <!-- Toolbar -->
      <section class="lu-toolbar">
        <div class="lu-search">
          <i class="fas fa-search lu-search__icon"></i>
          <input
            v-model="filtro"
            type="text"
            placeholder="Buscar nome ou matrícula..."
            class="lu-search__input"
          />
          <button v-if="filtro" @click="filtro = ''" class="lu-search__clear">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="lu-filters">
          <button
            v-for="tab in filtroTabs"
            :key="tab.id"
            @click="filtroAtivo = tab.id"
            :class="['lu-chip', { 'lu-chip--active': filtroAtivo === tab.id }]"
          >
            {{ tab.label }}
            <span class="lu-chip__count">{{ getTabCount(tab.id) }}</span>
          </button>
        </div>

        <div class="lu-toolbar__right">
          <select v-model="ordenacao" class="lu-select">
            <option value="ranking">Ranking</option>
            <option value="nivel">Nível</option>
            <option value="xp">XP Total</option>
            <option value="contador">Itens lidos</option>
            <option value="nome">Nome</option>
          </select>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="carregando" class="lu-state">
        <div class="lu-spinner"></div>
        <p>Carregando colaboradores...</p>
      </div>

      <!-- Error -->
      <div v-else-if="erro" class="lu-state lu-state--error">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Erro ao carregar dados</h3>
        <p>{{ erro }}</p>
        <button @click="carregarUsuarios" class="lu-btn lu-btn--primary">
          <i class="fas fa-redo-alt"></i> Tentar Novamente
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="usuariosFiltrados.length === 0" class="lu-state">
        <i class="fas fa-users-slash"></i>
        <h3>Nenhum colaborador encontrado</h3>
        <p v-if="filtro">Tente ajustar os filtros de busca</p>
        <button
          v-if="filtro"
          @click="limparFiltros"
          class="lu-btn lu-btn--primary"
        >
          Limpar Filtros
        </button>
      </div>

      <!-- Lista de Usuários -->
      <div v-else class="lu-grid">
        <div
          v-for="usuario in usuariosFiltrados"
          :key="usuario.id"
          class="lu-card"
          @click="irParaPerfil(usuario)"
        >
          <!-- Ranking badge -->
          <div
            class="lu-card__rank"
            :class="getRankClass(usuario.posicaoRanking)"
          >
            #{{ usuario.posicaoRanking }}
          </div>

          <!-- Avatar + Info -->
          <div class="lu-card__top">
            <div class="lu-avatar">
              <img
                v-if="usuario.foto"
                :src="usuario.foto"
                :alt="usuario.nome"
              />
              <span v-else class="lu-avatar__initials">{{
                usuario.iniciais
              }}</span>
              <span class="lu-avatar__level">{{ usuario.nivel }}</span>
            </div>
            <div class="lu-card__info">
              <h3 class="lu-card__name">{{ usuario.nome }}</h3>
              <span class="lu-card__title">{{ usuario.titulo }}</span>
              <span class="lu-card__id">{{ usuario.id }}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="lu-card__stats">
            <div class="lu-stat">
              <span class="lu-stat__val">{{
                formatNumber(usuario.xpTotal)
              }}</span>
              <span class="lu-stat__lbl">XP</span>
            </div>
            <div class="lu-stat">
              <span class="lu-stat__val">{{
                formatNumber(usuario.contador)
              }}</span>
              <span class="lu-stat__lbl">Itens</span>
            </div>
            <div class="lu-stat">
              <span class="lu-stat__val">{{ usuario.totalAuditorias }}</span>
              <span class="lu-stat__lbl">Auditorias</span>
            </div>
            <div class="lu-stat">
              <span class="lu-stat__val">{{ usuario.totalConquistas }}</span>
              <span class="lu-stat__lbl">Conquistas</span>
            </div>
          </div>

          <!-- XP Bar -->
          <div class="lu-xp-bar">
            <div
              class="lu-xp-bar__fill"
              :style="{ width: usuario.progressoXp + '%' }"
            ></div>
          </div>
          <span class="lu-xp-bar__text"
            >Nível {{ usuario.nivel }} &rarr; {{ usuario.nivel + 1 }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useLojaStore } from "@/store/lojaStore";
import api from "@/config/api";

export default {
  name: "ListaUsuarios",
  setup() {
    const router = useRouter();
    const lojaStore = useLojaStore();

    const irParaPerfil = (usuario) => {
      router.push(`/perfil/${usuario.id}`);
    };

    return {
      router,
      lojaStore,
      irParaPerfil,
    };
  },
  data() {
    return {
      usuarios: [],
      filtro: "",
      carregando: false,
      erro: "",
      filtroAtivo: "todos",
      ordenacao: "ranking",
      filtroTabs: [
        { id: "todos", label: "Todos", icon: "fas fa-users" },
        { id: "meta", label: "Meta Batida", icon: "fas fa-trophy" },
        { id: "elite", label: "Elite", icon: "fas fa-crown" },
        { id: "novatos", label: "Novatos", icon: "fas fa-seedling" },
      ],
    };
  },
  computed: {
    usuariosFiltrados() {
      let filtrados = [...this.usuarios];

      // Filtro de texto
      if (this.filtro) {
        const termo = this.filtro.toLowerCase();
        filtrados = filtrados.filter(
          (u) =>
            u.nome.toLowerCase().includes(termo) ||
            u.id.toLowerCase().includes(termo),
        );
      }

      // Filtros por categoria
      switch (this.filtroAtivo) {
        case "meta":
          filtrados = filtrados.filter((u) => u.contador >= 500);
          break;
        case "elite":
          filtrados = filtrados.filter((u) => u.nivel >= 10);
          break;
        case "novatos":
          filtrados = filtrados.filter((u) => u.nivel <= 3);
          break;
      }

      // Ordenação
      switch (this.ordenacao) {
        case "ranking":
          filtrados.sort((a, b) => a.posicaoRanking - b.posicaoRanking);
          break;
        case "nivel":
          filtrados.sort((a, b) => b.nivel - a.nivel);
          break;
        case "xp":
          filtrados.sort((a, b) => b.xpTotal - a.xpTotal);
          break;
        case "contador":
          filtrados.sort((a, b) => b.contador - a.contador);
          break;
        case "nome":
          filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
          break;
      }

      return filtrados;
    },

    usuariosComMeta() {
      return this.usuarios.filter((u) => u.contador >= 500).length;
    },

    mediaItens() {
      if (this.usuarios.length === 0) return 0;
      const total = this.usuarios.reduce((sum, u) => sum + u.contador, 0);
      return this.formatNumber(Math.round(total / this.usuarios.length));
    },

    maiorNivel() {
      if (this.usuarios.length === 0) return 0;
      return Math.max(...this.usuarios.map((u) => u.nivel));
    },

    totalConquistas() {
      return this.usuarios.reduce(
        (sum, u) => sum + (u.totalConquistas || 0),
        0,
      );
    },

    getTabCount() {
      return (tabId) => {
        switch (tabId) {
          case "todos":
            return this.usuarios.length;
          case "meta":
            return this.usuariosComMeta;
          case "elite":
            return this.usuarios.filter((u) => u.nivel >= 10).length;
          case "novatos":
            return this.usuarios.filter((u) => u.nivel <= 3).length;
          default:
            return 0;
        }
      };
    },
  },

  async mounted() {
    this.lojaStore.carregarLoja();
    if (this.lojaStore.isLojaSelected) {
      await this.carregarUsuarios();
    }
  },

  watch: {
    "lojaStore.lojaSelecionada": async function (novaLoja) {
      if (novaLoja) {
        await this.carregarUsuarios();
      } else {
        this.usuarios = [];
      }
    },
  },

  methods: {
    async selecionarLoja(loja) {
      const sucesso = await this.lojaStore.selecionarLoja(loja);
      if (sucesso) {
        await this.carregarUsuarios();
      }
    },

    trocarLoja() {
      this.lojaStore.limparLoja();
      this.usuarios = [];
    },

    limparFiltros() {
      this.filtro = "";
      this.filtroAtivo = "todos";
    },

    extrairNomeSimples(nome) {
      if (!nome) return "";
      return nome.replace(/^Loja\s+\d+\s*-\s*/, "").trim();
    },

    formatNumber(n) {
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
      return n;
    },

    getRankClass(pos) {
      if (pos === 1) return "lu-card__rank--gold";
      if (pos === 2) return "lu-card__rank--silver";
      if (pos === 3) return "lu-card__rank--bronze";
      return "";
    },

    async carregarUsuarios() {
      if (!this.lojaStore.isLojaSelected) return;

      try {
        this.carregando = true;
        this.erro = "";

        const response = await api.get("/metricas/usuarios", {
          headers: {
            "x-loja": this.lojaStore.codigoLojaAtual,
          },
        });

        const data = response.data;
        const usuariosRaw = data.usuarios || data || [];

        // Mapear os dados do endpoint /metricas/usuarios (MetricasUsuario model)
        this.usuarios = usuariosRaw.map((u) => ({
          id: u.id,
          nome: u.nome,
          iniciais: u.iniciais || this.obterIniciais(u.nome),
          foto: u.foto || null,
          contador: u.contador || 0,
          totalAuditorias: u.totalAuditorias || 0,
          nivel: u.conquistas?.nivel || 1,
          titulo: u.conquistas?.titulo || "Novato",
          xpTotal: u.conquistas?.xpTotal || 0,
          totalConquistas: u.conquistas?.totalConquistas || 0,
          posicaoRanking: u.desempenho?.posicaoLoja || 0,
          pontuacaoTotal: u.desempenho?.pontuacaoTotal || 0,
          progressoXp: this.calcularProgressoXp(u.conquistas?.xpTotal || 0),
        }));

        // Recalcular ranking se posicaoLoja vier zerado
        const temRanking = this.usuarios.some((u) => u.posicaoRanking > 0);
        if (!temRanking) {
          const ordenados = [...this.usuarios].sort(
            (a, b) => b.xpTotal - a.xpTotal,
          );
          ordenados.forEach((u, i) => {
            const original = this.usuarios.find((o) => o.id === u.id);
            if (original) original.posicaoRanking = i + 1;
          });
        }

        console.log(
          `✅ ${this.usuarios.length} colaboradores carregados via /metricas/usuarios`,
        );
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        this.erro =
          error.response?.data?.erro || "Erro ao carregar dados do servidor";
      } finally {
        this.carregando = false;
      }
    },

    calcularProgressoXp(xpTotal) {
      // Mesma lógica do MetricasUsuario model
      const xpInCurrentLevel = xpTotal % 100;
      return Math.round(xpInCurrentLevel);
    },

    obterIniciais(nome) {
      if (!nome) return "??";
      return (
        nome
          .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .substring(0, 2) || "??"
      );
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

/* ===== BASE ===== */
.lu-page {
  min-height: 100vh;
  background: #f0f2f5;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  color: #1a1a2e;
}

/* ===== SELEÇÃO DE LOJA ===== */
.lu-store-select {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 85vh;
  padding: 1.5rem;
}

.lu-store-select__card {
  background: #fff;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  max-width: 960px;
  width: 100%;
}

.lu-store-select__icon {
  font-size: 3rem;
  color: #6c5ce7;
  margin-bottom: 1rem;
}

.lu-store-select__title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.lu-store-select__desc {
  color: #6b7280;
  margin-bottom: 2rem;
}

.lu-store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.lu-store-item {
  background: #fafbfc;
  border: 2px solid #eef0f4;
  border-radius: 16px;
  padding: 1.25rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.lu-store-item:hover {
  border-color: #6c5ce7;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.12);
}

.lu-store-item__img {
  width: 56px;
  height: 56px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #eef0f4;
}

.lu-store-item__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lu-store-item__name {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1a1a2e;
}

.lu-store-item__city {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.lu-store-item__code {
  display: inline-block;
  background: #6c5ce7;
  color: #fff;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* ===== ALERT ===== */
.lu-alert {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.lu-alert--error {
  background: #fef2f2;
  color: #dc2626;
}

/* ===== MAIN ===== */
.lu-main {
  padding: 1.5rem;
}

/* ===== HEADER ===== */
.lu-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.lu-header::before {
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
  animation: lu-pulse 15s ease-in-out infinite;
}

@keyframes lu-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Círculos decorativos */
.lu-header__circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: lu-float 6s ease-in-out infinite;
}

.lu-header__circle--1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -50px;
  animation-delay: 0s;
}
.lu-header__circle--2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -40px;
  animation-delay: 1s;
}
.lu-header__circle--3 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}
.lu-header__circle--4 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
}
.lu-header__circle--5 {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 5%;
  animation-delay: 4s;
}
.lu-header__circle--6 {
  width: 90px;
  height: 90px;
  top: 10%;
  left: 20%;
  animation-delay: 5s;
}

@keyframes lu-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.lu-header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.lu-header__left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.lu-header__img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.lu-header__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lu-header__text h1 {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lu-header__text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 300;
}

.lu-header__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.lu-header__btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 12px;
  padding: 0.65rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9rem;
}

.lu-header__btn--icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
  justify-content: center;
  font-size: 1.1rem;
}

.lu-header__btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.lu-header__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ===== BUTTONS ===== */
.lu-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.lu-btn--ghost {
  background: #fff;
  color: #374151;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.lu-btn--ghost:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.lu-btn--ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lu-btn--primary {
  background: #6c5ce7;
  color: #fff;
}

.lu-btn--primary:hover {
  background: #5a4bd1;
}

.lu-btn__label {
  display: inline;
}

/* ===== METRICS ===== */
.lu-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.lu-metric {
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f4;
}

.lu-metric__value {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: #6c5ce7;
  line-height: 1.2;
}

.lu-metric__label {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 0.25rem;
}

/* ===== TOOLBAR ===== */
.lu-toolbar {
  background: #fff;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f4;
}

.lu-search {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.lu-search__icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.85rem;
}

.lu-search__input {
  width: 100%;
  padding: 0.6rem 0.6rem 0.6rem 2.2rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.85rem;
  font-family: inherit;
  background: #fafbfc;
  transition: all 0.2s;
}

.lu-search__input:focus {
  outline: none;
  border-color: #6c5ce7;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.08);
}

.lu-search__clear {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
}

.lu-search__clear:hover {
  color: #ef4444;
}

.lu-filters {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.lu-chip {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: inherit;
}

.lu-chip:hover {
  border-color: #6c5ce7;
  color: #6c5ce7;
}

.lu-chip--active {
  background: #6c5ce7;
  border-color: #6c5ce7;
  color: #fff;
}

.lu-chip__count {
  font-size: 0.7rem;
  opacity: 0.75;
}

.lu-toolbar__right {
  margin-left: auto;
}

.lu-select {
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.82rem;
  font-family: inherit;
  background: #fafbfc;
  cursor: pointer;
}

.lu-select:focus {
  outline: none;
  border-color: #6c5ce7;
}

/* ===== STATES ===== */
.lu-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #f0f0f4;
}

.lu-state i {
  font-size: 2.5rem;
  color: #d1d5db;
  margin-bottom: 1rem;
  display: block;
}

.lu-state--error i {
  color: #ef4444;
}

.lu-state h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.lu-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.lu-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #6c5ce7;
  border-radius: 50%;
  animation: lu-spin 0.7s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes lu-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== GRID ===== */
.lu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

/* ===== CARD ===== */
.lu-card {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid #f0f0f4;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.lu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: #e0dcf9;
}

/* Rank badge */
.lu-card__rank {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.lu-card__rank--gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
}

.lu-card__rank--silver {
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
  color: #fff;
}

.lu-card__rank--bronze {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #fff;
}

/* Top section */
.lu-card__top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

/* Avatar */
.lu-avatar {
  position: relative;
  flex-shrink: 0;
}

.lu-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  object-fit: cover;
}

.lu-avatar__initials {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.lu-avatar__level {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #fbbf24;
  color: #1a1a2e;
  width: 22px;
  height: 22px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  border: 2px solid #fff;
}

/* Info */
.lu-card__info {
  min-width: 0;
  flex: 1;
}

.lu-card__name {
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.1rem;
}

.lu-card__title {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c5ce7;
  margin-bottom: 0.1rem;
}

.lu-card__id {
  font-size: 0.7rem;
  color: #9ca3af;
}

/* Stats grid */
.lu-card__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.lu-stat {
  text-align: center;
  padding: 0.5rem 0.25rem;
  background: #fafbfc;
  border-radius: 10px;
}

.lu-stat__val {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}

.lu-stat__lbl {
  display: block;
  font-size: 0.6rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-top: 0.1rem;
}

/* XP Bar */
.lu-xp-bar {
  height: 4px;
  background: #f0f0f4;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.35rem;
}

.lu-xp-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.lu-xp-bar__text {
  display: block;
  font-size: 0.65rem;
  color: #9ca3af;
  text-align: right;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .lu-main {
    padding: 1rem;
  }

  .lu-header {
    padding: 1.5rem;
  }

  .lu-header__content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .lu-header__left {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .lu-header__text h1 {
    font-size: 1.35rem;
    justify-content: center;
  }

  .lu-header__text p {
    font-size: 0.85rem;
  }

  .lu-header__circle--3,
  .lu-header__circle--4,
  .lu-header__circle--5,
  .lu-header__circle--6 {
    display: none;
  }

  .lu-metrics {
    grid-template-columns: repeat(2, 1fr);
  }

  .lu-grid {
    grid-template-columns: 1fr;
  }

  .lu-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .lu-toolbar__right {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .lu-metrics {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .lu-metric {
    padding: 0.75rem;
  }

  .lu-metric__value {
    font-size: 1.25rem;
  }

  .lu-store-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .lu-card__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
