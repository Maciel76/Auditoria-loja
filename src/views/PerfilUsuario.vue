<template>
  <div class="perfil-usuario-container">
    <!-- Botão Voltar -->
    <div v-if="!carregando" class="navigation-section">
      <button class="back-btn" @click="voltarParaLista">
        <i class="fas fa-arrow-left"></i> Voltar para Lista
      </button>
    </div>

    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando perfil...</p>
    </div>

    <div v-else-if="!usuario.id" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>Usuário não encontrado</h3>
      <p>O colaborador solicitado não foi encontrado no sistema.</p>
      <button @click="voltarParaLista" class="btn btn-primary">
        Voltar para lista
      </button>
    </div>

    <div v-else>
      <!-- Header do Perfil -->
      <div class="perfil-header-card">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img :src="usuario.foto" :alt="usuario.nome" class="avatar-img" />
            <div class="level-badge">Nível {{ usuario.nivel }}</div>
          </div>
        </div>
        <div class="info-section">
          <h1 class="nome-usuario">{{ usuario.nome }}</h1>
          <p class="titulo-usuario">{{ usuario.titulo }}</p>
          <div class="xp-bar">
            <div
              class="xp-fill"
              :style="{ width: usuario.progressoXp + '%' }"
            ></div>
            <span class="xp-text"
              >{{ usuario.xpAtual }} / {{ usuario.xpParaProximoNivel }} XP</span
            >
          </div>
        </div>
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-value">{{ conquistasDesbloqueadas.length }}</span>
            <span class="stat-label">Conquistas</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">#{{ posicaoRanking }}</span>
            <span class="stat-label">Ranking</span>
          </div>
        </div>
      </div>

      <!-- Galeria de Conquistas -->
      <div class="conquistas-gallery">
        <h2>
          Galeria de Conquistas ({{ conquistasDesbloqueadas.length }} /
          {{ todasConquistas.length }})
        </h2>
        <div class="conquistas-grid">
          <div
            v-for="conquista in todasConquistas"
            :key="conquista.achievementId"
            class="conquista-card"
            :class="{ desbloqueada: conquista.desbloqueada }"
          >
            <div class="conquista-icon">
              {{ conquista.desbloqueada ? conquista.icon : "🔒" }}
            </div>
            <h4 class="conquista-titulo">{{ conquista.title }}</h4>
            <p class="conquista-descricao">{{ conquista.description }}</p>
            <span class="conquista-xp">{{ conquista.points }} XP</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useNivelStore } from "@/store/nivelStore";
import { useConquistasStore } from "@/store/conquistasStore";
import { useLojaStore } from "@/store/lojaStore";

export default {
  name: "PerfilUsuario",
  components: {
    // Componentes externos foram removidos para focar na nova estrutura
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
    const lojaStore = useLojaStore();
    const nivelStore = useNivelStore();

    const voltarParaLista = () => {
      // Verificar se veio de uma rota específica ou usar rota padrão
      if (router.options.history.state.back) {
        router.back();
      } else {
        router.push("/usuarios");
      }
    };

    return {
      voltarParaLista,
      lojaStore,
      nivelStore,
    };
  },
  data() {
    return {
      usuario: {
        id: "",
        nome: "",
        contador: 0,
        foto: "",
        iniciais: "",
        xpConquistas: 0,
        totalAuditorias: 0,
        nivel: 0,
        titulo: "",
        xpAtual: 0,
        xpParaProximoNivel: 100,
        progressoXp: 0,
        conquistas: [], // IDs das conquistas desbloqueadas
      },
      carregando: true,
      todasConquistas: [],
    };
  },
  async mounted() {
    try {
      // Carregar todas as conquistas do sistema
      const conquistasStore = useConquistasStore();
      await conquistasStore.carregarConquistas();
      this.todasConquistas = conquistasStore.conquistas;

      // Carregar dados do usuário específico
      await this.carregarUsuarioPorId(this.id);
    } catch (error) {
      console.error("Erro ao inicializar perfil:", error);
    } finally {
      this.carregando = false;
    }
  },
  computed: {
    posicaoRanking() {
      if (!this.usuario.id) return "-";
      try {
        return this.nivelStore.calcularPosicaoRanking(this.usuario.id);
      } catch (error) {
        console.warn("Erro ao calcular posição ranking:", error);
        return "-";
      }
    },

    conquistasDesbloqueadas() {
      if (!this.usuario.conquistas || this.usuario.conquistas.length === 0) {
        return [];
      }
      return this.todasConquistas.filter((c) =>
        this.usuario.conquistas.includes(c.achievementId)
      );
    },
  },
  methods: {
    async carregarUsuarioPorId(usuarioId) {
      try {
        this.carregando = true;
        await this.nivelStore.carregarUsuarios(); // Garante que a lista de usuários está carregada
        const usuarioEncontrado = this.nivelStore.getUsuarioById(usuarioId);

        if (usuarioEncontrado) {
          const xpTotal =
            (usuarioEncontrado.contador || 0) +
            (this.nivelStore.calcularXpConquistas(usuarioEncontrado) || 0);
          const nivelInfo = this.nivelStore.calcularNivelEProgresso(xpTotal);

          this.usuario = {
            ...usuarioEncontrado,
            foto: this.getFotoUrl(usuarioEncontrado),
            iniciais: this.obterIniciais(usuarioEncontrado.nome),
            nivel: nivelInfo.nivel,
            titulo: this.nivelStore.obterTitulo(nivelInfo.nivel),
            xpAtual: xpTotal,
            xpParaProximoNivel: nivelInfo.xpParaProximoNivel,
            progressoXp: nivelInfo.progressoPercentual,
            conquistas: usuarioEncontrado.conquistas || [],
          };

          // Marcar quais conquistas estão desbloqueadas
          this.todasConquistas.forEach((conquista) => {
            conquista.desbloqueada = this.usuario.conquistas.includes(
              conquista.achievementId
            );
          });
        } else {
          console.error("Usuário não encontrado:", usuarioId);
          this.usuario = {}; // Limpa o usuário para mostrar a tela de erro
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        this.carregando = false;
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

    getFotoUrl(usuario) {
      if (usuario.foto) {
        return usuario.foto;
      }
      const initials = this.obterIniciais(usuario.nome);
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        usuario.nome
      )}&background=667eea&color=fff&font-size=0.45`;
    },

    compartilharPerfil() {
      if (navigator.share) {
        navigator
          .share({
            title: `Perfil de ${this.usuario.nome}`,
            text: `Confira o desempenho de ${this.usuario.nome} no sistema de auditoria! ${this.usuario.contador} itens verificados.`,
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        alert(
          "Seu navegador não suporta a funcionalidade de compartilhamento."
        );
      }
    },

    voltarParaLista() {
      // Garante navegação para rota correta
      if (this.$router) {
        this.$router.push("/usuarios");
      } else {
        window.location.href = "/usuarios";
      }
    },
  },
};
</script>

<style scoped>
.perfil-usuario-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  background: #f8f9fa;
}

.navigation-section {
  display: block;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
}

.back-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  transform: translateY(-2px);
}

.back-btn i {
  margin-right: 8px;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-container .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.error-container .error-icon {
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.error-container p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.error-container .btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

/* Novo Header */
.perfil-header-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  margin-bottom: 2rem;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
}

.level-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  border: 2px solid white;
}

.info-section {
  flex: 1;
}

.nome-usuario {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.titulo-usuario {
  font-size: 1.2rem;
  font-weight: 500;
  color: #667eea;
  margin: 0 0 1rem 0;
}

.xp-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.xp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.stats-section {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
}

/* Galeria de Conquistas */
.conquistas-gallery {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.conquistas-gallery h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.conquistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.conquista-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  opacity: 0.5;
  filter: grayscale(80%);
}

.conquista-card.desbloqueada {
  opacity: 1;
  filter: grayscale(0%);
  background: white;
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.conquista-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.conquista-titulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.conquista-descricao {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 1rem;
  min-height: 40px;
}

.conquista-xp {
  display: inline-block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}
</style>
