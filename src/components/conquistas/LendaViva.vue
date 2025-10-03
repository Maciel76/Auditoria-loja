<!-- LendaViva.vue -->
<template>
  <ConquistaBase :conquista-data="conquistaData" />
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "LendaViva",
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
      const niveis = this.obterNiveis();
      const diasAuditados = this.usuario.diasAuditados || 0;

      // Encontrar nível atual e próximo nível
      const nivelAtual = this.encontrarNivelAtual(diasAuditados, niveis);
      const proximoNivel = this.encontrarProximoNivel(diasAuditados, niveis);

      return {
        id: `lenda_viva_${nivelAtual.meta}`,
        nome: nivelAtual.nome,
        descricao: this.gerarDescricao(nivelAtual, diasAuditados),
        icone: nivelAtual.icone,
        xp: nivelAtual.xp,
        desbloqueada: diasAuditados >= nivelAtual.meta,
        progresso: this.calcularProgresso(
          diasAuditados,
          nivelAtual,
          proximoNivel
        ),
        repeticao: "recorrente",
        dadosExtras: {
          nivelAtual: nivelAtual.meta,
          nivelAtualNome: nivelAtual.nome,
          proximoNivel: proximoNivel.meta,
          proximoNivelNome: proximoNivel.nome,
          diasAuditados: diasAuditados,
          progressoParaProximo: this.calcularProgressoParaProximo(
            diasAuditados,
            nivelAtual,
            proximoNivel
          ),
        },
      };
    },
  },
  methods: {
    obterNiveis() {
      return [
        { meta: 5, nome: "Iniciante Dedicado", xp: 25, icone: "🌱" },
        { meta: 10, nome: "Auditor Ativo", xp: 50, icone: "🚀" },
        { meta: 25, nome: "Veterano", xp: 100, icone: "🛡️" },
        { meta: 50, nome: "Lenda Viva", xp: 250, icone: "🏛️" },
        { meta: 75, nome: "Mestre Lendário", xp: 400, icone: "👑" },
        { meta: 100, nome: "Ícone dos Auditores", xp: 600, icone: "🌟" },
        { meta: 200, nome: "Lenda Imortal", xp: 1000, icone: "💫" },
      ];
    },

    encontrarNivelAtual(diasAuditados, niveis) {
      // Encontra o nível mais alto que o usuário atingiu
      const niveisAtingidos = niveis.filter(
        (nivel) => diasAuditados >= nivel.meta
      );
      return niveisAtingidos.length > 0
        ? niveisAtingidos[niveisAtingidos.length - 1]
        : { meta: 0, nome: "Novato", xp: 0, icone: "🎯" };
    },

    encontrarProximoNivel(diasAuditados, niveis) {
      // Encontra o próximo nível a ser alcançado
      const proximo = niveis.find((nivel) => nivel.meta > diasAuditados);
      return proximo || this.encontrarNivelAtual(diasAuditados, niveis);
    },

    calcularProgresso(diasAuditados, nivelAtual, proximoNivel) {
      if (diasAuditados >= proximoNivel.meta) {
        return 100; // Já atingiu o próximo nível
      }

      if (nivelAtual.meta === proximoNivel.meta) {
        return 100; // É o último nível
      }

      const range = proximoNivel.meta - nivelAtual.meta;
      const progresso = diasAuditados - nivelAtual.meta;

      return Math.min(100, (progresso / range) * 100);
    },

    calcularProgressoParaProximo(diasAuditados, nivelAtual, proximoNivel) {
      if (nivelAtual.meta === proximoNivel.meta) {
        return { atual: 0, total: 0, percentual: 100 };
      }

      const atual = diasAuditados - nivelAtual.meta;
      const total = proximoNivel.meta - nivelAtual.meta;
      const percentual = Math.min(100, (atual / total) * 100);

      return { atual, total, percentual };
    },

    gerarDescricao(nivelAtual, diasAuditados) {
      const base = "Realizou auditorias em dias diferentes";

      if (nivelAtual.meta === 200) {
        return `${base} - Lenda Imortal alcançada!`;
      }

      return `${base} - ${diasAuditados}/${nivelAtual.meta} dias`;
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para a conquista Lenda Viva */
.conquista-lenda-viva {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-left: 4px solid #5a67d8;
  position: relative;
}

.conquista-lenda-viva.desbloqueada {
  box-shadow: 0 0 25px rgba(102, 126, 234, 0.5);
}

.conquista-lenda-viva::after {
  content: "🏛️";
  position: absolute;
  top: -15px;
  right: -15px;
  font-size: 80px;
  opacity: 0.1;
  transform: rotate(15deg);
  z-index: 0;
}

/* Diferentes cores baseadas no nível */
.conquista-lenda-viva[data-nivel="50"] {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.conquista-lenda-viva[data-nivel="75"] {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.conquista-lenda-viva[data-nivel="100"] {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.conquista-lenda-viva[data-nivel="200"] {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    box-shadow: 0 0 10px rgba(250, 112, 154, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(250, 112, 154, 0.8);
  }
  100% {
    box-shadow: 0 0 10px rgba(250, 112, 154, 0.5);
  }
}
</style>
