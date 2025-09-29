<template>
  <div v-if="filtrosAtivos.length > 0" class="active-filters">
    <h3 class="active-filters-title">Filtros aplicados:</h3>
    <div class="filters-list">
      <span
        v-for="(filtro, index) in filtrosAtivos"
        :key="index"
        class="filter-tag"
      >
        {{ filtro }}
        <button
          @click="removerFiltro(filtro)"
          class="remove-filter"
          :aria-label="`Remover filtro ${filtro}`"
        >
          &times;
        </button>
      </span>
    </div>
    <button
      @click="limparFiltros"
      class="btn btn-secondary"
      aria-label="Limpar todos os filtros"
    >
      Limpar todos
    </button>
  </div>
</template>

<script setup>
import { useSetoresStore } from "@/store/setoresStore";

const store = useSetoresStore();

const { filtrosAtivos, limparFiltros, removerFiltro } = store;
</script>
