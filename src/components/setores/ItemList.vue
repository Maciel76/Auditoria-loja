<template>
  <div class="itens-grid">
    <div
      v-for="item in itens"
      :key="item.Código"
      :class="['item-card', { 'nao-lido': item.Situacao !== 'Atualizado' }]"
    >
      <div class="item-header">
        <span class="item-codigo">{{ item.Código }}</span>
        <span
          :class="[
            'item-status',
            item.Situacao === 'Atualizado' ? 'lido' : 'nao-lido',
          ]"
        >
          {{ item.Situacao === "Atualizado" ? "✅ Lido" : "⏳ Não Lido" }}
        </span>
      </div>

      <div class="item-body">
        <h4
          class="item-nome"
          v-html="destacarTermo(item.Produto, filtroProduto)"
        ></h4>
        <div class="item-details">
          <div class="detail">
            <span class="icon" aria-hidden="true">📦</span>
            <span>Estoque: {{ item["Estoque atual"] || 0 }}</span>
          </div>
          <div class="detail">
            <span class="icon" aria-hidden="true">👤</span>
            <span>{{ item.Usuario || "N/A" }}</span>
          </div>
          <div class="detail">
            <span class="icon" aria-hidden="true">📅</span>
            <span
              >Última compra: {{ formatarData(item["Última compra"]) }}</span
            >
          </div>
        </div>
      </div>

      <div class="item-actions">
        <button
          v-if="item.Situacao !== 'Atualizado'"
          class="action-btn primary"
          aria-label="Marcar item como lido"
        >
          <span class="icon" aria-hidden="true">✏️</span> Marcar como Lido
        </button>
        <button class="action-btn secondary" aria-label="Ver detalhes do item">
          <span class="icon" aria-hidden="true">📊</span> Detalhes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSetoresStore } from "@/store/setoresStore";

const store = useSetoresStore();

defineProps({
  itens: {
    type: Array,
    required: true,
  },
});

const { filtroProduto } = store;

const destacarTermo = (texto, termo) => {
  if (!termo || !texto) return texto;
  const escaped = termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return texto.replace(regex, "<mark>$1</mark>");
};

const formatarData = (data) => {
  if (!data) return "N/A";
  return data;
};
</script>
