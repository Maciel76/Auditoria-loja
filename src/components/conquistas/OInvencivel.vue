<!-- OInvencivel.vue -->
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "OInvencivel",
  components: {
    ConquistaBase,
  },
  props: {
    usuario: {
      type: Object,
      required: true,
    },
  },
  computed: {
    conquistaData() {
      const sequenciaAtual = this.calcularSequenciaAtual();
      const desbloqueada = sequenciaAtual >= 4;

      return {
        id: "o_invencivel",
        nome: "O Invencível",
        descricao: this.gerarDescricao(sequenciaAtual),
        icone: "💪",
        xp: this.calcularXP(sequenciaAtual),
        desbloqueada: desbloqueada,
        progresso: this.calcularProgresso(sequenciaAtual),
        tipo: "única",
        dadosExtras: {
          sequenciaAtual: sequenciaAtual,
          semanasNecessarias: 4,
          dataInicioSequencia: this.obterDataInicioSequencia(),
          ultimaSemanaTop: this.obterUltimaSemanaTop(),
          semanasCompletas: this.obterSemanasCompletas(),
        },
      };
    },
  },
  methods: {
    calcularSequenciaAtual() {
      const historicoTopPerformer = this.usuario.historicoTopPerformer || [];

      // Ordena por data (mais recente primeiro)
      const semanasOrdenadas = historicoTopPerformer
        .map((semana) => ({
          ...semana,
          data: new Date(semana.data),
        }))
        .sort((a, b) => b.data - a.data);

      // Verifica sequência consecutiva
      let sequencia = 0;
      let dataEsperada = new Date();

      for (let semana of semanasOrdenadas) {
        const diferencaSemanas = this.calcularDiferencaSemanas(
          semana.data,
          dataEsperada
        );

        if (diferencaSemanas <= 1) {
          // Semana consecutiva ou atual
          sequencia++;
          dataEsperada = new Date(semana.data);
          dataEsperada.setDate(dataEsperada.getDate() - 7); // Semana anterior
        } else {
          break; // Quebrou a sequência
        }
      }

      return sequencia;
    },

    calcularDiferencaSemanas(data1, data2) {
      const diffTempo = Math.abs(data2 - data1);
      const diffSemanas = Math.ceil(diffTempo / (1000 * 60 * 60 * 24 * 7));
      return diffSemanas;
    },

    calcularProgresso(sequenciaAtual) {
      return Math.min(100, (sequenciaAtual / 4) * 100);
    },

    calcularXP(sequenciaAtual) {
      const baseXP = 500; // XP alto por ser uma conquista muito difícil

      // Bônus por sequências mais longas
      const bonusSequencia = Math.max(0, (sequenciaAtual - 4) * 50);

      return baseXP + bonusSequencia;
    },

    gerarDescricao(sequenciaAtual) {
      if (sequenciaAtual >= 4) {
        return `Invencível! ${sequenciaAtual} semanas consecutivas como Top Performer!`;
      }

      if (sequenciaAtual === 0) {
        return "Mantenha 4 semanas consecutivas como Top Performer";
      }

      return `${sequenciaAtual}/4 semanas como Top Performer consecutivas`;
    },

    obterDataInicioSequencia() {
      const historico = this.usuario.historicoTopPerformer || [];
      if (historico.length === 0) return null;

      // Encontra a data mais antiga da sequência atual
      const sequenciaAtual = this.calcularSequenciaAtual();
      if (sequenciaAtual === 0) return null;

      const semanasOrdenadas = historico
        .map((s) => ({ ...s, data: new Date(s.data) }))
        .sort((a, b) => b.data - a.data)
        .slice(0, sequenciaAtual);

      const dataMaisAntiga = semanasOrdenadas[semanasOrdenadas.length - 1].data;
      return dataMaisAntiga.toISOString().split("T")[0];
    },

    obterUltimaSemanaTop() {
      const historico = this.usuario.historicoTopPerformer || [];
      if (historico.length === 0) return null;

      const ultima = historico
        .map((s) => ({ ...s, data: new Date(s.data) }))
        .sort((a, b) => b.data - a.data)[0];

      return {
        data: ultima.data.toISOString().split("T")[0],
        posicao: ultima.posicao,
        itensLidos: ultima.itensLidos,
      };
    },

    obterSemanasCompletas() {
      const historico = this.usuario.historicoTopPerformer || [];
      return historico
        .map((s) => ({
          data: s.data,
          posicao: s.posicao,
          itensLidos: s.itensLidos,
          desempenho: s.desempenho || "excelente",
        }))
        .sort((a, b) => new Date(b.data) - new Date(a.data));
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para a conquista O Invencível */
.conquista-invencivel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-left: 4px solid #5a67d8;
  position: relative;
  overflow: hidden;
}

.conquista-invencivel::before {
  content: "💪";
  position: absolute;
  top: -15px;
  right: -15px;
  font-size: 80px;
  opacity: 0.15;
  transform: rotate(15deg);
}

.conquista-invencivel.desbloqueada {
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
  animation: invincible-glow 2s ease-in-out infinite;
}

@keyframes invincible-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(102, 126, 234, 0.8);
  }
}

/* Badge de sequência */
.badge-sequencia {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #5a67d8;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75em;
  font-weight: bold;
}
</style>
