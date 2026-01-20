<template>
  <div class="perfil-usuario-container">
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
    </div>

    <div v-else>
      <!-- Header do Perfil -->
      <div class="perfil-header">
        <div class="perfil-cover" :style="coverStyle">
          <div class="cover-pattern"></div>
          <div class="cover-overlay">
            <button class="btn-edit-cover" @click="showCoverSelector = true">
              <i class="fas fa-pencil-alt"></i>
              <span class="btn-tooltip">Personalizar Perfil</span>
            </button>
            <div class="user-status">
              <i class="fas fa-user-check"></i>
              Colaborador Ativo
            </div>
          </div>
        </div>

        <!-- Modal de Seleção de Cover -->
        <UserCoverSelector
          v-model="showCoverSelector"
          :current-cover="usuario.coverId"
          :user-id="usuario.id"
          @cover-selected="handleCoverSelected"
        />

        <div class="perfil-info">
          <div class="avatar-container">
            <div class="avatar-wrapper">
              <img :src="usuario.foto" :alt="usuario.nome" class="avatar-img" />
              <div class="level-badge">
                <span class="level-icon">⭐</span>
                Nível {{ usuario.nivel }}
              </div>
            </div>
          </div>

          <div class="perfil-details">
            <div class="user-header">
              <h1 class="nome-usuario">{{ usuario.nome }}</h1>
            </div>
            <p class="titulo-usuario">
              <i class="fas fa-award"></i>
              {{ usuario.titulo }}
            </p>
            <div class="xp-container">
              <div class="xp-bar">
                <div
                  class="xp-fill"
                  :style="{ width: usuario.progressoXp + '%' }"
                ></div>
              </div>
              <span class="xp-text"
                >{{ usuario.xpAtual }} /
                {{ usuario.xpParaProximoNivel }} XP</span
              >
            </div>
          </div>

          <div class="perfil-stats">
            <div class="stat-item">
              <div class="stat-number">
                {{ conquistasDesbloqueadas.length }}
              </div>
              <div class="stat-label">Conquistas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">#{{ posicaoRanking }}</div>
              <div class="stat-label">Ranking</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ usuario.totalAuditorias || 0 }}</div>
              <div class="stat-label">Auditorias</div>
            </div>
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
import UserCoverSelector from "@/components/UserCoverSelector.vue";
import axios from "axios";

export default {
  name: "PerfilUsuario",
  components: {
    UserCoverSelector,
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
        coverId: "gradient-1",
        selectedBadges: [],
      },
      carregando: true,
      todasConquistas: [],
      showCoverSelector: false,
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
        this.usuario.conquistas.includes(c.achievementId),
      );
    },

    coverStyle() {
      const coverId = this.usuario.coverId || "gradient-1";

      // Check if coverId is a URL (starts with http)
      if (coverId.startsWith("http")) {
        return {
          backgroundImage: `url('${coverId}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      }

      // Check if coverId is a pattern
      if (coverId.startsWith("pattern-")) {
        const patterns = {
          "pattern-1": {
            backgroundImage:
              "repeating-linear-gradient(45deg, #667eea, #667eea 20px, #764ba2 20px, #764ba2 40px)",
          },
          "pattern-2": {
            backgroundImage:
              "repeating-linear-gradient(0deg, #15b638, #15b638 20px, #0575E6 20px, #0575E6 40px)",
          },
          "pattern-3": {
            backgroundImage:
              "linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%), linear-gradient(45deg, #fa709a 25%, transparent 25%, transparent 75%, #fa709a 75%) 40px 40px, linear-gradient(to bottom, #fee140, #fee140)",
            backgroundSize: "80px 80px",
          },
          "pattern-4": {
            backgroundImage:
              "radial-gradient(circle, #4facfe 3px, transparent 3px)",
            backgroundSize: "30px 30px",
            backgroundColor: "#f0f9ff",
          },
          "pattern-5": {
            backgroundImage:
              "repeating-linear-gradient(90deg, #43e97b 0px, #43e97b 20px, #38f9d7 20px, #38f9d7 40px)",
          },
          "pattern-6": {
            backgroundImage:
              "repeating-linear-gradient(60deg, #4e54c8 0px, #4e54c8 20px, #8f94fb 20px, #8f94fb 40px)",
          },
        };

        return patterns[coverId] || patterns["pattern-1"];
      }

      // Otherwise, treat as gradient
      const coverMap = {
        "gradient-1": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-2": "linear-gradient(135deg, #15b638 0%, #0575E6 100%)",
        "gradient-3": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "gradient-4": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "gradient-5": "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
        "gradient-6": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-7": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "gradient-8": "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
        "gradient-9": "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)",
        "gradient-10": "linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)",
        "gradient-11": "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
        "gradient-12": "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
      };

      return {
        background: coverMap[coverId] || coverMap["gradient-1"],
      };
    },
  },
  methods: {
    async carregarUsuarioPorId(usuarioId) {
      try {
        this.carregando = true;

        // Fetch fresh user data from the API instead of relying on store cache
        const lojaSelecionada = JSON.parse(
          localStorage.getItem("lojaSelecionada") || '{"codigo":"056"}',
        );

        const response = await axios.get(
          `http://localhost:3000/api/usuarios/${usuarioId}`,
          {
            headers: {
              "x-loja": lojaSelecionada.codigo,
            },
          },
        );

        const usuarioApi = response.data;

        if (usuarioApi) {
          // Calculate XP total
          const xpTotal =
            (usuarioApi.contador || 0) + (usuarioApi.xpConquistas || 0);

          // Calculate level and progress
          const nivel = this.nivelStore.calcularNivel(xpTotal);
          const xpParaProximoNivel =
            this.nivelStore.calcularXpRestante(xpTotal);
          const progressoXp = ((xpTotal % 100) / 100) * 100; // Percentage of current XP toward next level

          this.usuario = {
            ...usuarioApi,
            foto: this.getFotoUrl(usuarioApi),
            iniciais: this.obterIniciais(usuarioApi.nome),
            nivel: nivel,
            titulo: this.nivelStore.obterTitulo(nivel),
            xpAtual: xpTotal,
            xpParaProximoNivel: xpParaProximoNivel,
            progressoXp: progressoXp,
            conquistas: usuarioApi.conquistas || [],
            coverId: usuarioApi.coverId || "gradient-1",
            selectedBadges: usuarioApi.selectedBadges || [],
          };

          // Mark which achievements are unlocked
          this.todasConquistas.forEach((conquista) => {
            conquista.desbloqueada = this.usuario.conquistas.includes(
              conquista.achievementId,
            );
          });

          // Update the user in nivelStore to keep it consistent
          const indexInStore = this.nivelStore.usuarios.findIndex(
            (u) => u.id === usuarioId,
          );
          if (indexInStore !== -1) {
            this.nivelStore.usuarios[indexInStore] = { ...usuarioApi };
          } else {
            // If user doesn't exist in store, add it
            this.nivelStore.usuarios.push({ ...usuarioApi });
          }
        } else {
          console.error("Usuário não encontrado:", usuarioId);
          this.usuario = {}; // Clear user to show error screen
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
        // If the photo is already a URL (either uploaded or avatar), return it directly
        return usuario.foto;
      }
      // Generate a default avatar using DiceBear if no photo is set
      const seed = usuario.nome ? encodeURIComponent(usuario.nome.toLowerCase()) : 'default';
      return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede&radius=50&size=128`;
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
          "Seu navegador não suporta a funcionalidade de compartilhamento.",
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

    async handleCoverSelected(payload) {
      console.log("Cover selecionado:", payload);

      try {
        const response = await this.updateCoverOnBackend(payload);

        if (response.success) {
          // If avatar was selected, update it immediately in the local user object
          if (payload.selectedAvatar) {
            this.usuario.foto = payload.selectedAvatar;

            // Force re-render of the avatar by updating the key or forcing Vue to update
            this.$forceUpdate();
          }

          console.log("Perfil atualizado com sucesso:", payload);

          // Reload the user data to ensure everything is updated
          await this.carregarUsuarioPorId(this.usuario.id);
        } else {
          console.error(
            "Erro ao atualizar perfil no backend:",
            response.message,
          );
          alert("Erro ao atualizar perfil. Por favor, tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert("Erro ao atualizar perfil. Por favor, tente novamente.");
      }
    },

    async updateCoverOnBackend(payload) {
      try {
        const updateData = {};

        // Include coverId if provided in the payload
        if (payload.coverId !== undefined) {
          updateData.coverId = payload.coverId;
        }

        // Include selectedBadges if provided in the payload
        if (payload.selectedBadges !== undefined) {
          updateData.selectedBadges = payload.selectedBadges;
        }

        // Include selectedAvatar if provided in the payload
        if (payload.selectedAvatar !== undefined) {
          updateData.selectedAvatar = payload.selectedAvatar;
        }

        const response = await axios.patch(
          `http://localhost:3000/api/usuarios/${this.usuario.id}/cover`,
          updateData,
        );

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Erro ao atualizar perfil no backend:", error);
        return {
          success: false,
          message: error.response?.data?.erro || error.message,
        };
      }
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.perfil-usuario-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  background: #f8f9fa;
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

/* Novo Header - Estilo das Lojas */
.perfil-header {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
  position: relative;
}

.perfil-cover {
  height: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  transition: background 0.5s ease;
}

.cover-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0px,
    rgba(255, 255, 255, 0.1) 16px,
    transparent 16px,
    transparent 32px
  );
  opacity: 0.7;
  pointer-events: none;
}

.cover-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.btn-edit-cover {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.95rem;
  color: #667eea;
  opacity: 1;
  flex-shrink: 0;
  position: relative;
}

.btn-edit-cover:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: white;
  color: #764ba2;
}

.btn-edit-cover i {
  transition: transform 0.3s ease;
}

.btn-edit-cover:hover i {
  transform: scale(1.15);
}

.btn-tooltip {
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(-10px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  z-index: 1000;
  letter-spacing: 0.3px;
}

.btn-tooltip::before {
  content: "";
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: #667eea;
}

.btn-edit-cover:hover .btn-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
  animation: tooltipSlideIn 0.5s ease-out;
}

@keyframes tooltipSlideIn {
  0% {
    transform: translateY(-50%) translateX(-10px) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateY(-50%) translateX(5px) scale(1.05);
  }
  100% {
    transform: translateY(-50%) translateX(0) scale(1);
    opacity: 1;
  }
}

.user-status {
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(76, 175, 80, 0.25);
  color: #2e7d32;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: pulse-green 2s infinite;
}

.user-status::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4caf50;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

@keyframes pulse-dot {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

.perfil-info {
  padding: 0 30px 30px;
  margin-top: -40px;
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
  width: 160px;
  height: 160px;
  border-radius: 20px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.level-badge {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.level-icon {
  font-size: 1.1rem;
}

.perfil-details {
  flex: 1;
  min-width: 300px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.nome-usuario {
  font-size: 2.5rem;
  margin: 0;
  margin-top: -20px;
  font-weight: 800;
  position: relative;
  z-index: 10;
  background: linear-gradient(90deg, #667eea 10%, #764ba2 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  padding: 2px 12px 2px 6px;
  transition: color 0.2s;
}

.titulo-usuario {
  font-size: 1.2rem;
  font-weight: 500;
  color: #667eea;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.xp-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
}

.perfil-stats {
  display: flex;
  gap: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 15px;
  min-width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

/* ============================================
   RESPONSIVIDADE MOBILE - APP-LIKE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .perfil-usuario-container {
    padding: 0;
    background: #f8f9fa;
  }

  /* Header estilo app mobile */
  .perfil-header {
    border-radius: 0 0 25px 25px;
    margin-bottom: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .perfil-cover {
    height: 180px;
    border-radius: 0;
  }

  .cover-overlay {
    top: 10px;
    left: 10px;
    right: 10px;
  }

  .btn-edit-cover {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }

  .btn-tooltip {
    display: none;
  }

  .user-status {
    padding: 6px 12px;
    font-size: 0.75rem;
    border-radius: 15px;
  }

  .user-status i {
    font-size: 0.7rem;
  }

  /* Layout em coluna para mobile */
  .perfil-info {
    flex-direction: column;
    padding: 0 15px 20px;
    margin-top: -50px;
    gap: 15px;
    align-items: center;
  }

  /* Avatar centralizado */
  .avatar-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .avatar-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 5px solid white;
  }

  .level-badge {
    bottom: -5px;
    right: -5px;
    padding: 6px 12px;
    font-size: 0.85rem;
    border: 2px solid white;
  }

  .level-icon {
    font-size: 1rem;
  }

  /* Detalhes centralizados */
  .perfil-details {
    width: 100%;
    text-align: center;
    min-width: auto;
  }

  .user-header {
    justify-content: center;
    margin-bottom: 5px;
  }

  .nome-usuario {
    font-size: 1.8rem;
    margin-top: -10px;
    padding: 2px 8px;
  }

  .titulo-usuario {
    font-size: 1rem;
    margin: 0 0 0.8rem 0;
    justify-content: center;
  }

  .xp-container {
    width: 100%;
  }

  .xp-bar {
    height: 10px;
  }

  .xp-text {
    font-size: 0.8rem;
    text-align: center;
    display: block;
    margin-top: 8px;
  }

  /* Stats em linha horizontal */
  .perfil-stats {
    width: 100%;
    min-width: auto;
    padding: 15px;
    gap: 15px;
    border-radius: 15px;
  }

  .stat-item {
    flex: 1;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
    letter-spacing: 0.3px;
  }

  /* Galeria de conquistas */
  .conquistas-gallery {
    border-radius: 25px 25px 0 0;
    padding: 1.5rem 1rem;
    margin: 0 0 0 0;
  }

  .conquistas-gallery h2 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    padding-bottom: 0.8rem;
  }

  .conquistas-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .conquista-card {
    padding: 1rem;
    border-radius: 15px;
  }

  .conquista-icon {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }

  .conquista-titulo {
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
  }

  .conquista-descricao {
    font-size: 0.75rem;
    margin-bottom: 0.8rem;
    min-height: 35px;
  }

  .conquista-xp {
    padding: 3px 10px;
    font-size: 0.7rem;
  }
}

/* Mobile pequeno (iPhone SE, etc) */
@media (max-width: 375px) {
  .perfil-cover {
    height: 160px;
  }

  .perfil-info {
    margin-top: -45px;
  }

  .avatar-img {
    width: 100px;
    height: 100px;
    border: 4px solid white;
  }

  .level-badge {
    padding: 5px 10px;
    font-size: 0.75rem;
  }

  .nome-usuario {
    font-size: 1.5rem;
  }

  .titulo-usuario {
    font-size: 0.9rem;
  }

  .perfil-stats {
    padding: 12px;
    gap: 10px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .conquistas-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.8rem;
  }

  .conquista-card {
    padding: 0.8rem;
  }

  .conquista-icon {
    font-size: 2rem;
  }

  .conquista-titulo {
    font-size: 0.85rem;
  }

  .conquista-descricao {
    font-size: 0.7rem;
    min-height: 30px;
  }
}

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .perfil-cover {
    height: 150px;
  }

  .perfil-info {
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: -30px;
    justify-content: center;
  }

  .avatar-container {
    width: auto;
  }

  .avatar-img {
    width: 90px;
    height: 90px;
  }

  .perfil-details {
    flex: 1;
    min-width: 250px;
    text-align: left;
  }

  .user-header {
    justify-content: flex-start;
  }

  .titulo-usuario {
    justify-content: flex-start;
  }

  .perfil-stats {
    width: 100%;
    margin-top: 10px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .perfil-header {
    border-radius: 20px;
  }

  .perfil-cover {
    height: 220px;
  }

  .perfil-info {
    padding: 0 25px 25px;
    margin-top: -35px;
    gap: 25px;
  }

  .avatar-img {
    width: 140px;
    height: 140px;
  }

  .nome-usuario {
    font-size: 2.2rem;
  }

  .perfil-stats {
    min-width: 250px;
    padding: 18px;
  }

  .conquistas-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.2rem;
  }
}
</style>
