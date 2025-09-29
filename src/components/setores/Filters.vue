<template>
  <div class="filters-section">
    <div class="filter-group">
      <label class="filter-label" for="filtro-local">
        <span class="icon" aria-hidden="true">📍</span> Filtrar por
        Local/Corredor:
      </label>
      <select id="filtro-local" v-model="filtroLocal" class="filter-select">
        <option value="">Todos os locais</option>
        <option v-for="local in locaisUnicos" :key="local" :value="local">
          {{ local }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="filtro-status">
        <span class="icon" aria-hidden="true">📊</span> Status:
      </label>
      <select id="filtro-status" v-model="filtroStatus" class="filter-select">
        <option value="">Todos os status</option>
        <option value="Atualizado">Itens Lidos</option>
        <option value="Não lido">Itens Não Lidos</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label" for="produto-search">
        <span class="icon" aria-hidden="true">🔍</span> Buscar produto:
      </label>
      <div class="search-wrapper">
        <input
          id="produto-search"
          v-model="filtroProdutoInput"
          type="text"
          placeholder="Digite o nome do produto..."
          class="filter-input"
          aria-label="Buscar produto"
        />
        <span
          v-if="buscandoProduto"
          class="search-loading"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useSetoresStore } from "@/store/setoresStore";
import { debounce } from "lodash";

const store = useSetoresStore();

const filtroLocal = computed({
  get: () => store.filtroLocal,
  set: (value) => (store.filtroLocal = value),
});

const filtroStatus = computed({
  get: () => store.filtroStatus,
  set: (value) => (store.filtroStatus = value),
});

const filtroProdutoInput = ref("");
const buscandoProduto = ref(false);

const { locaisUnicos } = store;

watch(
  filtroProdutoInput,
  debounce((newValue) => {
    buscandoProduto.value = true;
    setTimeout(() => {
      store.filtroProduto = newValue;
      buscandoProduto.value = false;
    }, 300);
  }, 500)
);
</script>
