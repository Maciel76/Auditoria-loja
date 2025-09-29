<template>
  <div class="date-selector">
    <label class="filter-label" for="data-auditoria-select">
      <span class="icon" aria-hidden="true">📅</span> Selecione a data de
      auditoria:
    </label>
    <div class="select-wrapper">
      <select
        id="data-auditoria-select"
        v-model="dataSelecionada"
        @change="trocarDataAuditoria"
        class="filter-select"
        :disabled="carregando || carregandoData"
        aria-label="Selecionar data de auditoria"
        aria-describedby="data-loading-status"
      >
        <option v-if="datasAuditoria.length === 0" value="" disabled>
          Carregando datas...
        </option>
        <option v-for="data in datasAuditoria" :key="data" :value="data">
          {{ formatarDataParaExibicao(data) }}
        </option>
      </select>
      <span
        v-if="carregandoData"
        class="select-loading"
        aria-hidden="true"
      ></span>
    </div>
    <span id="data-loading-status" class="sr-only" aria-live="polite">
      {{ carregandoData ? "Carregando dados para a data selecionada" : "" }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSetoresStore } from "@/store/setoresStore";

const store = useSetoresStore();

const dataSelecionada = computed({
  get: () => store.dataSelecionada,
  set: (value) => (store.dataSelecionada = value),
});

const { datasAuditoria, carregando, carregandoData } = store;

const formatarDataParaExibicao = (data) => {
  return new Date(data).toLocaleDateString("pt-BR");
};

const trocarDataAuditoria = async () => {
  if (!store.dataSelecionada) return;
  store.carregandoData = true;
  try {
    await store.carregarDados();
  } finally {
    store.carregandoData = false;
  }
};
</script>
