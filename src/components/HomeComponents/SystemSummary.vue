<template>
  <div class="system-summary">
    <h3>📈 Sugestões Para Implementa</h3>
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-number">{{ stats.activeAudits }}</span>
        <span class="summary-label">Qtd. sugestão</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">{{ stats.onlineUsers }}</span>
        <span class="summary-label"> Sugestão Pedentes</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">{{ stats.acceptedSuggestions }}</span>
        <span class="summary-label">Sugestões Aceitas</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">{{ stats.inDevelopment }}</span>
        <span class="summary-label">Sugestões Aceitas</span>
      </div>
      <span>Ver tudo</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      activeAudits: 0,
      onlineUsers: 0,
      acceptedSuggestions: 0,
      inDevelopment: 0,
    }),
  },
});
</script>

<style scoped>
.system-summary {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.system-summary h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.summary-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.summary-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
}

.summary-label {
  font-size: 0.75rem;
  color: #64748b;
}
</style>
