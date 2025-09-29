<template>
  <div v-if="filtroLocal" class="local-stats-section">
    <h2 class="stats-title">Estatísticas do Local: {{ filtroLocal }}</h2>
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon" aria-hidden="true">
          <span class="icon">📦</span>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.total }}</h3>
          <p>Total de Itens</p>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon" aria-hidden="true">
          <span class="icon">✅</span>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.lidos }}</h3>
          <p>Itens Lidos</p>
          <span class="stat-percentage"
            >{{ estatisticas.percentualLidos }}%</span
          >
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon" aria-hidden="true">
          <span class="icon">⏳</span>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.naoLidos }}</h3>
          <p>Itens Não Lidos</p>
          <span class="stat-percentage"
            >{{ estatisticas.percentualNaoLidos }}%</span
          >
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon" aria-hidden="true">
          <span class="icon">👥</span>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.colaboradores.length }}</h3>
          <p>Colaboradores Atuantes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSetoresStore } from "@/store/setoresStore";

const store = useSetoresStore();

const { filtroLocal, estatisticasLocal: estatisticas } = store;
</script>
