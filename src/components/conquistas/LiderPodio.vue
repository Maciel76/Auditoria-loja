<!-- LiderPodio.vue -->
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "LiderPodio",
  components: {
    ConquistaBase,
  },
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    rankingAuditoria: {
      type: Array,
      default: () => [], // Ranking atual da auditoria
    },
    auditoriaId: {
      type: String,
      required: true, // ID da auditoria atual
    },
  },
  computed: {
    conquistaData() {
      const posicaoUsuario = this.obterPosicaoUsuario();
      const desbloqueada = posicaoUsuario !== null && posicaoUsuario <= 3;

      return {
        id: `lider_podio_${this.auditoriaId}`,
        nome: this.gerarNome(posicaoUsuario),
        descricao: this.gerarDescricao(posicaoUsuario),
        icone: this.gerarIcone(posicaoUsuario),
        xp: this.calcularXP(posicaoUsuario),
        desbloqueada: desbloqueada,
        progresso: this.calcularProgresso(posicaoUsuario),
        repeticao: "recorrente",
        dadosExtras: {
          posicao: posicaoUsuario,
          totalParticipantes: this.rankingAuditoria.length,
          auditoriaId: this.auditoriaId,
          itensLidos: this.obterItensLidosUsuario(),
          diferencaProximo: this.calcularDiferencaProximo(posicaoUsuario),
        },
      };
    },
  },
  methods: {
    obterPosicaoUsuario() {
      if (!this.rankingAuditoria.length) return null;

      const usuarioRanking = this.rankingAuditoria.find(
        (participante) => participante.usuarioId === this.usuario.id
      );

      return usuarioRanking ? usuarioRanking.posicao : null;
    },

    obterItensLidosUsuario() {
      const usuarioRanking = this.rankingAuditoria.find(
        (participante) => participante.usuarioId === this.usuario.id
      );

      return usuarioRanking ? usuarioRanking.itensLidos : 0;
    },

    gerarNome(posicao) {
      const nomes = {
        1: "🥇 Líder do Pódio",
        2: "🥈 Vice-Líder",
        3: "🥉 Top 3",
      };

      return nomes[posicao] || "Líder do Pódio";
    },

    gerarDescricao(posicao) {
      if (posicao === null) {
        return "Fique entre os 3 primeiros no ranking da auditoria";
      }

      const descricoes = {
        1: "1º lugar no ranking! Maior número de itens lidos!",
        2: "2º lugar no ranking! Excelente desempenho!",
        3: "3º lugar no ranking! Entre os melhores!",
      };

      return (
        descricoes[posicao] || `Posição ${posicao} no ranking da auditoria`
      );
    },

    gerarIcone(posicao) {
      const icones = {
        1: "🥇",
        2: "🥈",
        3: "🥉",
      };

      return icones[posicao] || "🏆";
    },

    calcularXP(posicao) {
      const xpPorPosicao = {
        1: 100,
        2: 50,
        3: 25,
      };

      return xpPorPosicao[posicao] || 0;
    },

    calcularProgresso(posicao) {
      if (posicao === null) return 0;
      if (posicao === 1) return 100;
      if (posicao === 2) return 66;
      if (posicao === 3) return 33;
      return 0;
    },

    calcularDiferencaProximo(posicao) {
      if (!posicao || posicao >= 3) return null;

      const usuarioAtual = this.rankingAuditoria.find(
        (p) => p.usuarioId === this.usuario.id
      );
      const proximo = this.rankingAuditoria.find(
        (p) => p.posicao === posicao + 1
      );

      if (usuarioAtual && proximo) {
        return usuarioAtual.itensLidos - proximo.itensLidos;
      }

      return null;
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para a conquista Líder do Pódio */
.conquista-lider-podio {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: #333;
  border-left: 4px solid #ff8c00;
  position: relative;
  overflow: hidden;
}

.conquista-lider-podio[data-posicao="2"] {
  background: linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%);
}

.conquista-lider-podio[data-posicao="3"] {
  background: linear-gradient(135deg, #cd7f32 0%, #a56c2a 100%);
}

.conquista-lider-podio::before {
  content: "🏆";
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 70px;
  opacity: 0.2;
  transform: rotate(15deg);
}

.conquista-lider-podio.desbloqueada {
  animation: podium-glow 2s ease-in-out infinite;
}

@keyframes podium-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.7);
  }
}

/* Badge de posição */
.badge-posicao {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9em;
}
</style>
