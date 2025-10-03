<!-- TopPerformer.vue -->
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "TopPerformer",
  components: {
    ConquistaBase,
  },
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    // Prop opcional para receber dados comparativos externos
    metricasGerais: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    conquistaData() {
      const acimaDaMedia = this.calcularAcimaDaMedia();

      return {
        id: "top_performer",
        nome: "Top Performer",
        descricao: this.obterDescricao(),
        icone: "⭐",
        xp: this.calcularXP(),
        desbloqueada: acimaDaMedia,
        progresso: this.calcularProgresso(),
        dadosExtras: {
          acimaDaMedia: acimaDaMedia,
          metricasUsuario: this.obterMetricasUsuario(),
          metricasComparativas: this.obterMetricasComparativas(),
          periodo: this.obterPeriodo(),
        },
      };
    },
  },
  methods: {
    calcularAcimaDaMedia() {
      // Lógica para determinar se o usuário está acima da média
      // Baseado nas métricas disponíveis

      const metricasUsuario = this.obterMetricasUsuario();
      const metricasGerais = this.obterMetricasGerais();

      // Verificar múltiplos critérios
      const criterios = [
        this.verificarProdutividade(metricasUsuario, metricasGerais),
        this.verificarPrecisao(metricasUsuario, metricasGerais),
        this.verificarConsistencia(metricasUsuario, metricasGerais),
      ];

      // Considera Top Performer se atende a pelo menos 2 dos 3 critérios
      return criterios.filter(Boolean).length >= 2;
    },

    verificarProdutividade(metricasUsuario, metricasGerais) {
      const produtividadeUsuario = metricasUsuario.itensPorHora || 0;
      const mediaProdutividade = metricasGerais.mediaItensPorHora || 30; // Valor padrão

      return produtividadeUsuario > mediaProdutividade;
    },

    verificarPrecisao(metricasUsuario, metricasGerais) {
      const precisaoUsuario = metricasUsuario.taxaAcerto || 0;
      const mediaPrecisao = metricasGerais.mediaTaxaAcerto || 85; // 85% padrão

      return precisaoUsuario > mediaPrecisao;
    },

    verificarConsistencia(metricasUsuario, metricasGerais) {
      const consistenciaUsuario = metricasUsuario.diasAtivos || 0;
      const mediaConsistencia = metricasGerais.mediaDiasAtivos || 15; // Dias no mês

      return consistenciaUsuario > mediaConsistencia;
    },

    obterMetricasUsuario() {
      return {
        itensPorHora: this.usuario.metricas?.itensPorHora || 0,
        taxaAcerto: this.usuario.metricas?.taxaAcerto || 0,
        diasAtivos: this.usuario.metricas?.diasAtivos || 0,
        totalItens: this.usuario.contador || 0,
        nivel: this.usuario.nivel || 1,
      };
    },

    obterMetricasGerais() {
      // Se recebemos métricas externas, usamos elas
      if (Object.keys(this.metricasGerais).length > 0) {
        return this.metricasGerais;
      }

      // Caso contrário, usamos valores padrão baseados em estatísticas gerais
      return {
        mediaItensPorHora: 35,
        mediaTaxaAcerto: 88,
        mediaDiasAtivos: 18,
        totalUsuarios: 150,
        periodo: "mensal",
      };
    },

    calcularProgresso() {
      const metricasUsuario = this.obterMetricasUsuario();
      const metricasGerais = this.obterMetricasGerais();

      // Calcula um score geral baseado em como está em relação à média
      const scores = [
        Math.min(
          100,
          (metricasUsuario.itensPorHora / metricasGerais.mediaItensPorHora) *
            100
        ),
        Math.min(
          100,
          (metricasUsuario.taxaAcerto / metricasGerais.mediaTaxaAcerto) * 100
        ),
        Math.min(
          100,
          (metricasUsuario.diasAtivos / metricasGerais.mediaDiasAtivos) * 100
        ),
      ];

      // Média dos scores
      return scores.reduce((a, b) => a + b, 0) / scores.length;
    },

    calcularXP() {
      // XP base + bônus por excelência
      const baseXP = 100;
      const metricasUsuario = this.obterMetricasUsuario();

      // Bônus por estar significativamente acima da média
      let bonus = 0;
      if (this.calcularProgresso() > 120) bonus = 50;
      if (this.calcularProgresso() > 150) bonus = 100;

      return baseXP + bonus;
    },

    obterDescricao() {
      const progresso = this.calcularProgresso();

      if (progresso > 150) {
        return "Desempenho excepcional - muito acima da média geral!";
      } else if (progresso > 120) {
        return "Alto desempenho - significativamente acima da média";
      } else {
        return "Acima da média geral de desempenho";
      }
    },

    obterMetricasComparativas() {
      const user = this.obterMetricasUsuario();
      const geral = this.obterMetricasGerais();

      return {
        produtividade: {
          usuario: user.itensPorHora,
          media: geral.mediaItensPorHora,
          diferenca: (
            ((user.itensPorHora - geral.mediaItensPorHora) /
              geral.mediaItensPorHora) *
            100
          ).toFixed(1),
        },
        precisao: {
          usuario: user.taxaAcerto,
          media: geral.mediaTaxaAcerto,
          diferenca: (
            ((user.taxaAcerto - geral.mediaTaxaAcerto) /
              geral.mediaTaxaAcerto) *
            100
          ).toFixed(1),
        },
        consistencia: {
          usuario: user.diasAtivos,
          media: geral.mediaDiasAtivos,
          diferenca: (
            ((user.diasAtivos - geral.metediaDiasAtivos) /
              geral.mediaDiasAtivos) *
            100
          ).toFixed(1),
        },
      };
    },

    obterPeriodo() {
      return this.metricasGerais.periodo || "mensal";
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para a conquista Top Performer */
.conquista-top-performer {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: #333;
  border-left: 4px solid #ff8c00;
}

.conquista-top-performer.desbloqueada {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  animation: pulse-gold 2s infinite;
}

@keyframes pulse-gold {
  0% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
  }
}
</style>
