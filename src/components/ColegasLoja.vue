<template>
  <div class="colegas-loja-container">
    <div class="section-header">
      <div class="header-content">
        <i class="fas fa-users"></i>
        <h2>Colegas da {{ loja }}</h2>
      </div>
      <span class="total-badge">{{ colegas.length }} colaboradores</span>
    </div>

    <div v-if="carregando" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando colegas...</p>
    </div>

    <div v-else-if="colegas.length === 0" class="empty-state">
      <i class="fas fa-user-friends"></i>
      <p>Nenhum colega encontrado nesta loja.</p>
    </div>

    <div v-else class="colegas-grid">
      <div
        v-for="colega in colegas"
        :key="colega.id"
        class="colega-card"
        :class="{ 'is-current': colega.id === usuarioAtualId }"
        @click="verPerfil(colega.id)"
      >
        <div class="colega-avatar-container">
          <img :src="colega.foto" :alt="colega.nome" class="colega-avatar" />
          <div v-if="colega.id === usuarioAtualId" class="badge-voce">Você</div>
          <div class="nivel-badge">
            <span class="nivel-icon">⭐</span>
            {{ colega.nivel }}
          </div>
        </div>

        <div class="colega-info">
          <h3 class="colega-nome">{{ colega.nome }}</h3>
          <p class="colega-titulo">{{ colega.titulo }}</p>

          <div class="colega-stats">
            <div class="stat-mini">
              <i class="fas fa-star"></i>
              <span>{{ colega.xpTotal }} XP</span>
            </div>
            <div class="stat-mini">
              <i class="fas fa-check-circle"></i>
              <span>{{ colega.contador }}</span>
            </div>
            <div class="stat-mini ranking-stat">
              <i class="fas fa-trophy"></i>
              <span>#{{ colega.posicao }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useNivelStore } from "@/store/nivelStore";
import axios from "axios";

export default {
  name: "ColegasLoja",
  props: {
    loja: {
      type: String,
      required: true,
    },
    usuarioAtualId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
    const nivelStore = useNivelStore();
    return { router, nivelStore };
  },
  data() {
    return {
      colegas: [],
      carregando: true,
    };
  },
  async mounted() {
    await this.carregarColegas();
  },
  methods: {
    async carregarColegas() {
      try {
        this.carregando = true;

        // Buscar usuários da mesma loja
        const lojaSelecionada = JSON.parse(
          localStorage.getItem("lojaSelecionada") || '{"codigo":"056"}',
        );

        const response = await axios.get("http://localhost:3000/api/usuarios", {
          headers: {
            "x-loja": lojaSelecionada.codigo,
          },
        });

        // Filtrar usuários da mesma loja e processar dados
        this.colegas = response.data
          .filter((usuario) => usuario.loja?.nome === this.loja)
          .map((usuario) => {
            const xpTotal =
              (usuario.contador || 0) + (usuario.xpConquistas || 0);
            const nivel = this.nivelStore.calcularNivel(xpTotal);
            const titulo = this.nivelStore.obterTitulo(nivel);
            const posicao = this.nivelStore.calcularPosicaoRanking(usuario.id);

            return {
              id: usuario.id,
              nome: usuario.nome,
              foto: this.getFotoUrl(usuario),
              contador: usuario.contador || 0,
              xpTotal: xpTotal,
              nivel: nivel,
              titulo: titulo,
              posicao: posicao,
            };
          })
          .sort((a, b) => b.xpTotal - a.xpTotal); // Ordenar por XP
      } catch (error) {
        console.error("Erro ao carregar colegas:", error);
      } finally {
        this.carregando = false;
      }
    },

    getFotoUrl(usuario) {
      if (usuario.foto) {
        return usuario.foto;
      }
      const seed = usuario.nome
        ? encodeURIComponent(usuario.nome.toLowerCase())
        : "default";
      return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede&radius=50&size=128`;
    },

    verPerfil(usuarioId) {
      if (usuarioId === this.usuarioAtualId) {
        return; // Já está no próprio perfil
      }
      this.router.push(`/perfil/${usuarioId}`);
    },
  },
};
</script>

<style scoped>
.colegas-loja-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-content i {
  font-size: 1.5rem;
  color: #667eea;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.total-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 3px 12px rgba(102, 126, 234, 0.3);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-state .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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

.empty-state i {
  font-size: 3rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #7f8c8d;
  font-size: 1rem;
}

.colegas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.colega-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.colega-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
  background: white;
}

.colega-card.is-current {
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-color: #667eea;
  cursor: default;
}

.colega-card.is-current:hover {
  transform: none;
}

.colega-avatar-container {
  position: relative;
  margin-bottom: 1rem;
}

.colega-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge-voce {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nivel-badge {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.75rem;
  border: 2px solid white;
  box-shadow: 0 3px 10px rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.nivel-icon {
  font-size: 0.8rem;
}

.colega-info {
  width: 100%;
}

.colega-nome {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.3rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.colega-titulo {
  font-size: 0.85rem;
  color: #667eea;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.colega-stats {
  display: flex;
  justify-content: space-around;
  gap: 0.8rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.stat-mini i {
  font-size: 1rem;
  color: #6c757d;
}

.stat-mini span {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.ranking-stat i {
  color: #f59e0b;
}

.ranking-stat span {
  color: #f59e0b;
}

/* Mobile */
@media (max-width: 768px) {
  .colegas-loja-container {
    border-radius: 20px;
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .header-content i {
    font-size: 1.3rem;
  }

  .total-badge {
    align-self: flex-end;
    font-size: 0.8rem;
    padding: 5px 12px;
  }

  .colegas-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  .colega-card {
    padding: 1rem;
  }

  .colega-avatar {
    width: 70px;
    height: 70px;
  }

  .colega-nome {
    font-size: 0.95rem;
  }

  .colega-titulo {
    font-size: 0.75rem;
  }

  .colega-stats {
    gap: 0.5rem;
  }

  .stat-mini i {
    font-size: 0.9rem;
  }

  .stat-mini span {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .colegas-grid {
    grid-template-columns: 1fr;
  }

  .colega-card {
    flex-direction: row;
    text-align: left;
    gap: 1rem;
  }

  .colega-avatar-container {
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .colega-info {
    flex: 1;
  }

  .colega-stats {
    justify-content: flex-start;
    padding-top: 0.8rem;
  }
}
</style>
