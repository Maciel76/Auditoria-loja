<!-- PioneiroDia.vue -->
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "PioneiroDia",
  components: {
    ConquistaBase,
  },
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    auditoriaAtual: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    conquistaData() {
      const foiPioneiro = this.verificarSeFoiPioneiro();
      const dataAtual = this.obterDataAtual();

      return {
        id: `pioneiro_dia_${dataAtual}`,
        nome: "Pioneiro do Dia",
        descricao: this.gerarDescricao(foiPioneiro),
        icone: "🌅",
        xp: this.calcularXP(foiPioneiro),
        desbloqueada: foiPioneiro,
        progresso: this.calcularProgresso(foiPioneiro),
        repeticao: "diária",
        dadosExtras: {
          foiPioneiro: foiPioneiro,
          dataAuditoria: dataAtual,
          horarioPrimeiraLeitura: this.obterHorarioPrimeiraLeitura(),
          totalParticipantes: this.obterTotalParticipantes(),
          diasComoPioneiro: this.calcularDiasComoPioneiro(),
        },
      };
    },
  },
  methods: {
    verificarSeFoiPioneiro() {
      // Verifica se o usuário foi o primeiro a fazer leitura hoje
      const primeiraLeitura = this.auditoriaAtual.primeiraLeitura;

      if (!primeiraLeitura || !primeiraLeitura.usuarioId) {
        return false;
      }

      return primeiraLeitura.usuarioId === this.usuario.id;
    },

    obterDataAtual() {
      return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    },

    calcularProgresso(foiPioneiro) {
      return foiPioneiro ? 100 : 0;
    },

    calcularXP(foiPioneiro) {
      return foiPioneiro ? 25 : 0; // XP por ser o primeiro do dia
    },

    gerarDescricao(foiPioneiro) {
      if (foiPioneiro) {
        const horario = this.obterHorarioPrimeiraLeitura();
        return `Primeira leitura do dia às ${horario}!`;
      }

      return "Seja o primeiro a fazer uma leitura na auditoria do dia";
    },

    obterHorarioPrimeiraLeitura() {
      const primeiraLeitura = this.auditoriaAtual.primeiraLeitura;

      if (!primeiraLeitura || !primeiraLeitura.horario) {
        return "--:--";
      }

      return primeiraLeitura.horario;
    },

    obterTotalParticipantes() {
      return this.auditoriaAtual.participantes?.length || 0;
    },

    calcularDiasComoPioneiro() {
      const historico = this.usuario.historicoPioneiro || [];
      return historico.length;
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para a conquista Pioneiro do Dia */
.conquista-pioneiro-dia {
  background: linear-gradient(135deg, #ff9a8b 0%, #ff6a88 100%);
  color: white;
  border-left: 4px solid #ff4757;
  position: relative;
  overflow: hidden;
}

.conquista-pioneiro-dia::before {
  content: "🌅";
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 70px;
  opacity: 0.2;
  transform: rotate(-10deg);
}

.conquista-pioneiro-dia.desbloqueada {
  box-shadow: 0 0 25px rgba(255, 106, 136, 0.5);
  animation: sunrise-glow 3s ease-in-out infinite;
}

@keyframes sunrise-glow {
  0%,
  100% {
    box-shadow: 0 0 15px rgba(255, 106, 136, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 106, 136, 0.7);
  }
}

/* Badge de pioneiro */
.badge-pioneiro {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #ff4757;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8em;
}
</style>
