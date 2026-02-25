<template>
  <div class="perfil-header">
    <div class="perfil-cover" :style="coverStyle">
      <div class="cover-pattern"></div>
      <div class="cover-overlay">
        <button
          class="btn-edit-cover"
          @click="showCoverSelector = true"
          v-if="!userSessionStore.isUsuarioComum"
        >
          <i class="fas fa-pencil-alt"></i>
          <span class="btn-tooltip">Editar Tema e Informações da Loja</span>
        </button>
        <div class="loja-status" :class="statusAuditoria.classe">
          <i class="fas" :class="statusAuditoria.icone"></i>
          {{ statusAuditoria.texto }}
          <span
            v-if="statusAuditoria.contagem !== null"
            class="contagem-regressiva"
          >
            {{ statusAuditoria.contagem }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal de Seleção de Cover -->
    <CoverSelector
      v-model="showCoverSelector"
      :current-cover="loja.coverId"
      :loja-codigo="loja.codigo"
      @cover-selected="handleCoverSelected"
      @info-updated="handleInfoUpdated"
    />

    <div class="perfil-info">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img
            v-if="loja.imagem"
            :src="loja.imagem"
            :alt="loja.nome"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            {{ loja.iniciais }}
          </div>
          <div class="avatar-badge" v-if="loja.premium">
            <span class="icon">⭐</span>
          </div>
          <span class="avatar-codigo">#{{ loja.codigo }}</span>
        </div>
      </div>

      <div class="perfil-details">
        <div class="loja-header">
          <!-- Botão de informação mobile -->
          <button
            class="btn-info-mobile"
            @click="toggleInfo"
            title="Ver informações da loja"
          >
            <i class="fas fa-info-circle"></i>
          </button>

          <h1 class="loja-nome">
            {{ loja.nome }}
            <span
              v-if="loja.nomeCompleto && loja.nomeCompleto !== loja.nome"
              class="loja-nome-completo"
              >-
              {{
                loja.nomeCompleto.replace("Loja " + loja.codigo + " ", "")
              }}</span
            >
          </h1>
        </div>

        <!-- Informações da loja (visível no desktop, colapsável no mobile) -->
        <div class="loja-informacoes" :class="{ expandido: mostrarInfo }">
          <p class="loja-endereco">
            <i class="fas fa-map-marker-alt"></i>
            {{ loja.endereco }} • {{ loja.cidade }}
          </p>
          <p class="loja-contato">
            <i class="fas fa-phone"></i>
            {{ loja.telefone }} •
            <i class="fas fa-user-tie"></i>
            Gerente: {{ loja.gerente }}
          </p>

          <div class="loja-horario">
            <i class="fas fa-clock"></i>
            <span v-if="auditoriaHoje">
              Próxima auditoria hoje: das {{ auditoriaHoje.inicio }} às
              {{ auditoriaHoje.fim }}
            </span>
            <span v-else-if="auditoriaRolando">
              Auditoria rolando: termina em {{ tempoRestante }}
            </span>
            <span v-else>
              Próxima auditoria {{ proximaDescricao }}: das
              {{ proximaHorario.inicio }} às {{ proximaHorario.fim }}
            </span>
          </div>
        </div>
      </div>

      <!-- Badges Section -->
      <div
        v-if="loja.selectedBadges && loja.selectedBadges.length > 0"
        class="badges-section"
      >
        <div class="badges-container">
          <div
            v-for="badgeId in loja.selectedBadges"
            :key="badgeId"
            class="badge-item"
            :title="getBadgeDescription(badgeId)"
          >
            <i class="fas badge-icon" :class="getBadgeIcon(badgeId)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CoverSelector from "@/components/CoverSelector.vue";
import axios from "axios";
import { useLojaStore } from "@/store/lojaStore.js";
import { useUserSessionStore } from "@/store/userSessionStore";

export default {
  name: "PerfilHeaderLoja",
  components: {
    CoverSelector,
  },
  setup() {
    const userSessionStore = useUserSessionStore();
    return {
      userSessionStore,
    };
  },
  props: {
    loja: {
      type: Object,
      required: true,
      default: () => ({
        nome: "Nome da Loja",
        nomeCompleto: "",
        codigo: "000",
        endereco: "Endereço da Loja",
        cidade: "Cidade",
        telefone: "(00) 00000-0000",
        gerente: "Nome do Gerente",
        horarioFuncionamento: "08:00 - 18:00",
        imagem: null,
        iniciais: "NL",
        premium: false,
        status: "ativa",
        totalAuditorias: 0,
        setoresAtivos: 0,
        percentualDesempenho: 0,
        coverId: null,
      }),
    },
  },
  data() {
    return {
      showCoverSelector: false,
      mostrarInfo: false,
      statusAuditoria: {
        texto: "Verificando status...",
        classe: "verificando",
        icone: "fa-sync-alt",
        contagem: null,
      },
      auditoriaHoje: null,
      auditoriaRolando: false,
      tempoRestante: "",
      proximaDescricao: "",
      proximaHorario: { inicio: "", fim: "" },
      intervalo: null,
    };
  },
  created() {
    // Initialize selectedBadges if not present
    if (!this.loja.selectedBadges) {
      this.loja.selectedBadges = [];
    }
  },
  computed: {
    coverStyle() {
      const coverId = this.loja.coverId || "gradient-1";

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
        // Define pattern mappings matching CoverSelector.vue
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
    horariosAuditoria() {
      return {
        1: { nome: "Segunda-feira", inicio: "11:00", fim: "17:00" },
        2: { nome: "Terça-feira", inicio: "08:00", fim: "18:00" },
        3: { nome: "Quarta-feira", inicio: "08:00", fim: "12:00" },
        4: { nome: "Quinta-feira", inicio: "11:00", fim: "17:00" },
      };
    },
    diasSemana() {
      return [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ];
    },
    auditoriaNome() {
      const diaSemana = new Date().getDay();
      const info = this.horariosAuditoria[diaSemana];
      return info ? info.nome : "";
    },
    proximaAuditoriaNome() {
      const hoje = new Date();
      let prox = (hoje.getDay() + 1) % 7;
      for (let i = 0; i < 7; i++) {
        if (this.horariosAuditoria[prox]) {
          const info = this.horariosAuditoria[prox];
          return info.nome;
        }
        prox = (prox + 1) % 7;
      }
      return "";
    },
    progressoAtual() {
      // Valor fixo para exibição, pode ser alterado depois
      return 0;
    },
  },
  methods: {
    toggleInfo() {
      this.mostrarInfo = !this.mostrarInfo;
    },

    atualizarStatusAuditoria() {
      const agora = new Date();
      const diaSemana = agora.getDay(); // 0=Domingo, 1=Segunda, etc.
      const horarioHoje = this.horariosAuditoria[diaSemana];
      this.auditoriaHoje = null;
      this.auditoriaRolando = false;
      this.tempoRestante = "";
      // Se hoje é dia de auditoria
      if (horarioHoje) {
        const [inicioH, inicioM] = horarioHoje.inicio.split(":").map(Number);
        const [fimH, fimM] = horarioHoje.fim.split(":").map(Number);
        const inicioAuditoria = new Date(agora);
        inicioAuditoria.setHours(inicioH, inicioM, 0, 0);
        const fimAuditoria = new Date(agora);
        fimAuditoria.setHours(fimH, fimM, 0, 0);
        if (agora < inicioAuditoria) {
          // Próxima auditoria hoje
          this.auditoriaHoje = horarioHoje;
          // Status: pré-auditoria (contagem regressiva)
          const diffMs = inicioAuditoria - agora;
          const minutosParaInicio = Math.floor(diffMs / (1000 * 60));
          this.statusAuditoria = {
            texto: "Auditoria começa em",
            classe: "pre-auditoria",
            icone: "fa-clock",
            contagem:
              minutosParaInicio >= 60
                ? `${Math.floor(minutosParaInicio / 60)} horas`
                : `${minutosParaInicio} min`,
          };
        } else if (agora >= inicioAuditoria && agora <= fimAuditoria) {
          // Auditoria rolando
          this.auditoriaRolando = true;
          // Calcular tempo restante
          const diffMs = fimAuditoria - agora;
          const horas = Math.floor(diffMs / (1000 * 60 * 60));
          const minutos = Math.floor((diffMs / (1000 * 60)) % 60);
          this.tempoRestante = `${horas > 0 ? horas + "h " : ""}${minutos}min`;
          // Status: em andamento
          this.statusAuditoria = {
            texto: "Auditoria em andamento",
            classe: "em-andamento",
            icone: "fa-play-circle",
            contagem: null,
          };
        } else {
          // Já passou do horário de auditoria hoje
          this.statusAuditoria = {
            texto: "Auditoria encerrada",
            classe: "encerrada",
            icone: "fa-check-circle",
            contagem: null,
          };
        }
      } else {
        // Não é dia de auditoria
        this.statusAuditoria = {
          texto: "Nenhuma auditoria hoje",
          classe: "sem-auditoria",
          icone: "fa-calendar-times",
          contagem: null,
        };
      }
      // Se não é dia de auditoria ou já passou, buscar próximo dia
      if (!this.auditoriaHoje && !this.auditoriaRolando) {
        let diasProx = 1;
        let proxDia = (diaSemana + 1) % 7;
        while (diasProx <= 7) {
          if (this.horariosAuditoria[proxDia]) {
            this.proximaDescricao = this.diasSemana[proxDia];
            this.proximaHorario = this.horariosAuditoria[proxDia];
            break;
          }
          proxDia = (proxDia + 1) % 7;
          diasProx++;
        }
      }
    },

    calcularProximaAuditoria(diaAtual) {
      // Encontrar o próximo dia com auditoria
      let diasParaProxima = 1;
      let proximoDia = (diaAtual + 1) % 7;

      while (diasParaProxima <= 7) {
        if (this.horariosAuditoria[proximoDia]) {
          const diasSemana = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
          ];
          this.proximaAuditoria = `${diasSemana[proximoDia]} ${this.horariosAuditoria[proximoDia].inicio}`;
          return;
        }
        proximoDia = (proximoDia + 1) % 7;
        diasParaProxima++;
      }

      this.proximaAuditoria = "";
    },

    async handleCoverSelected(payload) {
      console.log("Dados selecionados:", payload);

      try {
        if (payload.coverType === "badges") {
          // Handle badge selection
          this.loja.selectedBadges = payload.selectedBadges;

          // Update in backend
          const response = await this.updateBadgesOnBackend(
            payload.selectedBadges,
          );

          if (response.success) {
            console.log(
              "Selos atualizados com sucesso:",
              payload.selectedBadges,
            );
          } else {
            console.error(
              "Erro ao atualizar selos no backend:",
              response.message,
            );
          }

          // Update the store if it's the selected one
          const lojaStore = useLojaStore();
          if (
            lojaStore.lojaSelecionada &&
            lojaStore.lojaSelecionada.codigo === this.loja.codigo
          ) {
            lojaStore.lojaSelecionada.selectedBadges = [
              ...payload.selectedBadges,
            ];

            // Update in localStorage as well
            localStorage.setItem(
              "lojaSelecionada",
              JSON.stringify(lojaStore.lojaSelecionada),
            );
          }
        } else {
          // Handle cover selection (gradients, patterns, images)
          const response = await this.updateCoverOnBackend(payload.coverId);

          if (response.success) {
            // Atualizar a loja no componente local
            this.loja.coverId = payload.coverId;

            // Atualizar a loja na store se estiver selecionada
            const lojaStore = useLojaStore();
            if (
              lojaStore.lojaSelecionada &&
              lojaStore.lojaSelecionada.codigo === this.loja.codigo
            ) {
              // Usar método do store para atualizar o coverId
              lojaStore.atualizarCoverDaLojaSelecionada(payload.coverId);
            }

            // Emitir evento para atualizar o coverId na loja
            this.$emit("cover-updated", payload.coverId);

            console.log("Cover atualizado com sucesso:", payload.coverId);
          } else {
            console.error(
              "Erro ao atualizar cover no backend:",
              response.message,
            );
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        // Em caso de erro, poderíamos mostrar uma mensagem ao usuário
        alert("Erro ao atualizar. Por favor, tente novamente.");
      }
    },

    async updateCoverOnBackend(coverId) {
      try {
        // Atualizar diretamente usando o código da loja
        const response = await axios.patch(
          `/api/api/stores/${this.loja.codigo}/cover`,
          {
            coverId: coverId,
          },
        );

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Erro ao atualizar cover no backend:", error);
        return {
          success: false,
          message: error.response?.data?.error || error.message,
        };
      }
    },

    async updateBadgesOnBackend(selectedBadges) {
      try {
        // Atualizar os selos diretamente usando o código da loja
        const response = await axios.patch(
          `/api/api/stores/${this.loja.codigo}/badges`,
          {
            selectedBadges: selectedBadges,
          },
        );

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Erro ao atualizar selos no backend:", error);
        return {
          success: false,
          message: error.response?.data?.error || error.message,
        };
      }
    },

    async handleInfoUpdated(info) {
      try {
        // Update store information in the backend
        const response = await this.updateStoreInfoOnBackend(info);

        if (response.success) {
          // Update the local component state
          Object.assign(this.loja, info);

          // Update the store in the store if it's the selected one
          const lojaStore = useLojaStore();
          if (
            lojaStore.lojaSelecionada &&
            lojaStore.lojaSelecionada.codigo === this.loja.codigo
          ) {
            Object.assign(lojaStore.lojaSelecionada, info);

            // Update in localStorage as well
            localStorage.setItem(
              "lojaSelecionada",
              JSON.stringify(lojaStore.lojaSelecionada),
            );
          }

          console.log("Informações da loja atualizadas com sucesso:", info);
        } else {
          console.error(
            "Erro ao atualizar informações da loja no backend:",
            response.message,
          );
        }
      } catch (error) {
        console.error("Erro ao atualizar informações da loja:", error);
        alert(
          "Erro ao atualizar as informações da loja. Por favor, tente novamente.",
        );
      }
    },

    async updateStoreInfoOnBackend(info) {
      try {
        // First, get the store to get its ID
        const lojasResponse = await axios.get(
          "/api/api/stores",
        );
        const loja = lojasResponse.data.find(
          (l) => l.codigo === this.loja.codigo,
        );

        if (!loja) {
          throw new Error("Loja não encontrada");
        }

        // Update the store with the new information
        const response = await axios.put(
          `/api/api/stores/${loja._id}`,
          {
            ...loja,
            nome: info.nome || loja.nome,
            endereco: info.endereco || loja.endereco,
            cidade: info.cidade || loja.cidade,
            metadata: {
              ...loja.metadata,
              telefone: info.telefone || loja.metadata?.telefone,
              gerente: info.gerente || loja.metadata?.gerente,
            },
            regiao: info.regiao || loja.regiao,
          },
        );

        return { success: true, data: response.data };
      } catch (error) {
        console.error(
          "Erro ao atualizar informações da loja no backend:",
          error,
        );
        return {
          success: false,
          message: error.response?.data?.error || error.message,
        };
      }
    },

    // Methods to handle badges
    getBadgeIcon(badgeId) {
      const badgeMap = {
        "badge-destaque": "fa-trophy",
        "badge-ouro": "fa-medal",
        "badge-prata": "fa-award",
        "badge-bronze": "fa-certificate",
        "badge-qualidade": "fa-star",
        "badge-desempenho": "fa-bolt",
        "badge-inovacao": "fa-lightbulb",
        "badge-sustentavel": "fa-leaf",
        "badge-cliente": "fa-heart",
        "badge-seguranca": "fa-shield-alt",
      };
      return badgeMap[badgeId] || "fa-question";
    },

    getBadgeDescription(badgeId) {
      const badgeMap = {
        "badge-destaque": "Destaque",
        "badge-ouro": "Ouro",
        "badge-prata": "Prata",
        "badge-bronze": "Bronze",
        "badge-qualidade": "Qualidade",
        "badge-desempenho": "Desempenho",
        "badge-inovacao": "Inovação",
        "badge-sustentavel": "Sustentável",
        "badge-cliente": "Cliente",
        "badge-seguranca": "Segurança",
      };
      return badgeMap[badgeId] || "Desconhecido";
    },
  },
  mounted() {
    this.atualizarStatusAuditoria();
    // Atualizar a cada minuto
    this.intervalo = setInterval(() => {
      this.atualizarStatusAuditoria();
    }, 60000);
  },
  beforeUnmount() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.perfil-header {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: -20px;
  position: relative;
}

.perfil-cover {
  height: 250px;
  position: relative;
  transition: background 0.5s ease;
  background-position: center;
  background-repeat: no-repeat;
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

.loja-status {
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

/* Status: Em andamento (bolinha piscando verde) */
.loja-status.em-andamento {
  background: rgba(76, 175, 80, 0.25);
  color: #2e7d32;
  animation: pulse-green 2s infinite;
}

.loja-status.em-andamento::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4caf50;
  margin-right: 5px;
  animation: pulse-dot 2s infinite;
}

/* Status: Pré-auditoria (contagem regressiva) */
.loja-status.pre-auditoria {
  background: #fff;
  color: #757575;
  position: relative;
  padding-left: 28px;
}

.loja-status.pre-auditoria::before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #bdbdbd;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  animation: pulse-gray 1.5s infinite;
}

@keyframes pulse-gray {
  0% {
    box-shadow: 0 0 0 0 rgba(189, 189, 189, 0.5);
    opacity: 0.8;
  }
  70% {
    box-shadow: 0 0 0 10px rgba(189, 189, 189, 0);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(189, 189, 189, 0);
    opacity: 0.8;
  }
}

.contagem-regressiva {
  background: rgba(255, 152, 0, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 700;
  margin-left: 5px;
}

/* Status: Auditoria encerrada */
.loja-status.encerrada {
  background: #e0e0e0;
  color: #e99b3c;
}

/* Status: Sem auditoria */
.loja-status.sem-auditoria {
  background-color: #e9ecef;
  color: #c93a16;
  position: relative;
  padding-left: 28px;
}

.loja-status.sem-auditoria::before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #c62828;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.5);
    opacity: 0.8;
  }
  70% {
    box-shadow: 0 0 0 10px rgba(198, 40, 40, 0);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(198, 40, 40, 0);
    opacity: 0.8;
  }
}

/* Status: Verificando */
.loja-status.verificando {
  background: rgba(33, 150, 243, 0.15);
  color: #1565c0;
}

.loja-status.verificando .fa-sync-alt {
  animation: spin 1.5s linear infinite;
}

/* Animações */
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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

.avatar-codigo {
  position: absolute;
  top: 0px;
  right: 1px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.13);
  z-index: 5;
  letter-spacing: 0.5px;
  border: 2px solid #fff;
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

.avatar-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 3.5rem;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.avatar-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #8a6d00;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.perfil-details {
  flex: 1;
  min-width: 300px;
}

.loja-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.loja-nome {
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
  padding: 2px 6px;
  transition: color 0.2s;
}

.loja-endereco {
  color: #7f8c8d;
  margin-bottom: 8px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.loja-contato {
  color: #7f8c8d;
  margin-bottom: 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.loja-horario {
  color: #7f8c8d;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  display: inline-flex;
  flex-wrap: wrap;
}

.proxima-auditoria {
  color: #667eea;
  font-weight: 600;
}

.perfil-stats {
  display: flex;
  gap: 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 10px 8px;
  border-radius: 10px;
  min-width: 180px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.stat-item {
  text-align: center;
  align-items: center;
  flex: 1;
  padding: 4px 0;
}

.stat-number {
  margin-left: 10px;
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badges-section {
  margin-top: 20px;
  padding: 15px;

  min-width: 180px;
}

.badges-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.badge-item {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  cursor: default;
}

.badge-item:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.badge-icon {
  font-size: 1.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

/* Gradientes específicos para cada tipo de badge */
.badge-icon.fa-trophy {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-medal {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-award {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-certificate {
  background: linear-gradient(135deg, #cd7f32 0%, #e6a85c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-star {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-bolt {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-lightbulb {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-leaf {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-heart {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-icon.fa-shield-alt {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Botão de informação mobile */
.btn-info-mobile {
  display: none;
  width: auto;
  height: auto;
  border-radius: 0;
  background: none;
  color: #667eea;
  border: none;
  cursor: pointer;
  box-shadow: none;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0;
  padding: 0;
  margin-right: 10px;
  margin-top: -15px;
}

.btn-info-mobile:hover {
  transform: scale(1.15);
  color: #764ba2;
}

.btn-info-mobile:active {
  transform: scale(0.95);
}

/* Container de informações */
.loja-informacoes {
  transition: all 0.3s ease;
}

/* Responsividade */
@media (max-width: 968px) {
  .perfil-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 25px;
  }

  .loja-header {
    justify-content: center;
  }

  .perfil-details {
    text-align: center;
  }

  .loja-endereco,
  .loja-contato {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .perfil-cover {
    height: 150px;
  }

  .perfil-info {
    padding: 0 20px 25px;
    margin-top: -30px;
  }

  .avatar-img,
  .avatar-placeholder {
    width: 120px;
    height: 120px;
  }

  .loja-nome {
    font-size: 2rem;
    z-index: 10;
    /* Sobrescrever gradiente para cor sólida no mobile */
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
    background-clip: unset;
    color: #2c3e50;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .perfil-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    min-width: auto;
    padding: 15px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: white;
    padding: 15px 10px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .stat-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  .stat-number {
    font-size: 1.6rem;
    margin-bottom: 4px;
    display: block;
    margin-left: 0;
  }

  .stat-label {
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .loja-status {
    font-size: 0.85rem;
    padding: 8px 14px;
  }

  /* Mostrar botão de informação no mobile */
  .btn-info-mobile {
    display: flex;
  }

  /* Esconder informações por padrão no mobile */
  .loja-informacoes {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    margin-top: 0;
  }

  /* Mostrar informações quando expandido */
  .loja-informacoes.expandido {
    max-height: 500px;
    opacity: 1;
    margin-top: 15px;
  }

  .loja-endereco,
  .loja-contato,
  .loja-horario {
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

@media (max-width: 480px) {
  .loja-header {
    flex-direction: column;
    gap: 10px;
  }

  .loja-nome {
    font-size: 1.8rem;
    z-index: 10;
    /* Cor sólida para melhor visibilidade */
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
    background-clip: unset;
    color: #2c3e50;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .loja-endereco,
  .loja-contato {
    font-size: 0.9rem;
  }

  .perfil-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 12px;
  }

  .stat-item {
    padding: 12px 8px;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .avatar-img,
  .avatar-placeholder {
    width: 110px;
    height: 110px;
    font-size: 2.5rem;
    box-shadow:
      0 4px 24px 0 rgba(102, 126, 234, 0.18),
      0 2px 0 #fff;
    border: 4px solid #fff;
    background: #f8f8fa;
    z-index: 10;
    position: relative;
  }

  .perfil-info {
    padding: 0 8px 16px;
    margin-top: -18px;
    gap: 12px;
  }

  .perfil-details {
    min-width: 0;
  }

  .loja-status {
    font-size: 0.75rem;
    padding: 6px 10px;
    flex-direction: column;
    gap: 4px;
  }
  .contagem-regressiva {
    font-size: 0.7rem;
  }
}
</style>
