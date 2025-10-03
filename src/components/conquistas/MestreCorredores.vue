<!-- MestreCorredores.vue -->
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "MestreCorredores",
  components: {
    ConquistaBase,
  },
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    corredoresLoja: {
      type: Array,
      default: () => [], // Lista de todos os corredores disponíveis na loja
    },
  },
  computed: {
    conquistaData() {
      const corredoresCobertos = this.obterCorredoresCobertos();
      const todosCorredoresCobertos =
        this.verificarCoberturaTotal(corredoresCobertos);

      return {
        id: "mestre_corredores",
        nome: "Mestre dos Corredores",
        descricao: this.gerarDescricao(corredoresCobertos),
        icone: "🏆",
        xp: this.calcularXP(corredoresCobertos),
        desbloqueada: todosCorredoresCobertos,
        progresso: this.calcularProgresso(corredoresCobertos),
        tipo: "única",
        dadosExtras: {
          corredoresCobertos: corredoresCobertos,
          corredoresFaltantes:
            this.obterCorredoresFaltantes(corredoresCobertos),
          totalCorredores: this.corredoresLoja.length,
          coberturaPercentual:
            this.calcularPercentualCobertura(corredoresCobertos),
          dataConquista: this.obterDataConquista(corredoresCobertos),
        },
      };
    },
  },
  methods: {
    obterCorredoresCobertos() {
      // Retorna array de corredores que o usuário já cobriu
      return this.usuario.corredoresCobertos || [];
    },

    verificarCoberturaTotal(corredoresCobertos) {
      // Verifica se cobriu todos os corredores da loja
      if (this.corredoresLoja.length === 0) return false;

      const idsCobertos = new Set(corredoresCobertos.map((c) => c.id || c));
      const idsLoja = new Set(this.corredoresLoja.map((c) => c.id || c));

      // Verifica se todos os corredores da loja estão cobertos
      for (let id of idsLoja) {
        if (!idsCobertos.has(id)) {
          return false;
        }
      }
      return true;
    },

    calcularProgresso(corredoresCobertos) {
      if (this.corredoresLoja.length === 0) return 0;

      const percentual =
        (corredoresCobertos.length / this.corredoresLoja.length) * 100;
      return Math.min(100, percentual);
    },

    calcularXP(corredoresCobertos) {
      // XP base alto por ser uma conquista difícil
      const baseXP = 500;

      // Bônus por lojas com muitos corredores
      const bonusTamanho = Math.min(200, this.corredoresLoja.length * 10);

      return baseXP + bonusTamanho;
    },

    gerarDescricao(corredoresCobertos) {
      const totalCobertos = corredoresCobertos.length;
      const totalLoja = this.corredoresLoja.length;

      if (totalLoja === 0) {
        return "Cubra todos os corredores da loja";
      }

      if (this.verificarCoberturaTotal(corredoresCobertos)) {
        return `Domínio total! Todos os ${totalLoja} corredores cobertos!`;
      }

      return `${totalCobertos}/${totalLoja} corredores da loja cobertos`;
    },

    obterCorredoresFaltantes(corredoresCobertos) {
      if (this.corredoresLoja.length === 0) return [];

      const idsCobertos = new Set(corredoresCobertos.map((c) => c.id || c));

      return this.corredoresLoja.filter(
        (corredor) => !idsCobertos.has(corredor.id || corredor)
      );
    },

    calcularPercentualCobertura(corredoresCobertos) {
      if (this.corredoresLoja.length === 0) return 0;

      return Math.round(
        (corredoresCobertos.length / this.corredoresLoja.length) * 100
      );
    },

    obterDataConquista(corredoresCobertos) {
      if (!this.verificarCoberturaTotal(corredoresCobertos)) return null;

      // Encontra a data do último corredor coberto (data da conquista)
      if (Array.isArray(corredoresCobertos) && corredoresCobertos[0]?.data) {
        const datas = corredoresCobertos.map((c) => c.data).sort();
        return datas[datas.length - 1]; // Data do último corredor
      }

      return new Date().toISOString().split("T")[0];
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para a conquista Mestre dos Corredores */
.conquista-mestre-corredores {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: #333;
  border-left: 4px solid #e91e63;
  position: relative;
  overflow: hidden;
}

.conquista-mestre-corredores::before {
  content: "🏆";
  position: absolute;
  top: -15px;
  right: -15px;
  font-size: 80px;
  opacity: 0.15;
  transform: rotate(15deg);
}

.conquista-mestre-corredores.desbloqueada {
  box-shadow: 0 0 30px rgba(233, 30, 99, 0.6);
  animation: trophy-glow 2s ease-in-out infinite;
}

@keyframes trophy-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(233, 30, 99, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(233, 30, 99, 0.8);
  }
}

/* Badge de progresso */
.badge-progresso {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e91e63;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75em;
  font-weight: bold;
}
</style>
