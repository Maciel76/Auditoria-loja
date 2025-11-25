<template>
  <div class="modal-overlay premium" @click="$emit('fechar')">
    <div class="modal-content premium" @click.stop>
      <div class="modal-header">
        <h2>{{ tituloModal }}</h2>
        <div class="modal-actions">
          <button class="btn-icon" @click="$emit('exportar', dados)">
            📤 Exportar
          </button>
          <button class="btn-icon" @click="$emit('fechar')">✕</button>
        </div>
      </div>
      <div class="modal-body">
        <component :is="componenteDetalhe" :dados="dados" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import AlertaDetalhe from "./AlertaDetalhe.vue";
import AnaliseDetalhe from "./AnaliseDetalhe.vue";
import RecomendacaoDetalhe from "./RecomendacaoDetalhe.vue";

export default {
  name: "AdvancedAnalyticsModal",
  props: {
    dados: Object,
    tipo: String,
  },
  emits: ["fechar", "exportar"],
  setup(props) {
    const tituloModal = computed(() => {
      const titulos = {
        alerta: "Detalhes do Alerta",
        analise: "Análise Detalhada",
        recomendacao: "Detalhes da Recomendação",
      };
      return titulos[props.tipo] || "Detalhes";
    });

    const componenteDetalhe = computed(() => {
      const componentes = {
        alerta: AlertaDetalhe,
        analise: AnaliseDetalhe,
        recomendacao: RecomendacaoDetalhe,
      };
      return componentes[props.tipo] || "div";
    });

    return {
      tituloModal,
      componenteDetalhe,
    };
  },
};
</script>

<style scoped>
.modal-overlay.premium {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
}

.modal-content.premium {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 25px;
  padding: 0;
  max-width: 90vw;
  max-height: 90vh;
  width: 1200px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-header h2 {
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.8em;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-body {
  padding: 30px;
  max-height: calc(90vh - 100px);
  overflow-y: auto;
}
</style>
