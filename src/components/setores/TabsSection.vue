<template>
  <div class="tabs-section">
    <div class="tabs-header" role="tablist">
      <button
        @click="abaAtiva = 'todos'"
        :class="['tab-btn', { active: abaAtiva === 'todos' }]"
        role="tab"
        :aria-selected="abaAtiva === 'todos'"
        aria-controls="tab-todos"
        id="tab-todos-btn"
      >
        <span class="icon" aria-hidden="true">📋</span> Todos os Itens
      </button>
      <button
        @click="abaAtiva = 'lidos'"
        :class="['tab-btn', { active: abaAtiva === 'lidos' }]"
        role="tab"
        :aria-selected="abaAtiva === 'lidos'"
        aria-controls="tab-lidos"
        id="tab-lidos-btn"
      >
        <span class="icon" aria-hidden="true">✅</span> Itens Lidos
      </button>
      <button
        @click="abaAtiva = 'naoLidos'"
        :class="['tab-btn', { active: abaAtiva === 'naoLidos' }]"
        role="tab"
        :aria-selected="abaAtiva === 'naoLidos'"
        aria-controls="tab-naoLidos"
        id="tab-naoLidos-btn"
      >
        <span class="icon" aria-hidden="true">⏳</span> Itens Não Lidos
      </button>
    </div>

    <div class="tab-content">
      <!-- Resumo -->
      <div class="resumo-section">
        <h3>Resumo do Local</h3>
        <div class="progress-container">
          <div
            class="progress-bar"
            role="progressbar"
            :aria-valuenow="estatisticas.percentualLidos"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              class="progress-fill lidos"
              :style="{ width: estatisticas.percentualLidos + '%' }"
            ></div>
            <div
              class="progress-fill nao-lidos"
              :style="{ width: estatisticas.percentualNaoLidos + '%' }"
            ></div>
          </div>
          <div class="progress-labels">
            <span>✅ {{ estatisticas.percentualLidos }}% Lidos</span>
            <span>⏳ {{ estatisticas.percentualNaoLidos }}% Não Lidos</span>
          </div>
        </div>
      </div>

      <!-- Abas de conteúdo -->
      <TabContent
        :aba="'todos'"
        :ativa="abaAtiva"
        :itens="itensFiltrados"
        :titulo="tituloAbaAtiva"
      />
      <TabContent
        :aba="'lidos'"
        :ativa="abaAtiva"
        :itens="itensLidosFiltrados"
        :titulo="tituloAbaAtiva"
      />
      <TabContent
        :aba="'naoLidos'"
        :ativa="abaAtiva"
        :itens="itensNaoLidosFiltrados"
        :titulo="tituloAbaAtiva"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSetoresStore } from "@/store/setoresStore";
import TabContent from "@/components/setores/TabContent.vue";

const store = useSetoresStore();

const abaAtiva = ref("todos");

const {
  itensFiltrados,
  itensLidosFiltrados,
  itensNaoLidosFiltrados,
  estatisticasLocal: estatisticas,
  filtroLocal,
} = store;

const tituloAbaAtiva = computed(() => {
  const locais = filtroLocal ? ` no ${filtroLocal}` : "";
  switch (abaAtiva.value) {
    case "lidos":
      return `Itens Lidos${locais}`;
    case "naoLidos":
      return `Itens Não Lidos${locais}`;
    default:
      return `Todos os Itens${locais}`;
  }
});
</script>
