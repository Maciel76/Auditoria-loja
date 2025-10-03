<!-- GuardiaoPresencaAvancado.vue -->
<template>
  <div class="guardiao-presenca-avancado">
    <ConquistaBase :conquista-data="conquistaData" />

    <!-- Mostrar corredores completos quando desbloqueada -->
    <div
      v-if="conquistaData.desbloqueada && corredoresCompletos.length > 0"
      class="corredores-completos"
    >
      <h4>Corredores Perfeitos:</h4>
      <div class="corredores-lista">
        <div
          v-for="corredor in corredoresCompletos"
          :key="corredor.id"
          class="corredor-item"
        >
          <span class="corredor-icone">✅</span>
          <span class="corredor-nome">{{ corredor.nome }}</span>
          <span class="corredor-data">{{ formatarData(corredor.data) }}</span>
          <span class="corredor-itens"
            >{{ corredor.itensAuditados }} itens</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConquistaBase from "./ConquistaBase.vue";

export default {
  name: "GuardiaoPresencaAvancado",
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
      // Mesma lógica do componente básico
      const corredoresCompletos = this.obterCorredoresCompletos();
      const desbloqueada = corredoresCompletos.length > 0;

      return {
        id: "guardiao_presenca_avancado",
        nome: this.gerarNome(corredoresCompletos),
        descricao: this.gerarDescricao(corredoresCompletos),
        icone: this.gerarIcone(corredoresCompletos),
        xp: this.calcularXP(corredoresCompletos),
        desbloqueada: desbloqueada,
        progresso: this.calcularProgresso(corredoresCompletos),
        tipo: "única",
        dadosExtras: {
          corredoresCompletos: corredoresCompletos,
          nivelGuardiao: this.calcularNivelGuardiao(corredoresCompletos),
        },
      };
    },

    corredoresCompletos() {
      return this.obterCorredoresCompletos();
    },
  },
  methods: {
    obterCorredoresCompletos() {
      // Implementação igual ao componente anterior
      const auditoriasPresenca = this.usuario.auditorias?.presenca || [];

      return auditoriasPresenca
        .filter(
          (auditoria) =>
            this.verificarCoberturaCompleta(auditoria) &&
            this.verificarPrecisaoPerfeita(auditoria)
        )
        .map((auditoria) => ({
          id: auditoria.corredorId,
          nome: auditoria.corredorNome,
          data: auditoria.data,
          totalItens: auditoria.totalItens,
          itensAuditados: auditoria.itensAuditados,
          precisao: auditoria.taxaPrecisao,
        }));
    },

    verificarCoberturaCompleta(auditoria) {
      return auditoria.itensAuditados >= auditoria.totalItens;
    },

    verificarPrecisaoPerfeita(auditoria) {
      return auditoria.taxaPrecisao === 100;
    },

    gerarNome(corredoresCompletos) {
      const niveis = {
        1: "Guardião da Presença",
        3: "Guardião Elite",
        5: "Mestre da Presença",
        10: "Lenda da Auditoria",
      };

      const nivel = this.calcularNivelGuardiao(corredoresCompletos);
      return niveis[nivel] || "Guardião Supremo";
    },

    gerarIcone(corredoresCompletos) {
      const nivel = this.calcularNivelGuardiao(corredoresCompletos);
      const icones = ["🛡️", "⚔️", "🏆", "👑"];

      return icones[Math.min(nivel - 1, icones.length - 1)] || "🛡️";
    },

    calcularNivelGuardiao(corredoresCompletos) {
      const total = corredoresCompletos.length;
      if (total >= 10) return 4;
      if (total >= 5) return 3;
      if (total >= 3) return 2;
      return 1;
    },

    calcularProgresso(corredoresCompletos) {
      const nivel = this.calcularNivelGuardiao(corredoresCompletos);
      return Math.min(100, (nivel / 4) * 100);
    },

    calcularXP(corredoresCompletos) {
      const baseXP = 200;
      const bonusPorCorredor = 75; // Bônus maior na versão avançada
      const bonusNivel = this.calcularNivelGuardiao(corredoresCompletos) * 50;

      return (
        baseXP + corredoresCompletos.length * bonusPorCorredor + bonusNivel
      );
    },

    gerarDescricao(corredoresCompletos) {
      const total = corredoresCompletos.length;

      if (total === 0) {
        return "Complete um corredor com cobertura e precisão totais";
      }

      const descricoes = {
        1: "Primeiro corredor completo com perfeição!",
        3: "Domínio em múltiplos corredores",
        5: "Mestre da auditoria de presença",
        10: "Lendária precisão em todos os corredores",
      };

      return descricoes[total] || `${total} corredores com auditoria perfeita`;
    },

    formatarData(dataString) {
      return new Date(dataString).toLocaleDateString("pt-BR");
    },
  },
};
</script>

<style scoped>
.guardiao-presenca-avancado {
  position: relative;
}

.corredores-completos {
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border-left: 3px solid #00f2fe;
}

.corredores-completos h4 {
  margin: 0 0 10px 0;
  color: #00f2fe;
  font-size: 0.9em;
}

.corredores-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.corredor-item {
  display: grid;
  grid-template-columns: 25px 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.85em;
}

.corredor-data {
  color: #ccc;
  font-size: 0.8em;
}

.corredor-itens {
  color: #4caf50;
  font-weight: bold;
  font-size: 0.8em;
}

/* Diferentes estilos baseados no nível */
.conquista-guardiao-presenca[data-nivel="2"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.conquista-guardiao-presenca[data-nivel="3"] {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.conquista-guardiao-presenca[data-nivel="4"] {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #333;
  animation: legendary-glow 2s ease-in-out infinite;
}

@keyframes legendary-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(252, 182, 159, 0.6);
  }
  50% {
    box-shadow: 0 0 40px rgba(252, 182, 159, 0.9);
  }
}
</style>
