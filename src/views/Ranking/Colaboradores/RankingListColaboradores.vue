<template>
  <div class="full-ranking-section">
    <h2 class="section-title">
      {{ viewMode === "podium" ? "Demais Colaboradores" : "Ranking Completo" }}
      <span class="tipo-badge" :class="getTipoBadgeClass()">
        {{ getTipoAuditoriaDisplay(tipoAuditoria) }}
      </span>
    </h2>

    <div class="ranking-list">
      <div
        v-for="(usuario, index) in usuariosFiltradosOrdenados"
        :key="usuario.id"
        :class="[
          'ranking-item',
          getRankingClass(viewMode === 'podium' ? index + 3 : index),
        ]"
        @click="irParaPerfil(usuario.id)"
        class="clickable-profile"
      >
        <div class="rank-number">
          <span class="normal-rank"
            >{{ viewMode === "podium" ? index + 4 : index + 1 }}º</span
          >
        </div>

        <div class="user-info">
          <div class="user-avatar">
            <img
              v-if="usuario.foto"
              :src="usuario.foto"
              :alt="usuario.nome"
              class="avatar-image"
            />
            <div
              v-else
              class="avatar-initials"
              :class="getAvatarClass(viewMode === 'podium' ? index + 3 : index)"
            >
              {{ getUserInitials(usuario.nome) }}
            </div>
          </div>
          <div class="user-details">
            <h3 class="user-name">{{ usuario.nome }}</h3>
          </div>
        </div>

        <!-- Métricas específicas por tipo de auditoria -->
        <div class="metrics-container">
          <div class="score-container">
            <div class="score-bar">
              <div
                class="score-progress"
                :style="{ width: calcularProgresso(usuario.contador) + '%' }"
              ></div>
            </div>
            <div class="score-value">
              {{ usuario.contador }} {{ getUnidadeMedida() }}
            </div>
          </div>

          <!-- Informações específicas por tipo -->
          <div class="type-specific-info">
            <template v-if="tipoAuditoria === 'etiqueta'">
              <div class="metric-item">
                <i class="fas fa-tags"></i>
                <span
                  >{{
                    getMetricaEspecifica(usuario, "etiquetas", "totalItens")
                  }}
                  Etiquetas</span
                >
              </div>
              <div class="metric-item">
                <i class="fas fa-percentage"></i>
                <span
                  >{{
                    formatarPorcentagem(
                      getMetricaEspecifica(
                        usuario,
                        "etiquetas",
                        "percentualConclusao"
                      )
                    )
                  }}% Auditoria</span
                >
              </div>
            </template>

            <template v-if="tipoAuditoria === 'presenca'">
              <div class="metric-item">
                <i class="fas fa-users"></i>
                <span
                  >{{
                    getMetricaEspecifica(usuario, "presencas", "totalItens")
                  }}
                  verificações</span
                >
              </div>
              <div class="metric-item">
                <i class="fas fa-check-circle"></i>
                <span
                  >{{
                    getMetricaEspecifica(
                      usuario,
                      "presencas",
                      "presencasConfirmadas"
                    )
                  }}
                  confirmadas</span
                >
              </div>
              <div class="metric-item">
                <i class="fas fa-chart-line"></i>
                <span
                  >{{
                    formatarPorcentagem(
                      getMetricaEspecifica(
                        usuario,
                        "presencas",
                        "percentualPresenca"
                      )
                    )
                  }}% presença</span
                >
              </div>
            </template>

            <template v-if="tipoAuditoria === 'ruptura'">
              <div class="metric-item">
                <i class="fas fa-box-open"></i>
                <span
                  >{{
                    getMetricaEspecifica(usuario, "rupturas", "totalItens")
                  }}
                  itens</span
                >
              </div>
              <div class="metric-item">
                <i class="fas fa-dollar-sign"></i>
                <span
                  >R$
                  {{
                    formatarMoeda(
                      getMetricaEspecifica(
                        usuario,
                        "rupturas",
                        "custoTotalRuptura"
                      )
                    )
                  }}</span
                >
              </div>
              <!-- Valor médio oculto temporariamente -->
            </template>

            <template v-if="tipoAuditoria === 'todos'">
              <div class="metric-item">
                <i class="fas fa-star"></i>
                <span>{{ usuario.pontuacao }} itens tota</span>
              </div>
            </template>
          </div>
        </div>

        <div
          class="ranking-badge"
          :class="getBadgeClass(viewMode === 'podium' ? index + 3 : index)"
        >
          {{ getRankingIcon(viewMode === "podium" ? index + 3 : index) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "RankingListColaboradores",
  props: {
    usuariosFiltradosOrdenados: {
      type: Array,
      required: true,
    },
    viewMode: {
      type: String,
      default: "list",
    },
    usuariosOrdenados: {
      type: Array,
      required: true,
    },
    tipoAuditoria: {
      type: String,
      default: "todos",
    },
  },
  setup(props) {
    const maxContador = computed(() => {
      return Math.max(...props.usuariosOrdenados.map((u) => u.contador), 1);
    });

    const calcularProgresso = (contador) => {
      return Math.round((contador / maxContador.value) * 100);
    };

    const getRankingClass = (displayIndex) => {
      // Calcular o índice real do usuário com base no modo de visualização
      let actualUserIndex;
      if (props.viewMode === 'podium') {
        actualUserIndex = displayIndex - 3;
      } else {
        actualUserIndex = displayIndex;
      }

      // Verificar se o índice é válido
      if (actualUserIndex < 0 || actualUserIndex >= props.usuariosFiltradosOrdenados.length) {
        return "standard";
      }

      const usuario = props.usuariosFiltradosOrdenados[actualUserIndex];

      if (displayIndex === 0) return "gold";
      if (displayIndex === 1) return "silver";
      if (displayIndex === 2) return "bronze";
      if (usuario && usuario.contador >= 500) return "top-ten";
      return "standard";
    };

    const getAvatarClass = (index) => {
      if (index === 0) return "gold";
      if (index === 1) return "silver";
      if (index === 2) return "bronze";
      return "standard";
    };

    const getBadgeClass = (displayIndex) => {
      // Calcular o índice real do usuário com base no modo de visualização
      let actualUserIndex;
      if (props.viewMode === 'podium') {
        actualUserIndex = displayIndex - 3;
      } else {
        actualUserIndex = displayIndex;
      }

      // Verificar se o índice é válido
      if (actualUserIndex < 0 || actualUserIndex >= props.usuariosFiltradosOrdenados.length) {
        return "standard";
      }

      const usuario = props.usuariosFiltradosOrdenados[actualUserIndex];

      if (displayIndex === 0) return "gold";
      if (displayIndex === 1) return "silver";
      if (displayIndex === 2) return "bronze";
      if (usuario && usuario.contador >= 500) return "top-ten";
      return "standard";
    };

    const getUserInitials = (nome) => {
      if (!nome || !nome.trim()) return "??";

      const palavras = nome.trim().split(" ");

      if (palavras.length === 1) {
        // Se só tem uma palavra, pega as duas primeiras letras
        return palavras[0].slice(0, 2).toUpperCase();
      }

      // Se tem múltiplas palavras, pega a primeira letra de cada uma (máximo 2)
      return palavras
        .slice(0, 2)
        .map((palavra) => palavra.charAt(0).toUpperCase())
        .join("");
    };

    const getUserIcon = (index) => {
      const icons = [
        "👑",
        "🥇",
        "🥈",
        "🥉",
        "⭐",
        "🌟",
        "✨",
        "💫",
        "🔥",
        "💎",
        "🚀",
        "⚡",
        "🎯",
        "🏆",
        "🎖️",
        "🏅",
        "🌠",
        "💪",
        "🎨",
        "🔮",
      ];
      return icons[index % icons.length];
    };

    const getRankingIcon = (displayIndex) => {
      // Calcular o índice real do usuário com base no modo de visualização
      let actualUserIndex;
      if (props.viewMode === 'podium') {
        actualUserIndex = displayIndex - 3;
      } else {
        actualUserIndex = displayIndex;
      }

      // Verificar se o índice é válido
      if (actualUserIndex < 0 || actualUserIndex >= props.usuariosFiltradosOrdenados.length) {
        return "🔸";
      }

      const usuario = props.usuariosFiltradosOrdenados[actualUserIndex];

      if (displayIndex === 0) return "👑";
      if (displayIndex === 1) return "🥈";
      if (displayIndex === 2) return "🥉";
      if (usuario && usuario.contador >= 500) return "⭐";
      return "🔸";
    };

    const getTipoAuditoriaDisplay = (tipo) => {
      const tipos = {
        etiqueta: "🏷️ Etiquetas",
        presenca: "👥 Presença",
        ruptura: "📦 Ruptura",
        todos: "📋 Todas",
      };
      return tipos[tipo] || tipo;
    };

    const getTipoBadgeClass = () => {
      const classes = {
        etiqueta: "badge-etiqueta",
        presenca: "badge-presenca",
        ruptura: "badge-ruptura",
        todos: "badge-todos",
      };
      return classes[props.tipoAuditoria] || "badge-default";
    };

    const getUnidadeMedida = () => {
      const unidades = {
        etiqueta: "etiquetas",
        presenca: "verificações",
        ruptura: "rupturas",
        todos: "itens",
      };
      return unidades[props.tipoAuditoria] || "itens";
    };

    const getMetricaEspecifica = (usuario, tipo, campo) => {
      if (!usuario.metricas || !usuario.metricas[tipo]) return 0;
      return usuario.metricas[tipo][campo] || 0;
    };

    const formatarMoeda = (valor) => {
      if (!valor) return "0,00";
      return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(valor);
    };

    const formatarPorcentagem = (valor) => {
      if (valor === null || valor === undefined) return "0.00";
      return parseFloat(valor.toFixed(2));
    };

    return {
      calcularProgresso,
      getRankingClass,
      getAvatarClass,
      getBadgeClass,
      getUserInitials,
      getUserIcon,
      getRankingIcon,
      getTipoAuditoriaDisplay,
      getTipoBadgeClass,
      getUnidadeMedida,
      getMetricaEspecifica,
      formatarMoeda,
      formatarPorcentagem,
    };
  },
  methods: {
    irParaPerfil(usuarioId) {
      window.location.href = `/perfil/${usuarioId}`;
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

.full-ranking-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  color: #1f2937;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.tipo-badge {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.badge-etiqueta {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.badge-presenca {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.badge-ruptura {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.badge-todos {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ranking-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #e2e8f0, #cbd5e1);
  transition: all 0.3s ease;
}

.ranking-item.gold::before {
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
}

.ranking-item.silver::before {
  background: linear-gradient(90deg, #c0c0c0, #e5e7eb, #c0c0c0);
}

.ranking-item.bronze::before {
  background: linear-gradient(90deg, #cd7f32, #f97316, #cd7f32);
}

.ranking-item.top-ten::before {
  background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
}

.ranking-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.rank-number {
  min-width: 50px;
  text-align: center;
}

.normal-rank {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4b5563;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.avatar-image,
.avatar-icon,
.avatar-initials {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.avatar-image {
  object-fit: cover;
  font-size: 0;
}

.avatar-initials {
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}

.avatar-image.gold,
.avatar-icon.gold,
.avatar-initials.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #92400e;
  text-shadow: 0 1px 2px rgba(146, 64, 14, 0.3);
}

.avatar-image.silver,
.avatar-icon.silver,
.avatar-initials.silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e5e7eb 100%);
  color: #374151;
  text-shadow: 0 1px 2px rgba(55, 65, 81, 0.3);
}

.avatar-image.bronze,
.avatar-icon.bronze,
.avatar-initials.bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #f97316 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-details {
  flex: 1;
}

.user-name {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.user-id {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.metrics-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.score-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.score-bar {
  width: 200px;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 50px;
  overflow: hidden;
}

.score-progress {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 50px;
  transition: width 0.5s ease;
}

.score-value {
  color: #1f2937;
  font-weight: 700;
  font-size: 1.125rem;
}

.type-specific-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
  max-width: 300px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  font-size: 0.8rem;
  color: #4b5563;
  font-weight: 500;
}

.metric-item i {
  color: #667eea;
  font-size: 0.75rem;
}

.ranking-badge {
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
}

.ranking-badge.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.ranking-badge.silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e5e7eb 100%);
}

.ranking-badge.bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #f97316 100%);
}

/* Estilo para o card clicável */
.clickable-profile {
  cursor: pointer;
}

.clickable-profile:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.clickable-profile:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .ranking-item {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .metrics-container {
    align-items: center;
    width: 100%;
  }

  .type-specific-info {
    justify-content: center;
    max-width: 100%;
  }

  .score-bar {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .section-title {
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1.5rem;
  }

  .type-specific-info {
    flex-direction: column;
    align-items: center;
  }

  .metric-item {
    justify-content: center;
    min-width: 120px;
  }
}
</style>
