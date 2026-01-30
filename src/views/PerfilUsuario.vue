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
            <button
              class="btn-edit-cover"
              @click="showCoverSelector = true"
              v-if="
                !userSessionStore.isUsuarioComum ||
                (userSessionStore.isUsuarioComum &&
                  usuario.id === userSessionStore.getUsuarioId)
              "
            >
              <i class="fas fa-pencil-alt"></i>
              <span class="btn-tooltip">Personalizar Perfil</span>
            </button>

            <!-- Badge de Usuário Comum -->
            <!-- <div
              v-if="
                userSessionStore.isUsuarioComum &&
                usuario.id === userSessionStore.getUsuarioId
              "
              class="usuario-comum-badge"
            >
              <i class="fas fa-user"></i> -->
            <!-- <span>Modo Visualização</span> -->
            <!-- </div>  -->

            <div class="header-actions">
              <button
                v-if="usuario.loja"
                class="user-status"
                @click="irParaPerfilLoja"
              >
                <img
                  src="@/assets/svg/StorePerfil.svg"
                  alt="Loja"
                  class="store-icon"
                />
                {{ usuario.loja.nome }}
              </button>

              <!-- Botão de Logout para Usuário Comum -->
              <button
                v-if="userSessionStore.isUsuarioComum"
                class="btn-logout"
                @click="fazerLogout"
                title="Sair"
              >
                <i class="fas fa-sign-out-alt"></i>
              </button>
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
              <span class="xp-text">
                {{ usuario.xpAtual }} XP | Faltam {{ usuario.xpParaProximoNivel }} XP para o próximo nível
              </span>
            </div>
          </div>

          <div class="perfil-stats">
            <div class="stat-item">
              <div class="stat-number">
                {{ usuario.totaisAcumulados?.itensLidosTotal || usuario.contador || 0 }}
              </div>
              <div class="stat-label">Itens Auditados</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">#{{ usuario.ranking?.posicaoLoja || posicaoRanking }}</div>
              <div class="stat-label">Ranking</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ usuario.totalAuditorias || 0 }}</div>
              <div class="stat-label">Auditorias</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegação para Rankings - Visível para Usuário Comum -->
      <NavegacaoRankings
        v-if="userSessionStore.isUsuarioComum"
        :loja-link="usuario.loja ? `/perfil-loja/${usuario.loja.codigo}` : null"
      />

      <!-- Navegação por Abas -->
      <PerfilNavegacao :aba-ativa="abaAtiva" @mudar-aba="abaAtiva = $event" />

      <!-- Progresso -->
      <ProgressoUsuario
        v-if="abaAtiva === 'progresso'"
        :usuario="usuario"
        :posicao-ranking="posicaoRanking"
        :total-conquistas="conquistasDesbloqueadas.length"
        :conquistas-pendentes="conquistasBloqueadas.length"
      />

      <!-- Minha Auditoria -->
      <MinhaAuditoria v-if="abaAtiva === 'auditoria'" :usuario="usuario" />

      <!-- Colegas da Mesma Loja -->
      <ColegasLoja
        v-if="abaAtiva === 'colegas' && usuario.loja && usuario.loja.nome"
        :loja="usuario.loja.nome"
        :usuario-atual-id="usuario.id"
      />

      <!-- Galeria de Conquistas -->
      <div v-if="abaAtiva === 'conquistas'" class="conquistas-gallery">
        <div class="gallery-header">
          <div class="header-title">
            <h2>
              <i class="fas fa-trophy"></i>
              Galeria de Conquistas
            </h2>
            <p class="subtitle">Desbloqueie conquistas e ganhe XP extra!</p>
          </div>

          <div class="progresso-geral">
            <div class="progresso-info">
              <span class="progresso-label">Progresso Geral</span>
              <span class="progresso-numeros">
                {{ conquistasDesbloqueadas.length }} /
                {{ todasConquistas.length }}
              </span>
            </div>
            <div class="progresso-bar">
              <div
                class="progresso-fill"
                :style="{ width: progressoPercentual + '%' }"
              >
                <span class="progresso-text">{{ progressoPercentual }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros e Ordenação -->
        <div class="conquistas-controls">
          <div class="filtros-tabs">
            <button
              class="tab-btn"
              :class="{ active: filtroAtivo === 'todas' }"
              @click="filtroAtivo = 'todas'"
            >
              <i class="fas fa-list"></i>
              Todas ({{ todasConquistas.length }})
            </button>
            <button
              class="tab-btn"
              :class="{ active: filtroAtivo === 'desbloqueadas' }"
              @click="filtroAtivo = 'desbloqueadas'"
            >
              <i class="fas fa-check-circle"></i>
              Desbloqueadas ({{ conquistasDesbloqueadas.length }})
            </button>
            <button
              class="tab-btn"
              :class="{ active: filtroAtivo === 'bloqueadas' }"
              @click="filtroAtivo = 'bloqueadas'"
            >
              <i class="fas fa-lock"></i>
              Bloqueadas ({{ conquistasBloqueadas.length }})
            </button>
          </div>

          <div class="ordenacao">
            <label>
              <i class="fas fa-sort"></i>
              Ordenar:
            </label>
            <select v-model="ordenacaoAtiva" class="ordenacao-select">
              <option value="padrao">Padrão</option>
              <option value="xp-desc">Maior XP</option>
              <option value="xp-asc">Menor XP</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </div>
        </div>

        <!-- Grid de Conquistas -->
        <div v-if="conquistasFiltradas.length === 0" class="conquistas-empty">
          <i class="fas fa-medal"></i>
          <p>Nenhuma conquista encontrada nesta categoria.</p>
        </div>

        <div v-else class="conquistas-grid">
          <div
            v-for="conquista in conquistasFiltradas"
            :key="conquista.achievementId"
            class="conquista-card"
            :class="{
              desbloqueada: conquista.desbloqueada,
              rara: conquista.rarity === 'Raro' || conquista.rarity === 'Epico' || conquista.rarity === 'Lendario' || conquista.rarity === 'Diamante' || conquista.rarity === 'Especial',
              epica: conquista.rarity === 'Epico' || conquista.rarity === 'Lendario' || conquista.rarity === 'Diamante' || conquista.rarity === 'Especial',
            }"
          >
            <!-- Badge de Raridade -->
            <div
              v-if="conquista.desbloqueada && conquista.rarity"
              class="badge-raridade"
              :class="conquista.rarity.toLowerCase()"
            >
              <span>{{ conquista.rarity }}</span>
            </div>

            <div class="conquista-icon">
              {{ conquista.desbloqueada ? conquista.icon : "🔒" }}
            </div>

            <div class="conquista-content">
              <h4 class="conquista-titulo">{{ conquista.title }}</h4>
              <p class="conquista-descricao">{{ conquista.description }}</p>

              <div class="conquista-footer">
                <span class="conquista-xp">
                  <i class="fas fa-star"></i>
                  {{ conquista.points }} XP
                </span>

                <!-- Data de desbloqueio (se disponível) -->
                <span
                  v-if="conquista.desbloqueada && conquista.unlockedAt"
                  class="conquista-data"
                >
                  <i class="fas fa-calendar"></i>
                  {{ formatarData(conquista.unlockedAt) }}
                </span>

                <!-- Progresso (para conquistas progressivas) -->
                <span
                  v-if="!conquista.desbloqueada && conquista.progresso"
                  class="conquista-progresso"
                >
                  {{ conquista.progresso }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estatísticas Adicionais -->
        <div class="conquistas-stats">
          <div class="stat-box">
            <i class="fas fa-fire"></i>
            <div class="stat-info">
              <span class="stat-value">{{ xpTotalConquistas }}</span>
              <span class="stat-label">XP Total</span>
            </div>
          </div>
          <div class="stat-box">
            <i class="fas fa-star"></i>
            <div class="stat-info">
              <span class="stat-value">{{ conquistasRaras }}</span>
              <span class="stat-label">XP de Conquistas</span>
            </div>
          </div>
          <div class="stat-box">
            <i class="fas fa-gem"></i>
            <div class="stat-info">
              <span class="stat-value">{{ conquistasEpicas }}</span>
              <span class="stat-label">XP de Auditoria</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Fecha conquistas-gallery -->
    </div>
    <!-- Fecha v-else -->
  </div>
  <!-- Fecha perfil-usuario-container -->
</template>

<script>
import { useRouter } from "vue-router";
import { useNivelStore } from "@/store/nivelStore";
import { useLojaStore } from "@/store/lojaStore";
import { useUserSessionStore } from "@/store/userSessionStore";
import UserCoverSelector from "@/components/UserCoverSelector.vue";
import ColegasLoja from "@/components/ColegasLoja.vue";
import NavegacaoRankings from "@/components/NavegacaoRankings.vue";
import PerfilNavegacao from "@/views/Perfiltemplate/PerfilNavegacao.vue";
import MinhaAuditoria from "@/views/Perfiltemplate/MinhaAuditoria.vue";
import ProgressoUsuario from "@/views/Perfiltemplate/ProgressoUsuario.vue";
import api from "@/config/api";
import axios from "axios";

export default {
  name: "PerfilUsuario",
  components: {
    UserCoverSelector,
    ColegasLoja,
    NavegacaoRankings,
    PerfilNavegacao,
    MinhaAuditoria,
    ProgressoUsuario,
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
    const userSessionStore = useUserSessionStore();

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
      userSessionStore,
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
        loja: null, // Informação da loja do usuário
      },
      carregando: true,
      todasConquistas: [],
      showCoverSelector: false,
      filtroAtivo: "todas",
      ordenacaoAtiva: "padrao",
      abaAtiva: "conquistas",
    };
  },
  watch: {
    // Monitorar mudanças no ID da rota para recarregar o perfil
    id(novoId, antigoId) {
      if (novoId !== antigoId) {
        this.carregarUsuarioPorId(novoId);
      }
    },
  },
  async mounted() {
    try {
      // Carregar dados do usuário específico
      await this.carregarUsuarioPorId(this.id);

      // Carregar conquistas do usuário do modelo ConquistasUsuario
      await this.carregarConquistasUsuario();
    } catch (error) {
      console.error("Erro ao inicializar perfil:", error);
    } finally {
      this.carregando = false;
    }
  },
  computed: {
    xpProgressoPercentual() {
      // Primeiro tenta usar o progresso do modelo MetricasUsuario
      if (this.usuario.achievements && this.usuario.achievements.level &&
          this.usuario.achievements.level.progressPercentage !== undefined) {
        return this.usuario.achievements.level.progressPercentage;
      }

      // Caso contrário, calcula manualmente com base no XP para o próximo nível
      // A barra de progresso deve representar o progresso até o próximo nível
      // Regras:
      // xpTotal = XP total acumulado do usuário (this.usuario.xpAtual)
      // xpFaltando = XP que falta para o próximo nível (this.usuario.xpParaProximoNivel)
      // xpProximoNivel = xpTotal + xpFaltando
      // Cálculo da barra: progresso = xpTotal / xpProximoNivel, porcentagem = progresso * 100
      if (this.usuario.xpAtual !== undefined && this.usuario.xpParaProximoNivel !== undefined) {
        // Calcular o XP total necessário para o próximo nível
        const xpTotalProximoNivel = this.usuario.xpAtual + this.usuario.xpParaProximoNivel;

        // Calcular o progresso como porcentagem do caminho até o próximo nível
        if (xpTotalProximoNivel > 0) {
          const progresso = this.usuario.xpAtual / xpTotalProximoNivel;
          const porcentagem = progresso * 100;

          // Limitar entre 0 e 100
          return Math.max(0, Math.min(100, porcentagem));
        }
      }

      // Caso contrário, usa o valor existente no objeto do usuário
      return this.usuario.progressoXp || 0;
    },

    posicaoRanking() {
      if (!this.usuario.id) return "-";
      // Primeiro tenta usar o ranking do modelo MetricasUsuario
      if (this.usuario.ranking && this.usuario.ranking.posicaoLoja !== undefined) {
        return this.usuario.ranking.posicaoLoja;
      }
      // Caso contrário, calcula pela store (fallback)
      try {
        return this.nivelStore.calcularPosicaoRanking(this.usuario.id);
      } catch (error) {
        console.warn("Erro ao calcular posição ranking:", error);
        return "-";
      }
    },

    conquistasDesbloqueadas() {
      return this.todasConquistas.filter((c) => c.desbloqueada);
    },

    conquistasBloqueadas() {
      return this.todasConquistas.filter((c) => !c.desbloqueada);
    },

    progressoPercentual() {
      if (this.todasConquistas.length === 0) return 0;
      return Math.round(
        (this.conquistasDesbloqueadas.length / this.todasConquistas.length) *
          100,
      );
    },

    conquistasFiltradas() {
      let conquistas = [];

      // Aplicar filtro
      switch (this.filtroAtivo) {
        case "desbloqueadas":
          conquistas = this.conquistasDesbloqueadas;
          break;
        case "bloqueadas":
          conquistas = this.conquistasBloqueadas;
          break;
        default:
          conquistas = [...this.todasConquistas];
      }

      // Aplicar ordenação
      switch (this.ordenacaoAtiva) {
        case "xp-desc":
          return conquistas.sort((a, b) => b.points - a.points);
        case "xp-asc":
          return conquistas.sort((a, b) => a.points - b.points);
        case "nome":
          return conquistas.sort((a, b) => a.title.localeCompare(b.title));
        default:
          return conquistas;
      }
    },

    xpTotalConquistas() {
      // Usando o campo xp.total do usuário em vez de calcular a soma das conquistas
      return this.usuario.achievements?.xp?.total || 0;
    },

    conquistasRaras() {
      // Usando o campo xp.fromAchievements do usuário
      return this.usuario.achievements?.xp?.fromAchievements || 0;
    },

    conquistasEpicas() {
      // Usando o campo xp.fromActivities do usuário
      return this.usuario.achievements?.xp?.fromActivities || 0;
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

        // Fetch user data from the metricas endpoint
        const config = {
          headers: {
            "x-loja": this.lojaStore.codigoLojaAtual || "056",
          },
        };

        // Primeiro, buscar as métricas do usuário específico
        const response = await api.get(`/metricas/usuarios/${usuarioId}`, config);
        let usuarioMetricas = response.data; // Agora pegamos diretamente os dados do usuário específico

        if (usuarioMetricas) {
          // Calculate XP total based on the achievements data if available
          const xpTotal = usuarioMetricas.achievements?.xp?.total ||
                         (usuarioMetricas.contadores?.totalGeral || 0) + (usuarioMetricas.xpConquistas || 0);

          // Use XP values from achievements if available, otherwise calculate
          const nivel = usuarioMetricas.achievements?.level?.current || this.nivelStore.calcularNivel(xpTotal);
          const xpParaProximoNivel = usuarioMetricas.achievements?.level?.xpForNextLevel || this.nivelStore.calcularXpRestante(xpTotal);
          const progressoXp = usuarioMetricas.achievements?.level?.progressPercentage || ((xpTotal % 100) / 100) * 100; // Percentage of current XP toward next level

          // Get additional user data from the original API if needed
          let usuarioCompleto = {};
          try {
            const lojaSelecionada = JSON.parse(
              localStorage.getItem("lojaSelecionada") || '{"codigo":"056"}',
            );

            const usuarioResponse = await axios.get(
              `http://localhost:3000/api/usuarios/${usuarioId}`,
              {
                headers: {
                  "x-loja": lojaSelecionada.codigo,
                },
              },
            );

            usuarioCompleto = usuarioResponse.data || {};
          } catch (fetchError) {
            console.warn("Could not fetch additional user data:", fetchError);
          }

          this.usuario = {
            ...usuarioCompleto, // Original user data
            id: usuarioMetricas.id,
            nome: usuarioMetricas.nome,
            contador: usuarioMetricas.contador || 0, // Itens auditados from metricas
            totalAuditorias: usuarioMetricas.contadores?.totalGeral || 0, // Total auditorias from metricas usando o campo correto do endpoint
            ranking: usuarioMetricas.ranking || {}, // Adicionando informações de ranking do modelo MetricasUsuario
            totaisAcumulados: usuarioMetricas.totaisAcumulados || {}, // Adicionando totais acumulados do modelo MetricasUsuario
            foto: this.getFotoUrl(usuarioCompleto),
            iniciais: this.obterIniciais(usuarioMetricas.nome),
            nivel: usuarioMetricas.achievements?.level?.current || nivel,
            titulo: usuarioMetricas.achievements?.level?.title || this.nivelStore.obterTitulo(nivel || usuarioMetricas.achievements?.level?.current),
            xpAtual: usuarioMetricas.achievements?.xp?.total || xpTotal,
            xpParaProximoNivel: usuarioMetricas.achievements?.level?.xpForNextLevel || xpParaProximoNivel,
            progressoXp: usuarioMetricas.achievements?.level?.progressPercentage || progressoXp,
            conquistas: usuarioCompleto.conquistas || [],
            achievements: usuarioMetricas.achievements || {}, // Adicionando as conquistas do modelo MetricasUsuario
            coverId: usuarioCompleto.coverId || "gradient-1",
            selectedBadges: usuarioCompleto.selectedBadges || [],
            loja: usuarioCompleto.loja || null,
          };

          // Update the user in nivelStore to keep it consistent
          const indexInStore = this.nivelStore.usuarios.findIndex(
            (u) => u.id === usuarioId,
          );
          if (indexInStore !== -1) {
            this.nivelStore.usuarios[indexInStore] = { ...usuarioMetricas };
          } else {
            // If user doesn't exist in store, add it
            this.nivelStore.usuarios.push({ ...usuarioMetricas });
          }
        } else {
          console.error(
            "Usuário não encontrado nos dados de métricas:",
            usuarioId,
          );
          this.usuario = {}; // Clear user to show error screen
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        this.carregando = false;
      }
    },

    async carregarConquistasUsuario() {
      try {
        // Buscar conquistas do usuário diretamente do modelo MetricasUsuario via endpoint específico
        const config = {
          headers: {
            "x-loja": this.lojaStore.codigoLojaAtual || "056",
          },
        };

        // Buscar as conquistas específicas do usuário
        const response = await api.get(`/metricas/conquistas/${this.usuario.id}`, config);

        if (response.data && response.data.achievements && response.data.achievements.achievements) {
          // Processar as conquistas do modelo MetricasUsuario
          const conquistasUsuario = response.data.achievements.achievements || [];

          // Mapear as conquistas do usuário para o formato esperado pelo template
          this.todasConquistas = conquistasUsuario.map(conquista => {
            return {
              achievementId: conquista.achievementId,
              title: conquista.achievementData?.title || conquista.title || 'Conquista Desconhecida',
              description: conquista.achievementData?.description || conquista.description || 'Descrição não disponível',
              icon: conquista.achievementData?.icon || conquista.icon || '🏆',
              rarity: conquista.rarity || conquista.achievementData?.rarity || 'Comum',
              points: conquista.fixedXpValue || conquista.achievementData?.points || 0,
              desbloqueada: conquista.unlocked || false,
              unlockedAt: conquista.unlockedAt,
              progresso: conquista.progress?.percentage || 0,
              criteria: conquista.achievementData?.criteria || conquista.criteria || {}
            };
          });

          // Atualizar também os dados de achievements no objeto do usuário para garantir consistência
          if (response.data.achievements) {
            this.usuario.achievements = {
              ...this.usuario.achievements,
              ...response.data.achievements
            };
          }
        } else {
          // Se não encontrar conquistas específicas, usar as do modelo MetricasUsuario como fallback
          this.processarConquistasUsuario();
        }
      } catch (error) {
        console.warn("Erro ao carregar conquistas específicas do usuário, usando fallback:", error);
        // Em caso de erro, usar as conquistas do modelo MetricasUsuario como fallback
        this.processarConquistasUsuario();
      }
    },

    processarConquistasUsuario() {
      // Processar as conquistas diretamente do modelo MetricasUsuario (fallback)
      const conquistasUsuario = this.usuario.achievements?.achievements || [];

      // Mapear as conquistas do usuário para o formato esperado pelo template
      this.todasConquistas = conquistasUsuario.map(conquista => {
        return {
          achievementId: conquista.achievementId,
          title: conquista.achievementData?.title || conquista.title || 'Conquista Desconhecida',
          description: conquista.achievementData?.description || conquista.description || 'Descrição não disponível',
          icon: conquista.achievementData?.icon || conquista.icon || '🏆',
          rarity: conquista.rarity || conquista.achievementData?.rarity || 'Comum',
          points: conquista.fixedXpValue || conquista.achievementData?.points || 0,
          desbloqueada: conquista.unlocked || false,
          unlockedAt: conquista.unlockedAt,
          progresso: conquista.progress?.percentage || 0,
          criteria: conquista.achievementData?.criteria || conquista.criteria || {}
        };
      });
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
      const seed = usuario.nome
        ? encodeURIComponent(usuario.nome.toLowerCase())
        : "default";
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

    irParaPerfilLoja() {
      if (this.usuario.loja && this.usuario.loja.codigo) {
        this.$router.push(`/perfil-loja/${this.usuario.loja.codigo}`);
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

    formatarData(data) {
      if (!data) return "";
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      });
    },

    fazerLogout() {
      // Fazer logout do usuário comum
      this.userSessionStore.logoutUsuarioComum();

      // Redirecionar para a página de login
      this.$router.push("/login");
    },

    mudarAba(aba) {
      this.abaAtiva = aba;
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

.header-actions {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.usuario-comum-badge {
  background: rgba(52, 152, 219, 0.95);
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.95rem;
  color: white;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.usuario-comum-badge i {
  font-size: 1rem;
}

.btn-logout {
  background: rgba(231, 76, 60, 0.95);
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
  color: white;
  flex-shrink: 0;
}

.btn-logout:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
  background: rgba(192, 57, 43, 0.95);
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
  background: rgba(255, 255, 255, 0.95);
  color: #2859c5;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-status:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: white;
}

.store-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
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

.loja-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.loja-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 18px rgba(16, 185, 129, 0.4);
}

.loja-badge i {
  font-size: 0.9rem;
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

.gallery-header {
  margin-bottom: 2rem;
}

.header-title {
  margin-bottom: 1.5rem;
}

.gallery-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gallery-header h2 i {
  color: #f59e0b;
  font-size: 1.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

.progresso-geral {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
}

.progresso-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.progresso-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.progresso-numeros {
  font-weight: 700;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progresso-bar {
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progresso-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 10px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}

.progresso-text {
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Controles de Filtros */
.conquistas-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  flex-wrap: wrap;
}

.filtros-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tab-btn i {
  font-size: 0.85rem;
}

.ordenacao {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ordenacao label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ordenacao-select {
  padding: 0.6rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ordenacao-select:hover,
.ordenacao-select:focus {
  border-color: #667eea;
  outline: none;
}

/* Empty State */
.conquistas-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.conquistas-empty i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.conquistas-empty p {
  font-size: 1.1rem;
  margin: 0;
}

/* Grid de Conquistas */
.conquistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.conquista-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  opacity: 0.6;
  filter: grayscale(70%);
  position: relative;
  overflow: hidden;
}

.conquista-card:hover {
  transform: translateY(-3px);
}

.conquista-card.desbloqueada {
  opacity: 1;
  filter: grayscale(0%);
  background: white;
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
}

.conquista-card.rara.desbloqueada {
  border-color: #8b5cf6;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
}

.conquista-card.epica.desbloqueada {
  border-color: #f59e0b;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
  animation: pulse-epic 2s ease-in-out infinite;
}

@keyframes pulse-epic {
  0%,
  100% {
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 6px 30px rgba(245, 158, 11, 0.5);
  }
}

.badge-raridade {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.badge-raridade.basica {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.badge-raridade.comum {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.badge-raridade.raro {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.badge-raridade.epico {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.badge-raridade.lendario {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.badge-raridade.diamante {
  background: linear-gradient(135deg, #06b6d4, #0e7490);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
}

.badge-raridade.especial {
  background: linear-gradient(135deg, #ec4899, #db2777);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
}

.conquista-card.epica .badge-raridade {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.conquista-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.conquista-card.desbloqueada:hover .conquista-icon {
  transform: scale(1.15) rotate(5deg);
}

.conquista-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conquista-titulo {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.conquista-descricao {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  min-height: 40px;
  line-height: 1.4;
}

.conquista-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.conquista-xp {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.conquista-data {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;
}

.conquista-data i {
  font-size: 0.7rem;
}

.conquista-progresso {
  display: inline-block;
  background: #fef3c7;
  color: #f59e0b;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Estatísticas de Conquistas */
.conquistas-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.stat-box {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.stat-box i {
  font-size: 2rem;
  color: #667eea;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
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

  .usuario-comum-badge {
    padding: 6px 12px;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .usuario-comum-badge i {
    font-size: 0.8rem;
  }

  .header-actions {
    gap: 8px;
  }

  .btn-logout {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
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

  .loja-badge {
    font-size: 0.75rem;
    padding: 5px 12px;
    border-radius: 15px;
  }

  .loja-badge i {
    font-size: 0.8rem;
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

  .gallery-header h2 {
    font-size: 1.4rem;
  }

  .gallery-header h2 i {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .progresso-geral {
    padding: 1rem;
  }

  .progresso-label,
  .progresso-numeros {
    font-size: 0.85rem;
  }

  .conquistas-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filtros-tabs {
    justify-content: center;
  }

  .tab-btn {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }

  .ordenacao {
    justify-content: space-between;
  }

  .ordenacao label {
    font-size: 0.85rem;
  }

  .ordenacao-select {
    flex: 1;
    max-width: 200px;
    font-size: 0.85rem;
    padding: 0.5rem 0.8rem;
  }

  .conquistas-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .conquista-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .conquista-icon {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }

  .conquista-titulo {
    font-size: 0.95rem;
  }

  .conquista-descricao {
    font-size: 0.75rem;
    margin-bottom: 0.8rem;
    min-height: 35px;
  }

  .conquista-footer {
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .conquista-xp {
    padding: 3px 10px;
    font-size: 0.7rem;
  }

  .conquista-data {
    font-size: 0.7rem;
  }

  .badge-raridade {
    top: 5px;
    right: 5px;
    padding: 3px 8px;
    font-size: 0.6rem;
  }

  .conquistas-stats {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }

  .stat-box {
    padding: 1rem;
  }

  .stat-box i {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .conquistas-empty {
    padding: 3rem 1rem;
  }

  .conquistas-empty i {
    font-size: 3rem;
  }

  .conquistas-empty p {
    font-size: 0.95rem;
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

  .tab-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }

  .ordenacao-select {
    font-size: 0.8rem;
  }

  .conquistas-stats {
    gap: 0.6rem;
  }

  .stat-box {
    padding: 0.8rem;
  }

  .stat-value {
    font-size: 1.3rem;
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
