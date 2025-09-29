<template>
  <div
    v-show="ativa === aba"
    role="tabpanel"
    :id="`tab-${aba}`"
    :aria-labelledby="`tab-${aba}-btn`"
    class="tab-panel"
  >
    <h3>{{ titulo }}</h3>
    <p v-if="itens.length === 0" class="no-results">
      {{ mensagemSemResultados }}
    </p>
    <ItemList v-else :itens="itens" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ItemList from "@/components/setores/ItemList.vue";

const props = defineProps({
  aba: {
    type: String,
    required: true,
  },
  ativa: {
    type: String,
    required: true,
  },
  itens: {
    type: Array,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
});

const mensagemSemResultados = computed(() => {
  switch (props.aba) {
    case "lidos":
      return "Nenhum item lido encontrado para os filtros selecionados.";
    case "naoLidos":
      return "Nenhum item não lido encontrado para os filtros selecionados.";
    default:
      return "Nenhum item encontrado para os filtros selecionados.";
  }
});
</script>
