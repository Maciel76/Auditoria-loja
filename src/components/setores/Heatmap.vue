<template>
  <div class="heatmap-section">
    <h2 class="section-title">Mapa de Calor por Corredor</h2>
    <div class="heatmap-grid">
      <div
        v-for="local in locaisComEstatisticas"
        :key="local.nome"
        :class="['heatmap-item', getHeatmapClass(local.percentualLidos)]"
        @click="filtroLocal = local.nome"
        :aria-label="`${local.nome}: ${local.percentualLidos}% de itens lidos. Clique para filtrar por este local.`"
        tabindex="0"
        @keyup.enter="filtroLocal = local.nome"
        @keyup.space="filtroLocal = local.nome"
      >
        <div class="heatmap-header">
          <span class="heatmap-title">{{ local.nome }}</span>
          <span class="heatmap-percentage">{{ local.percentualLidos }}%</span>
        </div>
        <div class="heatmap-progress">
          <div
            class="heatmap-progress-bar"
            :style="{ width: local.percentualLidos + '%' }"
          ></div>
        </div>
        <div class="heatmap-stats">
          <span>{{ local.lidos }}/{{ local.total }} itens</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSetoresStore } from "@/store/setoresStore";

const store = useSetoresStore();

const { locaisComEstatisticas, filtroLocal } = store;

const getHeatmapClass = (percentual) => {
  if (percentual >= 90) return "excelente";
  if (percentual >= 70) return "bom";
  if (percentual >= 50) return "medio";
  if (percentual >= 30) return "baixo";
  return "critico";
};
</script>
